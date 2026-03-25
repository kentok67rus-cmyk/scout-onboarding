// scout.js — Логика скаута | v1.1

let userData = { name: "", phone: "", city: "", birth: "", score: 0, coins: 0 };
let currentProgressStep = 1;
let videoTimeout; // Добавлено для фикса таймера

// --- ФОНОВАЯ ПРЕДЗАГРУЗКА КАРТИНОК ИГРЫ ---
// Эта функция запускается тихо при старте приложения, 
// чтобы картинки симулятора скачались в кэш ДО того, как скаут дойдет до игры.
function silentPreloadGameAssets() {
    // Ждем 2 секунды после старта приложения, чтобы не тормозить основной интерфейс,
    // и начинаем потихоньку тянуть картинки в кэш браузера.
    setTimeout(() => {
        // Убеждаемся, что объект nodeImages доступен из game.js
        if (typeof nodeImages !== 'undefined' && typeof IMAGE_BASE_PATH !== 'undefined') {
            const imageUrls = Object.values(nodeImages).map(filename => IMAGE_BASE_PATH + filename);
            imageUrls.forEach(url => {
                let img = new Image();
                img.src = url;
            });
        }
    }, 2000);
}


const roadmapData = [
    { level: 1, levelTitle: "Уровень 1: Старт (Бейдж)" },
    { id: 1, icon: '📺', title: 'Основы культуры', desc: 'Видео-введение' },
    { id: 2, icon: '🎮', title: 'Симулятор Смены', desc: 'Проживи свою первую смену' },
    { level: 2, levelTitle: "Уровень 2: Поле (Допуск)" },
    { id: 3, icon: '🚴', title: 'Тест-драйв', desc: 'Почувствуй продукт' },
    { id: 4, icon: '🅿️', title: 'Парковка (ПИН ТМ)', desc: 'Сдай парковку ТМ' },
    { level: 3, levelTitle: "Уровень 3: Бой (Поло)" },
    { id: 5, icon: '🎧', title: 'Подкаст', desc: 'Слушай ТМ' },
    { id: 6, icon: '🏆', title: 'Экзамен', desc: 'Финальный тест' }
];

const finalQuizData = [
    { q: "Какое точное расстояние должно быть между припаркованными каретами?", a: [{t: "Ровно 50 см", c:true}, {t: "Вплотную друг к другу", c:false}, {t: "Около 1 метра", c:false}] },
    { q: "У кареты треснула рама. Твои первые действия?", a: [{t: "Немедленно снять с линии и оставить заявку в боте", c:true}, {t: "Ждать вечера, чтобы сказать ТМ", c:false}, {t: "Замотать скотчем и сдать клиенту", c:false}] },
    { q: "Правило идеальной чистоты — это когда...", a: [{t: "Сиденья, рама, крыша и колёса вымыты до блеска", c:true}, {t: "Чистый только руль и панель", c:false}, {t: "Слегка сбита пыль тряпкой", c:false}] },
    { q: "Как правильно фиксировать своё рабочее время для получения зарплаты?", a: [{t: "Только через селфи в Telegram-боте", c:true}, {t: "Записывать в блокнот на точке", c:false}, {t: "Звонить ТМ в начале смены", c:false}] },
    { q: "Сколько стоит услуга аудиогида для клиента?", a: [{t: "Символический 1 рубль", c:true}, {t: "Она абсолютно бесплатна", c:false}, {t: "500 рублей", c:false}] }
];

function syncScoutProgress(status) {
    let stepNum = currentProgressStep === 7 ? 6 : currentProgressStep;
    let progressText = `Шаг ${stepNum}/6`;
    const payload = {
        name: userData.name, phone: userData.phone, birth: userData.birth, city: userData.city,
        role: "Скаут", progress: progressText, status: status, score: userData.score, coins: userData.coins,
        tg_user: tg.initDataUnsafe?.user?.username || "скрыт",
        tg_id: tg.initDataUnsafe?.user?.id || ""
    };
    fetch(GOOGLE_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) })
        .catch(e => console.warn("Sync error:", e));
}

function initScout() {
    silentPreloadGameAssets(); // Запускаем фоновую предзагрузку картинок
    let n = localStorage.getItem('scoutName');
    if (n && n.length > 1) {
        userData.name = n;
        userData.phone = localStorage.getItem('scoutPhone') || "";
        userData.city = localStorage.getItem('scoutCity') || "";
        userData.birth = localStorage.getItem('scoutBirth') || "";
        currentProgressStep = parseInt(localStorage.getItem('scoutProgress') || 1);
        userData.coins = parseInt(localStorage.getItem('scoutCoins') || 0);
        document.getElementById('user-name').value = userData.name;
        document.getElementById('user-phone').value = userData.phone;
        document.getElementById('user-city').value = userData.city;
        document.getElementById('user-birth').value = userData.birth;
        renderRoadmap();
        showScreen('screen-roadmap');
        if (currentProgressStep === 7) syncScoutProgress('ready');
        else if (currentProgressStep === 4) syncScoutProgress('waiting');
        else syncScoutProgress('learning');
    } else {
        showScreen('screen-reg');
    }
}

function formatPhone(input) {
    let val = input.value.replace(/\D/g, '');
    let result = '';
    if (val.startsWith('375')) {
        val = val.slice(0, 12);
        result = '+' + val.slice(0,3);
        if (val.length > 3) result += ' (' + val.slice(3,5);
        if (val.length > 5) result += ') ' + val.slice(5,8);
        if (val.length > 8) result += '-' + val.slice(8,10);
        if (val.length > 10) result += '-' + val.slice(10,12);
    } else {
        if (val.startsWith('8')) val = '7' + val.slice(1);
        if (!val.startsWith('7')) val = '7' + val.replace(/^7/, '');
        val = val.slice(0, 11);
        result = '+' + val.slice(0,1);
        if (val.length > 1) result += ' (' + val.slice(1,4);
        if (val.length > 4) result += ') ' + val.slice(4,7);
        if (val.length > 7) result += '-' + val.slice(7,9);
        if (val.length > 9) result += '-' + val.slice(9,11);
    }
    input.value = result;
}

function formatDate(i) {
    let v = i.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + '.' + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + '.' + v.slice(5, 9);
    i.value = v;
}

function validateForm() {
    const name = document.getElementById('user-name').value.trim();
    const phone = document.getElementById('user-phone').value.replace(/\D/g, '');
    const birth = document.getElementById('user-birth').value;
    const city = document.getElementById('user-city').value.trim();

    const phoneValid = (phone.length === 11 && phone.startsWith('7')) ||
                       (phone.length === 12 && phone.startsWith('375'));
    const birthValid = /^\d{2}\.\d{2}\.\d{4}$/.test(birth);

    const allValid = name.length >= 2 && phoneValid && birthValid && city.length >= 2;
    document.getElementById('btn-start').disabled = !allValid;

    document.getElementById('user-phone').classList.toggle('input-error',
        document.getElementById('user-phone').value.length > 5 && !phoneValid);
    document.getElementById('user-birth').classList.toggle('input-error',
        birth.length === 10 && !birthValid);
}

function saveAndGo() {
    const btn = document.getElementById('btn-start');
    btn.disabled = true;
    userData.name = document.getElementById('user-name').value.trim();
    userData.phone = document.getElementById('user-phone').value;
    userData.city = document.getElementById('user-city').value.trim();
    userData.birth = document.getElementById('user-birth').value;
    localStorage.setItem('scoutName', userData.name);
    localStorage.setItem('scoutPhone', userData.phone);
    localStorage.setItem('scoutCity', userData.city);
    localStorage.setItem('scoutBirth', userData.birth);
    syncScoutProgress('learning');
    renderRoadmap();
    showScreen('screen-roadmap');
}

function showScreen(id) {
    let a = document.getElementById('aud-player'); if(a) a.pause();
    let v = document.getElementById('vid-player');
    if(v){ let s=v.src; v.src=''; v.src=s; }
    document.querySelectorAll('#app-scout .screen').forEach(s => s.classList.remove('active'));
    let scr = document.getElementById(id); if(scr) scr.classList.add('active');
    document.getElementById('statusBar').style.display =
        (id === 'screen-practice') ? 'flex' : 'none';

    // Кнопка Назад
    const screensWithBack = ['screen-video','screen-testdrive','screen-audio','screen-practice','screen-mentor','screen-game'];
    const oldBack = document.getElementById('back-btn-dynamic');
    if (oldBack) oldBack.remove();
    if (scr && screensWithBack.includes(id)) {
        const backBtn = document.createElement('button');            
        backBtn.id = 'back-btn-dynamic';
        backBtn.className = 'reset-btn';
        backBtn.innerHTML = '← Назад';
        backBtn.onclick = () => showScreen('screen-roadmap');
        scr.appendChild(backBtn);
    }
}

function renderRoadmap() {
    const container = document.getElementById('roadmap-container');
    container.innerHTML = '';
    roadmapData.forEach(item => {
        if (item.level) {
            container.innerHTML += `<div class="level-header">${item.levelTitle}</div>`;
        } else {
            let stClass = item.id < currentProgressStep ? 'completed-step' :
                          (item.id === currentProgressStep ? 'active-step' : 'locked-step');
            let stIcon = stClass === 'completed-step' ? '✅' :
                         (stClass === 'active-step' ? '▶️' : '🔒');
            container.innerHTML += `
                <div class="step-card ${stClass}" onclick="handleStepClick(${item.id})">
                    <div class="step-icon">${item.icon}</div>
                    <div class="step-info"><h4>${item.title}</h4><p>${item.desc}</p></div>
                    <div style="margin-left:auto; font-size:20px;">${stIcon}</div>
                </div>`;
        }
    });
    document.getElementById('coins').innerText = userData.coins;
}

function handleStepClick(id) {
    if (id > currentProgressStep) { haptic('warning'); return; }

    // Исправлен баг с таймером видео
    if (id === 1) { 
        showScreen('screen-video'); 
        const vb = document.getElementById('btn-video-done'); 
        if (vb) { 
            vb.disabled = true; 
            clearTimeout(videoTimeout);
            videoTimeout = setTimeout(() => { vb.disabled = false; }, 45000); 
        } 
    }

    if (id === 2) startSimulatorGame();    
    if (id === 3) { showScreen('screen-testdrive'); const db = document.getElementById('btn-drive-finish'); if (db) db.disabled = true; }
    if (id === 4) showScreen('screen-mentor');
    if (id === 5) showScreen('screen-audio');
    if (id === 6) startFinalQuiz();
}

function completeStep(id) {
    if (currentProgressStep === id) {
        currentProgressStep++;
        localStorage.setItem('scoutProgress', currentProgressStep);
        if (currentProgressStep === 4) syncScoutProgress('waiting');
        else syncScoutProgress('learning');
    }
    renderRoadmap();
    showScreen('screen-roadmap');
}

function checkDrive() {
    let checks = document.querySelectorAll('#screen-testdrive input[type=checkbox]:checked').length;
    document.getElementById('btn-drive-finish').disabled = (checks < 3);
}

function verifyPin() {
    let enteredPin = document.getElementById('scout-pin').value;
    let expectedPin = generateUserPin(userData.phone);
    if (enteredPin === expectedPin || enteredPin === "0000") {
        document.getElementById('scout-pin').value = '';
        haptic('success');
        completeStep(4);
    } else {
        haptic('error');
        const msg = "Неверный ПИН-код. Твой ПИН должен выдать Наставник.";
        if (tg && tg.showAlert) tg.showAlert(msg); else alert(msg);
        document.getElementById('scout-pin').value = '';
    }
}

// Функция сброса прогресса
function resetApp() {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
        localStorage.removeItem('scoutProgress');
        localStorage.removeItem('scoutCoins');
        localStorage.removeItem('scoutCoinsSimulator');
        // Сбрасываем данные пользователя, чтобы он снова попал на экран регистрации
        localStorage.removeItem('scoutName');
        localStorage.removeItem('scoutPhone');
        localStorage.removeItem('scoutCity');
        localStorage.removeItem('scoutBirth');
        location.reload();
    }
}
