const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');
const userChapterDisplay = document.getElementById('user-chapter');
const prevChapterBtn = document.getElementById('prev-chapter');
const nextChapterBtn = document.getElementById('next-chapter');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');

let currentChapter = parseInt(localStorage.getItem('currentChapter')) || 0;
let currentVerse = parseInt(localStorage.getItem('currentVerse')) || 0;
let userInputText = localStorage.getItem('userInput') || '';

const updateDisplay = () => {
  const chapter = bibleText[currentChapter];
  let displayText = '';
  let userChapterText = '';

  chapter.forEach((verse, index) => {
    let highlightedText = '';
    let remainingText = verse;
    let isCurrentVerse = index === currentVerse;

    if (userInputText.length > 0 && isCurrentVerse) {
      if (userInputText.length >= verse.length) {
        highlightedText = verse;
        remainingText = '';
        userInputText = '';
        localStorage.setItem('userInput', userInputText);
      } else {
        highlightedText = verse.slice(0, userInputText.length);
        remainingText = verse.slice(userInputText.length);
      }
    }

    if (isCurrentVerse) {
      displayText += `<span class="highlighted">${highlightedText}</span><span class="cursor">${remainingText.charAt(0)}</span><span>${remainingText.slice(1)}</span><br>`;
    } else if (highlightedText.length > 0) {
      displayText += `<span class="completed">${highlightedText}</span><span>${remainingText}</span><br>`;
    } else {
      displayText += `<span>${verse}</span><br>`;
    }

    userChapterText += verse + '<br>';
  });

  textDisplay.innerHTML = displayText;
  userChapterDisplay.innerHTML = userChapterText;
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
    } else {
      navigateVerse(1);
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

prevChapterBtn.addEventListener('click', () => navigateChapter(-1));
nextChapterBtn.addEventListener('click', () => navigateChapter(1));
prevVerseBtn.addEventListener('click', () => navigateVerse(-1));
nextVerseBtn.addEventListener('click', () => navigateVerse(1));

updateDisplay();
