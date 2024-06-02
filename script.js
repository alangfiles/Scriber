const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');
const prevChapterBtn = document.getElementById('prev-chapter');
const nextChapterBtn = document.getElementById('next-chapter');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');

let currentChapter = parseInt(localStorage.getItem('currentChapter')) || 0;
let currentVerse = parseInt(localStorage.getItem('currentVerse')) || 0;
let userInputText = localStorage.getItem('userInput') || '';

const updateDisplay = () => {
  const text = bibleText[currentChapter][currentVerse];
  const highlightedText = text.slice(0, userInputText.length);
  const remainingText = text.slice(userInputText.length);
  textDisplay.innerHTML = `<span class="highlighted">${highlightedText}</span><span>${remainingText}</span>`;
  userInput.value = userInputText;
  localStorage.setItem('currentChapter', currentChapter);
  localStorage.setItem('currentVerse', currentVerse);
  localStorage.setItem('userInput', userInputText);
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
