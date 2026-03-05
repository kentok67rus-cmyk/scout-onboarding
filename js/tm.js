// tm.js — Дашборд ТМ

let trainees = [];
        let selectedTrainee = null;
        let tmRefreshInterval = null;

        function initTM() { 
            fetchTrainees();
            // Автообновление каждые 30 секунд
            if (tmRefreshInterval) clearInterval(tmRefreshInterval);
            tmRefreshInterval = setInterval(fetchTrainees, 30000);
        }

        function fetchTrainees() {
            const list = document.getElementById('users-list');
            if (list.innerHTML.indexOf('loader') === -1) {
                // Тихое обновление без лоадера если уже есть данные
            } else {
                list.innerHTML = `<div class="loader">⏳ Загрузка стажёров из базы...</div>`;
            }
            fetch(GOOGLE_URL)
                .then(res => res.json())
                .then(data => { 
                    trainees = data.filter(u => u.status !== 'active'); // не показываем уже выпущенных
                    renderDashboard(); 
                })
                .catch(() => { 
                    list.innerHTML = `<div class="loader" style="color:red;">❌ Ошибка сети. Не удалось загрузить данные.</div>`; 
                });
        }

        function renderDashboard() {
            const list = document.getElementById('users-list'); 
            list.innerHTML = '';
            let ready = 0, waiting = 0, learning = 0;

            if (trainees.length === 0) { 
                list.innerHTML = `<div class="loader">Нет активных стажёров.</div>`; 
                updateChart(0, 0, 0, 0);
                return;
            }

            trainees.sort((a, b) => { 
                const order = { "ready": 1, "waiting": 2, "learning": 3 }; 
                return (order[a.status] || 9) - (order[b.status] || 9); 
            });

            trainees.forEach(t => {
                let cardClass = '', actionBtn = '', details = '';
                if (t.status === 'ready') { 
                    ready++; 
                    cardClass = 'status-ready'; 
                    details = `<span>🏆 Экзамен: <b>${t.score}/5</b></span> <span>💰 ${t.coins} монет</span>`; 
                    actionBtn = `<button class="action-btn btn-green" onclick="openPoloPopup('${t.phone}', '${t.name}')">👕 Выдать форму</button>`; 
                } else if (t.status === 'waiting') { 
                    waiting++; 
                    cardClass = 'status-waiting'; 
                    details = `<span>⏳ Ожидает проверку парковки</span>`;
                    actionBtn = `<button class="action-btn btn-orange" onclick="openPinPopup('${t.phone}','${t.name}')">🅿️ Выдать ПИН</button>`;
                } else if (t.status === 'learning') {
                    learning++;
                    cardClass = 'status-learning';
                    details = `<span>📚 Шаг ${t.progress || '?'}</span>`;
                }
                list.innerHTML += `
                <div class="user-card ${cardClass}">
                    <div class="card-header">
                        <p class="user-name">${t.name}</p>
                        <span class="user-role">${t.role || 'Скаут'}</span>
                    </div>
                    <div class="card-body">${details}</div>
                    ${actionBtn}
                </div>`;
            });
                updateChart(trainees.length, ready, waiting, learning);
    }
    function updateChart(total, ready, waiting, learning) {
        document.getElementById('total-users').innerText = total;
        document.getElementById('count-ready').innerText = ready;
        document.getElementById('count-wait').innerText = waiting;
        document.getElementById('count-learn').innerText = learning;
        let pct = total > 0 ? Math.round((ready / total) * 100) : 0;
        let chartBox = document.querySelector('.chart-box');
        if (chartBox) {
            let g = ready/total||0, w = waiting/total||0, l = learning/total||0;
            chartBox.style.background = `conic-gradient(var(--green) 0% ${g*100}%, var(--orange) ${g*100}% ${(g+w)*100}%, var(--red) ${(g+w)*100}% 100%)`;
        }
        let inner = document.querySelector('.chart-inner span');
        if (inner) inner.innerText = pct + '%';
    }
    function openPinPopup(phone, name) {
        selectedTrainee = trainees.find(t => t.phone === phone);
        let pin = generateUserPin(phone);
        document.getElementById('pin-student-name').innerText = name;
        document.getElementById('generated-pin').innerText = pin;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('tm-pin-popup').style.display = 'block';
    }
    function openPoloPopup(phone, name) {
        selectedTrainee = trainees.find(t => t.phone === phone);
        document.getElementById('polo-student-name').innerText = name;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('tm-polo-popup').style.display = 'block';
    }
    function confirmPolo() {
        if (!selectedTrainee) return;
        const payload = Object.assign({}, selectedTrainee, { status: 'active' });
        fetch(GOOGLE_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })
            .catch(e => console.warn('Sync error:', e));
        closeAllPopups();
        setTimeout(fetchTrainees, 1500);
    }