// Трушная база данных золотой эпохи Hip-Hop.ru
const hipHopRuDataset = [
    {
        artist: "Babangida",
        topic: "«Тень знаний» / «Каменный лес»",
        battle: "14 Независимый Баттл / 15 Независимый Баттл",
        photo: "https://unsplash.com", // Сюда ставится аватарка Бэба (с Лениным или Мао)
        audio: "https://soundhelix.com" // Ссылка на MP3 раунда Бабана
    },
    {
        artist: "Noize MC",
        topic: "«Завтра брошу» / «Один из тех»",
        battle: "Победитель 7 Официального Баттла (2006-2007)",
        photo: "https://unsplash.com", // Сюда ставится архивное фото молодого Ивана Алексеева
        audio: "https://soundhelix.com" // Ссылка на MP3 раунда Нойза
    },
    {
        artist: "Oxxxymiron",
        topic: "«В тихом омуте» / «Йети и дети»",
        battle: "9 Официальный Баттл Hip-Hop.ru (2009 год)",
        photo: "https://unsplash.com", // Сюда ставится знаменитое фото Мирона в кепке тех времен
        audio: "https://soundhelix.com" // Ссылка на трек Мирона
    },
    {
        artist: "ST1M",
        topic: "«Я и мой микрофон»",
        battle: "Победитель 5 Официального Баттла (2004 год)",
        photo: "https://unsplash.com", // Сюда ставится старое фото Стима времен Ви-Стайл / Аггробабруйск
        audio: "https://soundhelix.com" // Ссылка на трек Стима
    },
    {
        artist: "СД",
        topic: "«Далекие дали» / «Мой лучший враг»",
        battle: "UndergroundWiggaz / Рифмомафия / Баттлы ХХРУ",
        photo: "https://unsplash.com", // Садист / What's Up Crew фото
        audio: "https://soundhelix.com"
    }
];

const allMCs = [...new Set(hipHopRuDataset.map(item => item.artist))];

let currentRound = 0;
let score = 0;
let gameQueue = [];

const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');

const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

const artistInput = document.getElementById('artist-input');
const autocompleteList = document.getElementById('autocomplete-list');
const mcPhoto = document.getElementById('mc-photo');
const battleAudio = document.getElementById('battle-audio');
const scoreDisplay = document.getElementById('score');
const finalScoreVal = document.getElementById('final-score-val');

const hintTrackBtn = document.getElementById('hint-track');
const hintYearBtn = document.getElementById('hint-year');
const hintText = document.getElementById('hint-text');

function changeScreen(fromScreen, toScreen) {
    gsap.to(fromScreen, { opacity: 0, duration: 0.3, onComplete: () => {
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
        gsap.fromTo(toScreen, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.4 });
    }});
}

function startGame() {
    score = 0;
    currentRound = 0;
    scoreDisplay.textContent = score;
    gameQueue = [...hipHopRuDataset].sort(() => Math.random() - 0.5);
    
    changeScreen(welcomeScreen, gameScreen);
    loadRound();
}

function loadRound() {
    if (currentRound >= gameQueue.length) {
        endGame();
        return;
    }

    artistInput.value = "";
    hintText.textContent = "";
    autocompleteList.innerHTML = "";
    battleAudio.pause();

    const currentMatch = gameQueue[currentRound];
    
    // Скрываем фото размытием, воссоздавая эффект анонимности раундов
    mcPhoto.src = currentMatch.photo;
    battleAudio.src = currentMatch.audio;

    gsap.fromTo(mcPhoto, { filter: "blur(25px)" }, { filter: "blur(12px)", duration: 0.5 }); // Фото остается немного размытым как интрига
}

function checkAnswer() {
    const userAnswer = artistInput.value.trim().toLowerCase();
    const correctAnswer = gameQueue[currentRound].artist.toLowerCase();

    if (userAnswer === correctAnswer) {
        score += 15; // По классической судейской системе ХХРУ (например, 5/5/5 за текст/деливери/общее)
        scoreDisplay.textContent = score;
        
        battleAudio.pause();
        // Полностью открываем аватарку МС при правильном судействе
        gsap.to(mcPhoto, { filter: "blur(0px)", duration: 0.4 });

        confetti({
            particleCount: 50,
            spread: 40,
            colors: ['#FF5500', '#000000']
        });

        currentRound++;
        setTimeout(loadRound, 1500);
    } else {
        gsap.to(".controls-wrapper", { x: -8, duration: 0.05, repeat: 4, yoyo: true });
        artistInput.style.borderColor = "#ff0000";
        setTimeout(() => artistInput.style.borderColor = "", 500);
    }
}

function endGame() {
    finalScoreVal.textContent = score;
    battleAudio.pause();
    changeScreen(gameScreen, gameOverScreen);
}

// Логика выпадашки для олдскульных ников
artistInput.addEventListener('input', () => {
    const value = artistInput.value.trim().toLowerCase();
    autocompleteList.innerHTML = "";

    if (!value) return;

    const filtered = allMCs.filter(mc => mc.toLowerCase().includes(value));

    filtered.forEach(mc => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = mc;
        item.addEventListener('click', () => {
            artistInput.value = mc;
            autocompleteList.innerHTML = "";
        });
        autocompleteList.appendChild(item);
    });
});

document.addEventListener('click', (e) => {
    if (e.target !== artistInput) autocompleteList.innerHTML = "";
});

hintTrackBtn.addEventListener('click', () => {
    hintText.textContent = `📝 Темы раунда на форуме: ${gameQueue[currentRound].topic}`;
});

hintYearBtn.addEventListener('click', () => {
    hintText.textContent = `🏆 Баттл: ${gameQueue[currentRound].battle}`;
});

startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', () => changeScreen(gameOverScreen, welcomeScreen));

artistInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});
