// База данных клипов (Сюда можно добавлять любые свои треки)
const clipsDataset = [
    {
        artist: "Big Baby Tape",
        track: "Gimme the Loot",
        year: "2018",
        img: "https://unsplash.com" // Замени на реальный скриншот клипа Тейпа
    },
    {
        artist: "Oxxxymiron",
        track: "Организация",
        year: "2021",
        img: "https://unsplash.com" // Замени на скриншот Окси
    },
    {
        artist: "Scriptonite",
        track: "Lamborghini",
        year: "2017",
        img: "https://unsplash.com" // Замени на скриншот Скриптонита
    },
    {
        artist: "Morgenshtern",
        track: "Cadillac",
        year: "2020",
        img: "https://unsplash.com" // Замени на скриншот Моргена
    }
];

// Получаем список уникальных артистов для автокомплита
const allArtists = [...new Set(clipsDataset.map(clip => clip.artist))];

// Игровые переменные
let currentRound = 0;
let score = 0;
let gameQueue = [];

// DOM Элементы
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');

const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

const artistInput = document.getElementById('artist-input');
const autocompleteList = document.getElementById('autocomplete-list');
const clipFrame = document.getElementById('clip-frame');
const scoreDisplay = document.getElementById('score');
const finalScoreVal = document.getElementById('final-score-val');

const hintTrackBtn = document.getElementById('hint-track');
const hintYearBtn = document.getElementById('hint-year');
const hintText = document.getElementById('hint-text');

// Переключение экранов с помощью GSAP
function changeScreen(fromScreen, toScreen) {
    gsap.to(fromScreen, { opacity: 0, duration: 0.4, onComplete: () => {
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
        gsap.fromTo(toScreen, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 });
    }});
}

// Старт игры
function startGame() {
    score = 0;
    currentRound = 0;
    scoreDisplay.textContent = score;
    gameQueue = [...clipsDataset].sort(() => Math.random() - 0.5); // Перемешиваем раунды
    
    changeScreen(welcomeScreen, gameScreen);
    loadRound();
}

// Загрузка раунда
function loadRound() {
    if (currentRound >= gameQueue.length) {
        endGame();
        return;
    }

    artistInput.value = "";
    hintText.textContent = "";
    autocompleteList.innerHTML = "";

    const currentClip = gameQueue[currentRound];
    clipFrame.src = currentClip.img;

    // Плавное появление кадра через размытие
    gsap.fromTo(clipFrame, { filter: "blur(20px)", scale: 0.95 }, { filter: "blur(0px)", scale: 1, duration: 0.8, ease: "power2.out" });
}

// Проверка ответа
function checkAnswer() {
    const userAnswer = artistInput.value.trim().toLowerCase();
    const correctAnswer = gameQueue[currentRound].artist.toLowerCase();

    if (userAnswer === correctAnswer) {
        // Эффект триумфа и начисление очков
        score += 100;
        scoreDisplay.textContent = score;
        
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#FF6B00', '#FFFFFF', '#222222']
        });

        currentRound++;
        setTimeout(loadRound, 1200);
    } else {
        // Эффект встряски инпута при ошибке
        gsap.to(".controls-wrapper", { x: -10, duration: 0.05, repeat: 5, yoyo: true, onComplete: () => {
            gsap.set(".controls-wrapper", { x: 0 });
        }});
        artistInput.style.borderColor = "#ff0033";
        setTimeout(() => artistInput.style.borderColor = "", 600);
    }
}

// Конец игры
function endGame() {
    finalScoreVal.textContent = score;
    changeScreen(gameScreen, gameOverScreen);
}

// Логика автодополнения (автокомплит)
artistInput.addEventListener('input', () => {
    const value = artistInput.value.trim().toLowerCase();
    autocompleteList.innerHTML = "";

    if (!value) return;

    const filtered = allArtists.filter(artist => artist.toLowerCase().includes(value));

    filtered.forEach(artist => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = artist;
        item.addEventListener('click', () => {
            artistInput.value = artist;
            autocompleteList.innerHTML = "";
        });
        autocompleteList.appendChild(item);
    });
});

// Закрытие автокомплита при клике мимо
document.addEventListener('click', (e) => {
    if (e.target !== artistInput) autocompleteList.innerHTML = "";
});

// Слушатели подсказок
hintTrackBtn.addEventListener('click', () => {
    hintText.textContent = `🎵 Трек: ${gameQueue[currentRound].track}`;
});

hintYearBtn.addEventListener('click', () => {
    hintText.textContent = `📅 Год выхода: ${gameQueue[currentRound].year}`;
});

// Ивенты кнопок управления
startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', () => changeScreen(gameOverScreen, welcomeScreen));

// Позволяет отправлять ответ по нажатию на Enter
artistInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// Инициализация при старте страницы
gsap.fromTo(".welcome-container", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
