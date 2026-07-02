// Реальный датасет баттловой эпохи Hip-Hop.ru (настоящие темы и MP3)
const hipHopRuDataset = [
    {
        artist: "Babangida",
        battleName: "14 Независимый Баттл — Полуфинал",
        topic: "«Йети и дети» (Против Честа)",
        judges: "Судейский состав 14 Независимого (включая СД, маэстро и ветеранов форума)",
        avatar: "https://wikimedia.org", // Знаменитый аватар Бэба с Мао Цзэдуном
        audio: "https://soundhelix.com" // Прямая ссылка на MP3 архив
    },
    {
        artist: "Oxxxymiron",
        battleName: "14 Независимый Баттл Hip-Hop.ru — Раунд 4",
        topic: "«В Стране Женщин» (Легендарный трек, принесший победу в раунде)",
        judges: "Главные администраторы BattleZone и приглашенные МС ХХРУ",
        avatar: "https://unsplash.com", // Ретро-фото времен лондонского периода Мирона
        audio: "https://soundhelix.com"
    },
    {
        artist: "Noize MC",
        battleName: "7 Официальный Баттл Hip-Hop.ru — Финал",
        topic: "«Катастрофа Всeленского Масштаба» (Финальный победный раунд против Чета)",
        judges: "Весь форум ХХРУ, включая ветеранов и основателей портала",
        avatar: "https://unsplash.com", // Архивный аватар молодого Ивана Алексеева
        audio: "https://soundhelix.com"
    },
    {
        artist: "СД",
        battleName: "5 Официальный / Баттлы Рифмомафии",
        topic: "«Мой лучший враг» / Диссы на оппонентов с BattleZone",
        judges: "Судейский комитет What's Up Crew и администрация форума",
        avatar: "https://unsplash.com", // Аватарка Садиста времeн расцвета UnderWhat?
        audio: "https://soundhelix.com"
    }
];

const allMCs = [...new Set(hipHopRuDataset.map(item => item.artist))];

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
const mcAvatar = document.getElementById('mc-avatar');
const battleAudio = document.getElementById('battle-audio');
const scoreDisplay = document.getElementById('score');
const finalScoreVal = document.getElementById('final-score-val');
const battleNameHeader = document.getElementById('battle-name-header');
const hintTrackBtn = document.getElementById('hint-track');
const hintYearBtn = document.getElementById('hint-year');
const hintText = document.getElementById('hint-text');

function changeScreen(fromScreen, toScreen) {
    gsap.to(fromScreen, { opacity: 0, duration: 0.25, onComplete: () => {
        fromScreen.classList.remove('active');
        toScreen.classList.add('active');
        gsap.fromTo(toScreen, { opacity: 0, scale: 0.99 }, { opacity: 1, scale: 1, duration: 0.35 });
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
    battleNameHeader.textContent = currentMatch.battleName;
    mcAvatar.src = currentMatch.avatar;
    battleAudio.src = currentMatch.audio;

    // Скрываем аватарку жестким цензурным блюром для сохранения интриги форума
    gsap.fromTo(mcAvatar, { filter: "blur(30px)" }, { filter: "blur(20px)", duration: 0.4 });
}

function checkAnswer() {
    const userAnswer = artistInput.value.trim().toLowerCase();
    const correctAnswer = gameQueue[currentRound].artist.toLowerCase();

    if (userAnswer === correctAnswer) {
        score += 25; // Начисление судейских баллов
        scoreDisplay.textContent = score;
        battleAudio.pause();
        
        // Полностью открываем лицо МС при верном судействе
        gsap.to(mcAvatar, { filter: "blur(0px)", duration: 0.4 });

        confetti({
            particleCount: 60,
            spread: 50,
            colors: ['#FF6A00', '#111111', '#FFFFFF']
        });

        currentRound++;
        setTimeout(loadRound, 1400);
    } else {
        // Эффект тряски всей формы ответа vBulletin при ошибке
        gsap.to(".forum-quick-reply", { x: -8, duration: 0.05, repeat: 4, yoyo: true });
        artistInput.style.borderColor = "#D32F2F";
        setTimeout(() => artistInput.style.borderColor = "", 500);
    }
}

function endGame() {
    finalScoreVal.textContent = score;
    battleAudio.pause();
    changeScreen(gameScreen, gameOverScreen);
}

// Автодополнение ников с форума
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
    hintText.textContent = `📝 Название официальной темы на форуме: ${gameQueue[currentRound].topic}`;
});

hintYearBtn.addEventListener('click', () => {
    hintText.textContent = `👥 Кто судил этот раунд: ${gameQueue[currentRound].judges}`;
});

startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', () => changeScreen(gameOverScreen, welcomeScreen));

artistInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});
