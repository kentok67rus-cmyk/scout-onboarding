// router.js — Роутер, авторизация ТМ, попапы

window.addEventListener('DOMContentLoaded', () => {
            let savedRole = localStorage.getItem('appRole');
            if (savedRole === 'scout') { initApp('scout'); }
            // Роль ТМ НЕ восстанавливаем из localStorage без повторной проверки доступа
            // ТМ должен каждый раз проходить проверку
        });

        function initApp(role) {
            document.getElementById('app-router').classList.add('hidden');
            document.getElementById('app-tm-auth').classList.add('hidden');
            if (role === 'scout') {
                localStorage.setItem('appRole', 'scout');
                document.getElementById('app-scout').classList.remove('hidden');
                initScout();
            } else if (role === 'tm') {
                document.getElementById('app-tm').classList.remove('hidden');
                initTM();
            }
        }

        function logout() { 
            localStorage.removeItem('appRole'); 
            location.reload(); 
        }

        function resetApp() { 
            const doReset = () => { localStorage.clear(); location.reload(); };
            if (tg && tg.showConfirm) {
                tg.showConfirm("Точно сбросить весь прогресс и начать заново?", (ok) => { if (ok) doReset(); });
            } else {
                if (confirm("Сбросить весь прогресс и начать заново?")) doReset();
            }
        }

function requestTMAccess() {
            document.getElementById('app-router').classList.add('hidden');
            document.getElementById('app-tm-auth').classList.remove('hidden');
            checkTMAccess();
        }

        function retryTMAuth() {
            document.getElementById('tm-auth-retry-btn').classList.add('hidden');
            document.getElementById('tm-auth-status').innerText = '⏳ Повторная проверка...';
            document.getElementById('tm-auth-status').style.color = '#888';
            checkTMAccess();
        }

        function checkTMAccess() {
            const statusEl = document.getElementById('tm-auth-status');
            const retryBtn = document.getElementById('tm-auth-retry-btn');
            const tgUser = tg.initDataUnsafe?.user;

            if (!tgUser || !tgUser.id) {
                statusEl.innerText = '⚠️ Не удалось определить ваш Telegram ID. Откройте приложение через Telegram.';
                statusEl.style.color = 'var(--red)';
                retryBtn.classList.remove('hidden');
                return;
            }

            statusEl.innerText = `⏳ Проверяем доступ для ID: ${tgUser.id}...`;
            statusEl.style.color = '#888';

            const url = `${GOOGLE_URL}?action=check_tm&tg_id=${tgUser.id}`;
            
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.access === true) {
                        statusEl.innerText = `✅ Доступ разрешён. Добро пожаловать, ${data.name || tgUser.first_name}!`;
                        statusEl.style.color = 'var(--green)';
                        haptic('success');
                        setTimeout(() => {
                            document.getElementById('app-tm-auth').classList.add('hidden');
                            initApp('tm');
                        }, 1000);
                    } else {
                        statusEl.innerText = '🚫 Доступ запрещён. Ваш Telegram ID не найден в списке ТМ. Обратитесь к администратору.';
                        statusEl.style.color = 'var(--red)';
                        haptic('error');
                        retryBtn.classList.remove('hidden');
                    }
                })
                .catch(err => {
                    statusEl.innerText = '❌ Ошибка сети. Проверьте интернет и попробуйте снова.';
                    statusEl.style.color = 'var(--red)';
                    retryBtn.classList.remove('hidden');
                });
        }

function closeAllPopups() {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('scout-popup').style.display = 'none';
            document.getElementById('tm-pin-popup').style.display = 'none';
            document.getElementById('tm-polo-popup').style.display = 'none';
            
            let gf = document.getElementById('game-feedback-popup');
            if (gf && gf.classList.contains('show')) {
                gf.classList.remove('show');
            }
        }
