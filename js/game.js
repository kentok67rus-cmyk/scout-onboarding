// game.js — Симулятор смены

const gameData = {
          "prologue": {
            "title": "Утро в Карете ☀️",
            "text": "Ты — Скаут 'Кареты Мобилити'. Приложение само открывает замки и списывает деньги, а ты следишь за порядком. Твой первый выбор определит, в какую реальность скатится эта смена. Готов?",
            "choices": [
              { "text": "Начать смену", "next_node": "scene_1_crossroads", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
            ]
          },
          "scene_1_crossroads": {
            "title": "Сцена 1: Развилка судьбы",
            "text": "В приложении 4 кареты 'Доступны'. По факту: у одной спущено колесо, во второй лежит чья-то надкусанная шаурма. К парковке бежит семья клиентов. Решай быстро!",
            "choices": [
              { "text": "Заблокировать сломанную. Выкинуть шаурму, протереть тент.", "is_correct": true, "feedback_text": "Ты берешь контроль в свои руки. Семья садится в чистую карету и уезжает. Начинается смена Профессионала.", "next_node": "path_good_2", "effects": { "loyalty": 10, "tech": 10, "safety": 10 } },
              { "text": "Ничего не делать. Приложение пишет 'Доступна', пусть сами разбираются.", "is_correct": false, "feedback_text": "Отец семейства арендует сломанную карету, садится на соус, замок списывает деньги, но карета не едет. Ты скатываешься в ветку Терпилы.", "next_node": "path_terpila_2", "effects": { "loyalty": -20, "tech": -20, "safety": -10 } },
              { "text": "Пнуть спущенное колесо, выкинуть шаурму в кусты и сесть в телефон.", "is_correct": false, "feedback_text": "Семья сама вытирает сиденье влажными салфетками, гневно косясь на тебя. Ты вступаешь на путь Ленивого Хаоса.", "next_node": "path_chaos_2", "effects": { "loyalty": -30, "tech": -10, "safety": -10 } }
            ]
          },
          "path_good_2": {
            "title": "Сцена 2: Форсаж в Парке",
            "text": "Подходят зумеры с блютуз-колонкой. Сканируют QR-код чистой кареты, запрыгивают внутрь и собираются рвануть с двух ног прямо в толпу гуляющих.",
            "choices": [
              { "text": "Перехватить: 'Тормоз тут, габариты широкие, людей не давить!'", "is_correct": true, "feedback_text": "Они кивают и аккуратно выезжают. Инструктаж работает.", "next_node": "path_good_3", "effects": { "loyalty": 10, "tech": 0, "safety": 20 } },
              { "text": "Промолчать. Правила есть в приложении.", "is_correct": false, "feedback_text": "Они влетают в бордюр и гнут педаль. Твоя идеальная смена испорчена.", "next_node": "path_good_3", "effects": { "loyalty": -10, "tech": -30, "safety": -30 } }
            ]
          },
          "path_good_3": {
            "title": "Сцена 3: Скрипучая претензия",
            "text": "Гость возвращает карету и жалуется: 'У вас там педаль поскрипывает! Требую вернуть половину суммы!'",
            "choices": [
              { "text": "Извиниться, предложить промокод, карету — на осмотр.", "is_correct": true, "feedback_text": "Грамотная работа с возражениями. Гость ушел довольным, касса не пострадала.", "next_node": "path_good_4", "effects": { "loyalty": 15, "tech": 10, "safety": 0 } },
              { "text": "Сказать 'Ничего не знаю, приложение списало' и отвернуться.", "is_correct": false, "feedback_text": "Гость пишет длинный гневный отзыв на Яндекс Картах.", "next_node": "path_good_4", "effects": { "loyalty": -25, "tech": 0, "safety": 0 } }
            ]
          },
          "path_good_4": {
            "title": "Сцена 4: Умный замок",
            "text": "Конец смены. Гость возвращает карету, но замок не закрывается — спица мешает блокиратору. Таймер тикает.",
            "choices": [
              { "text": "Чуть прокатить карету, защелкнуть замок. Помочь закрыть сессию.", "is_correct": true, "feedback_text": "Замок закрыт. Гость жмет руку.", "next_node": "ending_master", "effects": { "loyalty": 20, "tech": 10, "safety": 0 } }
            ]
          },
          "path_terpila_2": {
            "title": "Сцена 2: Снежный ком",
            "text": "Отец семейства орет матом на весь парк. Его штаны в шаурме, деньги списались, колесо спущено.",
            "choices": [
              { "text": "Перевести ему 500 рублей со своего Сбера и отдать чистую карету бесплатно.", "is_correct": false, "feedback_text": "Он уезжает довольный, но другие поняли, что из тебя можно вить верёвки.", "next_node": "path_terpila_3", "effects": { "loyalty": 20, "tech": -20, "safety": 0 } },
              { "text": "Спрятаться за карету: 'Пишите в техподдержку, я тут просто стою'.", "is_correct": false, "feedback_text": "Он звонит в полицию. ТМ звонит тебе и орёт.", "next_node": "path_terpila_3", "effects": { "loyalty": -40, "tech": -10, "safety": 0 } }
            ]
          },
          "path_terpila_3": {
            "title": "Сцена 3: Полный беспредел",
            "text": "Пятеро подростков собираются залезть в двухместную карету все сразу, включая крышу.",
            "choices": [
              { "text": "Разрешить. 'Только поаккуратнее, ребят...'", "is_correct": false, "feedback_text": "Они с улюлюканьем уезжают, проламывая тент и гня ось.", "next_node": "path_terpila_4", "effects": { "loyalty": 10, "tech": -50, "safety": -50 } },
              { "text": "Робко сказать: 'Ребят, так нельзя'.", "is_correct": false, "feedback_text": "Они говорят 'Да расслабься, дядя' и уезжают.", "next_node": "path_terpila_4", "effects": { "loyalty": -10, "tech": -40, "safety": -40 } }
            ]
          },
          "path_terpila_4": {
            "title": "Сцена 4: Минус зарплата",
            "text": "Гость возвращает карету с опозданием на 30 минут и отказывается платить, заявляя что 'приложение лагало'.",
            "choices": [
              { "text": "Написать ТМ отменить долг и сказать, что это твоя вина.", "is_correct": false, "feedback_text": "Долг гостя списывают... с твоей зарплаты.", "next_node": "ending_terpila", "effects": { "loyalty": 15, "tech": 0, "safety": 0 } }
            ]
          },
          "path_chaos_2": {
            "title": "Сцена 2: Уличный бизнесмен",
            "text": "Две компании спорят, кому достанется последняя свободная карета.",
            "choices": [
              { "text": "Устроить аукцион: 'Кто скинет мне 500 рублей сверху, тот и едет!'", "is_correct": false, "feedback_text": "Одна компания уходит в бешенстве, вторая платит взятку. Карма падает.", "next_node": "path_chaos_3", "effects": { "loyalty": -40, "tech": 0, "safety": 0 } },
              { "text": "Сказать 'Сами разбирайтесь' и уйти пить кофе.", "is_correct": false, "feedback_text": "Они чуть не подрались, порвали тент в процессе.", "next_node": "path_chaos_3", "effects": { "loyalty": -30, "tech": -30, "safety": -20 } }
            ]
          },
          "path_chaos_3": {
            "title": "Сцена 3: Ремонт по-русски",
            "text": "Вернули карету. Умный замок не закрывается — что-то заело внутри механизма.",
            "choices": [
              { "text": "Найти большой камень и ударить по замку.", "is_correct": false, "feedback_text": "Замок разлетается на куски. Гость снимает тебя на видео.", "next_node": "path_chaos_4", "effects": { "loyalty": -30, "tech": -50, "safety": -20 } },
              { "text": "Замотать скотчем и не закрывать сессию в админке.", "is_correct": false, "feedback_text": "Кто-то левый садится и уезжает бесплатно.", "next_node": "path_chaos_4", "effects": { "loyalty": 0, "tech": -40, "safety": -50 } }
            ]
          },
          "path_chaos_4": {
            "title": "Сцена 4: Форсаж по встречке",
            "text": "Подходит пьяный мужик: 'Братан, погнали на трассу до алкомаркета!'",
            "choices": [
              { "text": "Сесть к нему пассажиром. Смена всё равно не задалась.", "is_correct": false, "feedback_text": "Вы выезжаете на трассу. Навстречу едет ДПС...", "next_node": "ending_cringe", "effects": { "loyalty": -50, "tech": -50, "safety": -50 } }
            ]
          },
          "ending_master": {
            "title": "🏆 Концовка: Мастер Карет",
            "text": "Смена закрыта идеально. Гости довольны, техника цела, конфликты улажены. ТМ ставит тебя в пример остальным. Ты — истинный Хранитель локации!",
            "choices": [
              { "text": "✅ Завершить симуляцию", "next_node": "finish_game", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
            ]
          },
          "ending_terpila": {
            "title": "🧸 Концовка: Душа парка (Терпила)",
            "text": "Смена окончена. Ты раздал клиентам все свои личные деньги, кареты убиты в хлам, а ТМ вычитает долги гостей из твоей зарплаты. Завтра на переобучение.",
            "choices": [
              { "text": "🔄 Пройти заново (Обязательно)", "next_node": "prologue", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
            ]
          },
          "ending_cringe": {
            "title": "🤡 Концовка: Уволен с позором",
            "text": "Ты и пьяный мужик едете на сломанной карете по встречной полосе. Сзади воют мигалки ДПС...\n\nВнезапно ты открываешь глаза. Это был кошмар.\n\nПроснись, ты обосрался.",
            "choices": [
              { "text": "🔄 Проснуться и пройти нормально", "next_node": "prologue", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
            ]
          }
        };

        let currentStats = { loyalty: 50, tech: 50, safety: 50 };
        let nextNodeIdToLoad = '';
        let gameChoicesLocked = false;

        function startSimulatorGame() {
            showScreen('screen-game');
            gameChoicesLocked = false;
            renderGameNode('prologue');
        }

        function updateGameStatsUI() {
            document.getElementById('stat-loyalty').innerText = currentStats.loyalty;
            document.getElementById('stat-tech').innerText = currentStats.tech;
            document.getElementById('stat-safety').innerText = currentStats.safety;
            document.getElementById('stat-safety').style.color = currentStats.safety < 30 ? 'var(--red)' : '#111';
        }

        function renderGameNode(nodeId) {
            if (nodeId === 'prologue') currentStats = { loyalty: 50, tech: 50, safety: 50 };
            updateGameStatsUI();
            gameChoicesLocked = false;
            
            const node = gameData[nodeId];
            const titleEl = document.getElementById('game-scene-title');
            const textEl = document.getElementById('game-scene-text');
            
            titleEl.classList.remove('fade-in'); textEl.classList.remove('fade-in');
            void titleEl.offsetWidth; 
            titleEl.classList.add('fade-in'); textEl.classList.add('fade-in');
            titleEl.innerText = node.title;
            textEl.innerText = node.text;

            const choicesContainer = document.getElementById('game-choices-container');
            choicesContainer.innerHTML = '';
            node.choices.forEach((choice) => {
                const btn = document.createElement('button');
                btn.className = "game-btn";
                btn.innerText = choice.text;
                btn.onclick = () => handleGameChoice(choice, btn);
                choicesContainer.appendChild(btn);
            });
        }

        function handleGameChoice(choice, btn) {
            if (gameChoicesLocked) return;
            gameChoicesLocked = true;

            // Визуально блокируем все кнопки
            document.querySelectorAll('.game-btn').forEach(b => {
                b.style.opacity = '0.5';
                b.style.pointerEvents = 'none';
            });
            btn.style.opacity = '1';

            currentStats.loyalty += choice.effects.loyalty;
            currentStats.tech += choice.effects.tech;
            currentStats.safety += choice.effects.safety;
            updateGameStatsUI();

            if (choice.feedback_text) {
                nextNodeIdToLoad = choice.next_node;
                showGameFeedback(choice);
            } else {
                if (choice.next_node === 'finish_game') {
                    handleGameWin();
                } else {
                    gameChoicesLocked = false;
                    renderGameNode(choice.next_node);
                }
            }
        }

        // Победная концовка симулятора — начисляем монеты ОДИН РАЗ
        function handleGameWin() {
            userData.coins += COINS_FOR_SIMULATOR_WIN;
            localStorage.setItem('scoutCoins', userData.coins);
            // Запоминаем монеты за симулятор отдельно (для пересдачи квиза)
            localStorage.setItem('scoutCoinsSimulator', userData.coins);
            completeStep(2);
        }

        function showGameFeedback(choice) {
            document.getElementById('gf-title').innerText = choice.is_correct ? "✅ Хорошее решение" : "❌ Ой...";
            document.getElementById('gf-title').style.color = choice.is_correct ? "var(--green)" : "var(--red)";
            document.getElementById('gf-text').innerText = choice.feedback_text;

            let statsHtml = '';
            if (choice.effects.loyalty !== 0) statsHtml += `<span style="color:${choice.effects.loyalty > 0 ? 'var(--green)' : 'var(--red)'}">❤️ ${choice.effects.loyalty > 0 ? '+' : ''}${choice.effects.loyalty}</span>`;
            if (choice.effects.tech !== 0) statsHtml += `<span style="color:${choice.effects.tech > 0 ? 'var(--green)' : 'var(--red)'}">🔧 ${choice.effects.tech > 0 ? '+' : ''}${choice.effects.tech}</span>`;
            if (choice.effects.safety !== 0) statsHtml += `<span style="color:${choice.effects.safety > 0 ? 'var(--green)' : 'var(--red)'}">🛡️ ${choice.effects.safety > 0 ? '+' : ''}${choice.effects.safety}</span>`;
            document.getElementById('gf-stats').innerHTML = statsHtml;

            document.getElementById('overlay').style.display = 'block';
            setTimeout(() => document.getElementById('game-feedback-popup').classList.add('show'), 10);
            haptic(choice.is_correct ? 'success' : 'error');
        }

        function closeGameFeedback() {
            document.getElementById('game-feedback-popup').classList.remove('show');
            setTimeout(() => {
                document.getElementById('overlay').style.display = 'none';
                if (nextNodeIdToLoad === 'finish_game') {
                        completeStep(2);
                } else {
                    gameChoicesLocked = false;
                    renderGameNode(nextNodeIdToLoad);
                }
            }, 300);
        }