// scout.js — Логика скаута | v1.1

let userData = { name: "", phone: "", city: "", birth: "", score: 0, coins: 0 };
let currentProgressStep = 1;

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
        const backBtn = document.createElement('button');            backBtn.id = 'back-btn-dynamic';
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
    if (id === 1) showScreen('screen-video');
    if (id === 2) startQuiz();    if (id === 3) showScreen('screen-testdrive');
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
    let checks = document.querySelectorAll('.checklist-item input:checked').length;
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

// Викторина
let currentQuestionIndex = 0;
let selectedAnswer = null;

function startQuiz() {
    currentQuestionIndex = 0;
    selectedAnswer = null;
    loadQuestion();
    showScreen('screen-game');
}

function loadQuestion() {
    const q = finalQuizData[currentQuestionIndex];
    if (!q) { completeStep(2); return; }
    selectedAnswer = null;
    const container = document.getElementById('quiz-container');
    const btn = document.getElementById('quiz-btn');
    let html = '<p style="color:#aaa;margin-bottom:15px;">\u0412\u043e\u043f\u0440\u043e\u0441 ' + (currentQuestionIndex + 1) + '/' + finalQuizData.length + '</p>';
    html += '<p style="font-size:20px;font-weight:600;margin-bottom:20px;color:#fff;">' + q.q + '</p>';
    q.a.forEach(function(ans, idx) {
        html += '<div class="quiz-option" onclick="selectAnswer(' + idx + ')" id="opt-' + idx + '" style="padding:15px;margin:10px 0;border:2px solid #555;border-radius:10px;cursor:pointer;color:#fff;background:#222;">' + ans.t + '</div>';
    });
    container.innerHTML = html;
    btn.style.display = 'none';
}

function selectAnswer(idx) {
    selectedAnswer = idx;
    const opts = document.querySelectorAll('.quiz-option');
    opts.forEach(function(o, i) {
        o.style.borderColor = i === idx ? '#FFD700' : '#555';
        o.style.background = i === idx ? '#3a3000' : '#222';
    });
    document.getElementById('quiz-btn').style.display = 'block';
}

function checkAnswer() {
    if (selectedAnswer === null) return;
    const q = finalQuizData[currentQuestionIndex];
    const correct = q.a[selectedAnswer].c;
    if (correct) {
        currentQuestionIndex++;
        if (currentQuestionIndex < finalQuizData.length) {
            loadQuestion();
        } else {
            completeStep(2);
        }
    } else {
        const msg = '\u041d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e! \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 \u0435\u0449\u0451 \u0440\u0430\u0437.';
        if (tg && tg.showAlert) tg.showAlert(msg); else alert(msg);
        selectedAnswer = null;
        loadQuestion();
    }
}

// \u0424\u0443\u043d\u043a\u0446\u0438\u044f \u0441\u0431\u0440\u043e\u0441\u0430 \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441\u0430
function resetApp() {
    if (confirm('\u0412\u044b \u0443\u0432\u0435\u0440\u0435\u043d\u044b, \u0447\u0442\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u0441\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0432\u0435\u0441\u044c \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441?')) {
        localStorage.removeItem('scoutProgress');
        localStorage.removeItem('scoutCoins');
        localStorage.removeItem('scoutCoinsSimulator');
        location.reload();
    }
}
