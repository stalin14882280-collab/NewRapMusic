// Глобальное хранилище данных тредов форума Hip-Hop.ru
let forumThreads = [
    {
        id: 1,
        type: "battle",
        author: "Oxxxymiron",
        title: "Раунд 3: В стране женщин (Официальный баттл)",
        text: "Йети копает корни в тени ветвей, андеграунд восстает. Слушайте судейский сданый трек на оригинальный минус.",
        beatType: "community_classic",
        audio: "https://soundhelix.com",
        respect: 412,
        voted: false
    },
    {
        id: 2,
        type: "fit",
        author: "Babangida & СД",
        title: "Эксклюзивный Фирменный Сплит-Дроп",
        text: "Записали совместный фит на грязный бит из комьюнити. Всем хейтерам и любителям поп-рэпа посвящается.",
        beatType: "community_dirty",
        audio: "https://soundhelix.com",
        respect: 289,
        voted: false
    },
    {
        id: 3,
        type: "text",
        author: "Noize_MC",
        title: "Фристайл на лавке возле метро [ТХТ-версия]",
        text: "Панельные дома, дворы, разбитые витрины,\nМы пишем этот рэп без дорогой студии и грима.\nСтроки ложатся на экран, заценивайте рифмоконструкции в комментариях.",
        beatType: "none",
        audio: "",
        respect: 195,
        voted: false
    }
];

let selectedPostType = "solo";
let myTracksCount = 0;
let myBattlesCount = 0;
let myRespect = 150;

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    renderForumThreads();
});

// Навигация между разделами
function switchSection(sectionName) {
    document.querySelectorAll('.forum-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`section-${sectionName}`).classList.add('active');
    event.target.classList.add('active');
    
    // Плавная анимация появления контента через GSAP
    gsap.fromTo(`#section-${sectionName}`, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
}

// Выбор типа публикации в студии
function selectPostType(type) {
    selectedPostType = type;
    document.querySelectorAll('.type-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-type="${type}"]`).classList.add('active');

    // Управление отображением полей ввода в зависимости от выбора
    const beatGroup = document.getElementById('beat-selection-group');
    const fitGroup = document.getElementById('fit-partner-group');

    if (type === 'text') {
        beatGroup.classList.add('hidden');
        fitGroup.classList.add('hidden');
    } else if (type === 'fit') {
        beatGroup.classList.remove('hidden');
        fitGroup.classList.remove('hidden');
    } else {
        beatGroup.classList.remove('hidden');
        fitGroup.classList.add('hidden');
    }
}

// Отрендерить список тредов в ленте
function renderForumThreads() {
    const listContainer = document.getElementById('forum-threads-list');
    listContainer.innerHTML = "";

    forumThreads.forEach(thread => {
        const postElement = document.createElement('article');
        postElement.classList.add('forum-post');
        
        let audioHTML = "";
        if (thread.type !== 'text' && thread.audio) {
            let beatLabel = "Личный бит исполнителя";
            if (thread.beatType === 'community_classic') beatLabel = "Классический баттловый минус ХХРУ";
            if (thread.beatType === 'community_dirty') beatLabel = "Грязный олдскульный Бум-Бэп минус";
            if (thread.beatType === 'none') beatLabel = "Акапелла (Без бита)";

            audioHTML = `
                <div class="player-container">
                    <span class="beat-source-tag">🔊 Музыка: ${beatLabel}</span>
                    <audio controls src="${thread.audio}"></audio>
                </div>
            `;
        }

        postElement.innerHTML = `
            <div class="post-header">
                <span class="post-author">👤 Автор: <strong>${thread.author}</strong></span>
                <span class="badge-type">${getPostTypeLabel(thread.type)}</span>
            </div>
            <div class="post-body">
                <h2 class="post-title">${thread.title}</h2>
                <p class="post-text">${thread.text}</p>
                ${audioHTML}
            </div>
            <div class="post-footer-actions">
                <button class="action-link" onclick="addRespect(${thread.id})">👍 Выразить Респект (<span id="resp-count-${thread.id}">${thread.respect}</span>)</button>
                <button class="action-link" onclick="alert('Окно комментариев находится в разработке по правилам vBulletin.')">💬 Комментировать</button>
            </div>
        `;
        listContainer.appendChild(postElement);
    });
}

function getPostTypeLabel(type) {
    if (type === 'solo') return "Соло Релиз";
    if (type === 'fit') return "ФИТ / КОЛЛАБ";
    if (type === 'battle') return "БАТТЛ 1v1";
    if (type === 'text') return "ТХТ РЭП";
    return "Пост";
}

// Система Лайков (Респекта) на форуме
function addRespect(id) {
    const thread = forumThreads.find(t => t.id === id);
    if (thread && !thread.voted) {
        thread.respect += 1;
        thread.voted = true;
        document.getElementById(`resp-count-${id}`).textContent = thread.respect;
        
        // Плавный микро-эффект прыжка счетчика
        gsap.fromTo(`#resp-count-${id}`, {scale: 1.3, color: '#FF6A00'}, {scale: 1, color: '#FFFFFF', duration: 0.3});
    }
}

// Логика сборки и публикации релиза пользователем
function publishRelease() {
    const titleInput = document.getElementById('post-title-input');
    const textInput = document.getElementById('post-text-input');
    const beatSelect = document.getElementById('beat-select');
    const partnerSelect = document.getElementById('partner-select');

    if (!titleInput.value.trim() || !textInput.value.trim()) {
        alert("Заполните заголовок темы и текст вашего парта!");
        return;
    }

    let authorName = "Рэпер_ХХРУ";
    if (selectedPostType === 'fit') {
        authorName += ` & ${partnerSelect.value}`;
    }

    // Симуляция аудиопотока (разные треки в зависимости от бита)
    let assignedAudio = "https://soundhelix.com";
    if (beatSelect.value === 'none') assignedAudio = "";
    if (beatSelect.value === 'community_dirty') assignedAudio = "https://soundhelix.com";

    const newPost = {
        id: forumThreads.length + 1,
        type: selectedPostType,
        author: authorName,
        title: titleInput.value,
        text: textInput.value,
        beatType: selectedPostType === 'text' ? 'none' : beatSelect.value,
        audio: assignedAudio,
        respect: 1,
        voted: false
    };

    // Добавляем наверх ленты
    forumThreads.unshift(newPost);

    // Обновляем статистику в профиле слева
    if (selectedPostType === 'battle') myBattlesCount++;
    if (selectedPostType === 'solo' || selectedPostType === 'fit') myTracksCount++;
    myRespect += 10; // Бонус за активность

    document.getElementById('stat-tracks').textContent = myTracksCount;
    document.getElementById('stat-battles').textContent = myBattlesCount;
    document.getElementById('stat-respect').textContent = myRespect;

    // Сброс полей ввода формы
    titleInput.value = "";
    textInput.value = "";

    // Возвращаемся в ленту
    switchSection('feed');
    renderForumThreads();
}
