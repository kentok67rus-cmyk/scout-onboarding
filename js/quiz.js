// quiz.js — Финальный экзамен и таблица лидеров

let pracArr = [], pIdx = 0;

        function startFinalQuiz() { 
            pracArr = [...finalQuizData].sort(() => Math.random() - 0.5); 
            pIdx = 0; 
            userData.score = 0;
            // Убираем ранее начисленные монеты за квиз, если пересдача
            const coinsFromSimulator = parseInt(localStorage.getItem('scoutCoinsSimulator') || 0);
            userData.coins = coinsFromSimulator;
            localStorage.setItem('scoutCoins', userData.coins);

            document.getElementById('header-title').innerHTML = `ЭКЗАМЕН: <span id="q-counter"></span>`; 
            showScreen('screen-practice'); 
            renderPrac(); 
        }

        function renderPrac() {
            let q = pracArr[pIdx];
            document.getElementById('q-counter').innerText = `${pIdx + 1}/${pracArr.length}`;
            document.getElementById('prac-text').innerText = q.q;
        const optContainer = document.getElementById('prac-options');
        optContainer.innerHTML = '';
        [...q.a].sort(() => Math.random() - 0.5).forEach(o => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = o.t;
            div.addEventListener('click', function() { handleAns(o, this); });
            optContainer.appendChild(div);
        });
        document.getElementById('coins').innerText = userData.coins;
        }

        function handleAns(o, el) {
            // Блокируем все варианты сразу
            document.querySelectorAll('#prac-options .option').forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.onclick = null;
            });
            if (o.c) { 
                el.classList.add('correct'); 
                userData.score++;
                // Начисляем монеты за правильный ответ
                userData.coins += COINS_PER_CORRECT_ANSWER;
                localStorage.setItem('scoutCoins', userData.coins);
                haptic('success');
            } else {
                el.classList.add('wrong');
                haptic('error');
            }
            document.getElementById('coins').innerText = userData.coins;
            setTimeout(() => { 
                pIdx++; 
                if (pIdx < pracArr.length) renderPrac(); 
                else showFinishScout(); 
            }, 800);
        }

        function showFinishScout() {
            showScreen('screen-finish'); 
            document.getElementById('res-info').innerText = userData.name;
            if (userData.score < QUIZ_PASS_THRESHOLD) { 
                document.getElementById('finish-title').innerText = "Тест не сдан ❌"; 
                document.getElementById('send-status').innerText = `Правильных ответов: ${userData.score}/${pracArr.length}. Повтори теорию и попробуй снова.`;
                document.getElementById('send-status').style.color = "var(--red)"; 
                document.getElementById('btn-retry').style.display = "block";
                document.getElementById('btn-leaderboard').style.display = "none";
                // При провале НЕ начисляем монеты за этот квиз
                userData.coins = parseInt(localStorage.getItem('scoutCoinsSimulator') || 0);
                localStorage.setItem('scoutCoins', userData.coins);
            } else {
                document.getElementById('res-coins').innerText = userData.coins; 
                document.getElementById('finish-title').innerText = "Экзамен сдан! ✅";
                document.getElementById('send-status').innerText = "Покажи этот экран Наставнику!"; 
                document.getElementById('send-status').style.color = "var(--green)";
                document.getElementById('btn-retry').style.display = "none";
                document.getElementById('btn-leaderboard').style.display = "inline-block";
                currentProgressStep = 7;
                localStorage.setItem('scoutProgress', 7);
                localStorage.setItem('scoutCoins', userData.coins);
                syncScoutProgress('ready'); 
                haptic('success');
            }
        }

function showLeaderboard() {
            showScreen('screen-leaderboard');
            const list = document.getElementById('leaderboard-list');
            list.innerHTML = `<div class="loader">⏳ Подгружаем рейтинг из базы...</div>`;
            fetch(GOOGLE_URL)
                .then(res => res.json())
                .then(data => {
                    let sorted = data
                        .filter(u => u.coins !== undefined && u.coins > 0)
                        .sort((a, b) => b.coins - a.coins);
                    if (sorted.length === 0) {
                        list.innerHTML = `<div class="loader">Пока нет данных. Ты будешь первым!</div>`;
                        return;
                    }
                    let html = '';
                    sorted.forEach((u, idx) => {
                        let medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : 
                                    `<span style="color:#888; font-size:14px;">${idx + 1}.</span>`;
                        let isMe = (u.phone === userData.phone);
                        let style = isMe ? 'background:#fffcf0; border:2px solid var(--yellow);' : 'background:#fff; border:1px solid #eee;';
                        let tag = isMe ? `<span style="font-size:10px; background:var(--yellow); padding:2px 6px; border-radius:4px; margin-left:5px;">ТЫ</span>` : '';
                        html += `
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-radius:14px; margin-bottom:10px; ${style}">
                                <div style="font-weight:800; font-size:16px; color:#111;">
                                    <span style="display:inline-block; width:30px; text-align:center;">${medal}</span> ${u.name}${tag}
                                </div>
                                <div style="font-weight:900; color:#d4c300; font-size:18px;">${u.coins} 💰</div>
                            </div>`;
                    });
                    list.innerHTML = html;
                })
                .catch(() => {
                    list.innerHTML = `<div class="loader" style="color:red;">❌ Ошибка сети. Не удалось загрузить рейтинг.</div>`;
                });
        }
