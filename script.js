const sourceChapterDisplay = document.getElementById('text-display');
const userChapterDisplay = document.getElementById('user-text-display');
const userInput = document.getElementById('user-input');
const prevChapterBtn = document.getElementById('prev-chapter');
const nextChapterBtn = document.getElementById('next-chapter');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');

let currentChapter = parseInt(localStorage.getItem('currentChapter')) || 0;
let currentVerse = parseInt(localStorage.getItem('currentVerse')) || 0;
let userInputText = localStorage.getItem('userInput') || '';
let userChapter = JSON.parse(localStorage.getItem('userChapter')) || [];

const updateDisplay = () => {
  const chapter = bibleText[currentChapter];
  let sourceDisplayText = '';
  let userDisplayText = '';

  chapter.forEach((verse, index) => {
    sourceDisplayText += `<sup class="verse-number">${index+1}</sup>`;
    let highlightedText = '';
    let remainingText = verse;
    let isCurrentVerse = index === currentVerse;

    if (userInputText.length > 0 && isCurrentVerse) {
      if (userInputText.length >= verse.length) {
        highlightedText = verse;
        remainingText = '';
        userInputText = '';
        localStorage.setItem('userInput', userInputText);
        userChapter.push(verse);
        localStorage.setItem('userChapter', JSON.stringify(userChapter));
      } else {
        highlightedText = verse.slice(0, userInputText.length);
        remainingText = verse.slice(userInputText.length);
      }
    }

    if (isCurrentVerse) {
      sourceDisplayText += `<span class="highlighted">${highlightedText}</span><span class="cursor">${remainingText.charAt(0)}</span><span>${remainingText.slice(1)}</span><br>`;
    } else if (highlightedText.length > 0) {
      sourceDisplayText += `<span class="completed">${highlightedText}</span><span>${remainingText}</span><br>`;
    } else {
      sourceDisplayText += `<span>${verse}</span><br>`;
    }
  });

  chapter.forEach((verse, index) => {
    
    if (userChapter.includes(verse)) {
      userDisplayText += `<sup class="verse-number">${index+1}</sup>`;
      userDisplayText += `<span>${verse}</span><br>`;
    }
  });

  //current verse to user Display
  userDisplayText += `<span>${userInputText}</span>`;

  sourceChapterDisplay.innerHTML = sourceDisplayText;
  userChapterDisplay.innerHTML = userDisplayText;
};

userInput.addEventListener('input', (e) => {
  userInputText = e.target.value;
  updateDisplay();
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    if (e.shiftKey) {
      navigateVerse(-1);
      userInput.value = '';
    } else {
      navigateVerse(1);
      userInput.value = '';
    }
  }
});

const navigateVerse = (change) => {
  currentVerse += change;
  if (currentVerse < 0) {
    currentChapter = Math.max(0, currentChapter - 1);
    currentVerse = bibleText[currentChapter].length - 1;
  } else if (currentVerse >= bibleText[currentChapter].length) {
    currentChapter = Math.min(bibleText.length - 1, currentChapter + 1);
    currentVerse = 0;
  }
  userInputText = '';
  updateDisplay();
};

const navigateChapter = (change) => {
  currentChapter += change;
  currentChapter = Math.max(0, Math.min(bibleText.length - 1, currentChapter));
  currentVerse = 0;
  userInputText = '';
  updateDisplay();
};

updateDisplay();
