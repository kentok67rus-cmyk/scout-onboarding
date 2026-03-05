// game.js — Симулятор смены | Комикс-формат | Карета Мобилити

// =====================================================================
//  СТИЛИ КОМИКСА (инжектируются в <head>)
// =====================================================================
(function injectComicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* ── Импорт шрифта Onest (фирменный шрифт Кареты) ──────────── */
        @import url('https://fonts.googleapis.com/css2?family=Onest:wght@400;600;700;800;900&display=swap');

        /* ── СТАТБАР ──────────────────────────────────────────────────── */
        .comic-container {
            background: #fff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.10);
            font-family: 'Onest', sans-serif;
        }
        .comic-stats {
            background: #000;
            padding: 12px 18px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            border-bottom: 3px solid #fff100;
        }
        .comic-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
        }
        .comic-stat-label {
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            color: #757575;
            letter-spacing: 0.8px;
            font-family: 'Onest', sans-serif;
        }
        .comic-stat-bar {
            width: 68px;
            height: 7px;
            background: #333;
            border-radius: 4px;
            overflow: hidden;
        }
        .comic-stat-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.5s ease, background 0.3s;
        }
        .comic-stat-value {
            font-size: 12px;
            font-weight: 900;
            color: #fff100;
            font-family: 'Onest', sans-serif;
        }

        /* ── ПАНЕЛЬ-ИЛЛЮСТРАЦИЯ ───────────────────────────────────────── */
        .comic-panel {
            position: relative;
            background: #fffdf0;
            border-bottom: 3px solid #000;
            padding: 24px 20px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 180px;
            justify-content: center;
        }
        .comic-chapter {
            position: absolute;
            top: 10px;
            left: 14px;
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #757575;
            font-family: 'Onest', sans-serif;
        }
        .comic-scene-art {
            font-size: 72px;
            line-height: 1;
            margin-bottom: 12px;
            filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.12));
            animation: comicPop 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes comicPop {
            from { transform: scale(0.5); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
        }

        /* ── РЕЧЕВОЙ ПУЗЫРЬ ───────────────────────────────────────────── */
        .comic-bubble {
            position: relative;
            background: #fff;
            border: 2.5px solid #000;
            border-radius: 18px;
            padding: 13px 16px;
            font-size: 14px;
            font-weight: 600;
            line-height: 1.55;
            color: #000;
            text-align: left;
            width: 100%;
            box-shadow: 3px 3px 0 #000;
            font-family: 'Onest', sans-serif;
        }
        .comic-bubble::before {
            content: '';
            position: absolute;
            top: -14px; left: 24px;
            border: 7px solid transparent;
            border-bottom-color: #000;
        }
        .comic-bubble::after {
            content: '';
            position: absolute;
            top: -10px; left: 25px;
            border: 6px solid transparent;
            border-bottom-color: #fff;
        }
        /* Нарратор — жёлтый фон, без треугольника */
        .comic-bubble-narrator {
            background: #fff100;
            border-color: #000;
            box-shadow: 3px 3px 0 #000;
            color: #000;
        }
        .comic-bubble-narrator::before,
        .comic-bubble-narrator::after { display: none; }

        /* ── КОНТЕНТ ──────────────────────────────────────────────────── */
        .comic-content {
            padding: 16px 18px 10px;
            background: #fff;
        }
        .comic-title {
            font-size: 18px;
            font-weight: 900;
            color: #000;
            margin-bottom: 0;
            text-align: left;
            letter-spacing: -0.3px;
            border-left: 4px solid #fff100;
            padding-left: 10px;
            font-family: 'Onest', sans-serif;
        }

        /* ── КНОПКИ ВЫБОРА ────────────────────────────────────────────── */
        .comic-choices {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 0 18px 20px;
        }
        .comic-choice-btn {
            background: #fff !important;
            color: #000 !important;
            border: 2.5px solid #000 !important;
            padding: 14px 16px !important;
            border-radius: 14px !important;
            font-size: 14px !important;
            font-family: 'Onest', sans-serif !important;
            font-weight: 700 !important;
            text-align: left !important;
            text-transform: none !important;
            box-shadow: 3px 3px 0 #000 !important;
            line-height: 1.4 !important;
            margin-top: 0 !important;
            cursor: pointer;
            transition: transform 0.1s, box-shadow 0.1s !important;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .comic-choice-btn:active {
            transform: translate(3px, 3px) !important;
            box-shadow: 0 0 0 #000 !important;
        }
        /* Буква A/B/C — жёлтая на чёрном (брендбук) */
        .comic-choice-letter {
            background: #000;
            color: #fff100;
            border-radius: 6px;
            width: 24px;
            height: 24px;
            min-width: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 900;
            font-family: 'Onest', sans-serif;
        }
        .comic-choice-btn.selected-correct {
            background: #ebf9e1 !important;
            border-color: #2ecc71 !important;
            box-shadow: 3px 3px 0 #2ecc71 !important;
        }
        .comic-choice-btn.selected-wrong {
            background: #fee2e2 !important;
            border-color: #e74c3c !important;
            box-shadow: 3px 3px 0 #e74c3c !important;
        }

        /* ── ФИДБЕК-ПОПАП ─────────────────────────────────────────────── */
        #game-feedback-popup {
            background: #fff !important;
            border-top: 4px solid #fff100 !important;
        }
        .comic-feedback-title {
            font-size: 21px;
            font-weight: 900;
            margin: 0 0 10px 0;
            font-family: 'Onest', sans-serif;
        }
        .comic-feedback-text {
            font-size: 14px;
            color: #333;
            line-height: 1.55;
            margin-bottom: 14px;
            background: #eaeaea;
            padding: 12px 14px;
            border-radius: 12px;
            border-left: 4px solid #fff100;
            font-family: 'Onest', sans-serif;
            font-weight: 600;
        }
        /* Кнопка Продолжить — чёрная с жёлтым текстом */
        .comic-continue-btn {
            display: block;
            background: #000 !important;
            color: #fff100 !important;
            border: none !important;
            padding: 16px !important;
            border-radius: 14px !important;
            font-size: 16px !important;
            font-weight: 900 !important;
            font-family: 'Onest', sans-serif !important;
            width: 100%;
            text-transform: uppercase !important;
            letter-spacing: 1px;
            cursor: pointer;
            box-shadow: 0 5px 0 #333 !important;
            margin-top: 10px !important;
            transition: transform 0.1s, box-shadow 0.1s !important;
        }
        .comic-continue-btn:active {
            transform: translateY(3px) !important;
            box-shadow: 0 2px 0 #333 !important;
        }

        /* ── КОНЦОВКА ─────────────────────────────────────────────────── */
        .comic-ending {
            padding: 28px 20px;
            text-align: center;
            background: #fff;
        }
        .comic-ending-art {
            font-size: 80px;
            margin-bottom: 16px;
            display: block;
            animation: comicPop 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .comic-ending-title {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 14px;
            color: #000;
            font-family: 'Onest', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .comic-ending-text {
            font-size: 15px;
            color: #333;
            line-height: 1.6;
            text-align: left;
            background: #fff100;
            padding: 18px;
            border-radius: 16px;
            margin-bottom: 20px;
            white-space: pre-line;
            font-family: 'Onest', sans-serif;
            font-weight: 600;
            border: 2.5px solid #000;
            box-shadow: 3px 3px 0 #000;
        }
    `;
    document.head.appendChild(style);
})();

// =====================================================================
//  ДАННЫЕ ИГРЫ
// =====================================================================

const COINS_FOR_SIMULATOR_WIN = 500;

const gameData = {

  "prologue": {
    "art": "☀️🛴",
    "chapter": "Пролог",
    "title": "Утро в Карете",
    "bubble": "07:45. Ты — Скаут Кареты Мобилити. Парк пустой, но через 15 минут откроются ворота.\n\nПриложение открывает замки и списывает деньги само. Твоя задача — порядок, безопасность, техника.\n\nКакой будет смена — зависит только от тебя.",
    "bubble_type": "narrator",
    "choices": [
      { "text": "🚀 Начать смену!", "next_node": "scene_1", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
    ]
  },

  "scene_1": {
    "art": "🔍🛺",
    "chapter": "Сцена 1 — Открытие",
    "title": "Утренний обход",
    "bubble": "Ты делаешь обход. Находишь:\n\n🔴 №3: спущено заднее колесо\n🟡 №5: внутри чужой хот-дог и стаканчик\n⚠️ №1: замок мигает красным\n\nК воротам уже идёт первая семья с детьми.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Снять №3 и №1 с линии. Выкинуть мусор из №5, протереть сиденья. Встретить семью.",
        "is_correct": true,
        "feedback_art": "💪✅",
        "feedback_title": "Профессиональный старт!",
        "feedback_text": "Семья получила чистую исправную карету. Ты контролируешь ситуацию — не приложение, а ты. Так и должно быть.",
        "next_node": "good_2", "effects": { "loyalty": 15, "tech": 15, "safety": 15 }
      },
      {
        "letter": "B",
        "text": "Не трогать ничего — приложение само разберётся. Сесть в телефон.",
        "is_correct": false,
        "feedback_art": "😬💥",
        "feedback_title": "Плохое начало...",
        "feedback_text": "Отец арендует №3. Колесо спущено. Карета не едет. Дети плачут. Деньги списались. Скандал на весь парк.",
        "next_node": "terpila_2", "effects": { "loyalty": -25, "tech": -20, "safety": -10 }
      },
      {
        "letter": "C",
        "text": "Пнуть колесо №3 — авось прокатит. Хот-дог выкинуть в кусты.",
        "is_correct": false,
        "feedback_art": "🤦💀",
        "feedback_title": "Серьёзно?",
        "feedback_text": "Семья сама вытирает сиденье своими салфетками и косится на тебя. Добро пожаловать в ветку Хаоса.",
        "next_node": "chaos_2", "effects": { "loyalty": -30, "tech": -15, "safety": -15 }
      }
    ]
  },

  // ── ВЕТКА ПРОФЕССИОНАЛА ────────────────────────────────────────────
  "good_2": {
    "art": "😤🛺👥",
    "chapter": "Сцена 2 — Инструктаж",
    "title": "Трое зумеров",
    "bubble": "Трое парней с колонкой сканируют QR. Один садится на крышу тента. Собираются рвануть в толпу.\n\nМаксимум: 2 взрослых + 2 детей до 25 кг.\nШтраф за превышение — 1000 ₽.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "«Ребят, трое — это превышение. Штраф 1000₽. Вдвоём — пожалуйста!»",
        "is_correct": true,
        "feedback_art": "🤝👌",
        "feedback_title": "Знание правил — твоя броня!",
        "feedback_text": "Двое остались, один ушёл. Правила соблюдены, конфликта нет. Спокойно и по делу.",
        "next_node": "good_3", "effects": { "loyalty": 10, "tech": 0, "safety": 20 }
      },
      {
        "letter": "B",
        "text": "Промолчать. Правила написаны в приложении — сами читайте.",
        "is_correct": false,
        "feedback_art": "💥🔧",
        "feedback_title": "Ты видел — и промолчал",
        "feedback_text": "Они влетают в бордюр на скорости и гнут педальный вал. Ты виноват — ты видел и ничего не сказал.",
        "next_node": "good_3", "effects": { "loyalty": -10, "tech": -35, "safety": -30 }
      }
    ]
  },

  "good_3": {
    "art": "😤💬",
    "chapter": "Сцена 3 — Возврат",
    "title": "«Верните деньги!»",
    "bubble": "Гость возвращает карету:\n\n💬 «У вас педаль поскрипывает! Я всю поездку нервничал. Верните половину стоимости!»\n\nТы проверяешь — действительно скрипит цепь. Нужна смазка. Не поломка, но дискомфорт реальный.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Извиниться, взять контакт, предложить промокод. Карету — на осмотр.",
        "is_correct": true,
        "feedback_art": "⭐️⭐️⭐️⭐️⭐️",
        "feedback_title": "5 звёзд на Яндекс Картах!",
        "feedback_text": "Гость ушёл довольным. Касса не пострадала. Вот что значит работать с возражением по-человечески.",
        "next_node": "good_4", "effects": { "loyalty": 20, "tech": 10, "safety": 0 }
      },
      {
        "letter": "B",
        "text": "«Ничего не знаю. Пишите в техподдержку.»",
        "is_correct": false,
        "feedback_art": "😡📱",
        "feedback_title": "1 звезда. Хамский персонал.",
        "feedback_text": "Гость пишет отзыв: «Сломанная техника. Хамство». ТМ утром присылает скрин и звонит.",
        "next_node": "good_4", "effects": { "loyalty": -30, "tech": 0, "safety": 0 }
      }
    ]
  },

  "good_4": {
    "art": "👵👴🎧",
    "chapter": "Сцена 4 — Аудиогид",
    "title": "Бабушка и кнопочка",
    "bubble": "Пожилая пара берёт карету. Бабушка спрашивает:\n\n💬 «А что за кнопочка с наушниками? Это платно?»\n\nАудиогид по парку — 1 рубль. Фишка Кареты, которую не все замечают.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Объяснить, показать как включить: «Всего 1 рубль — узнаете историю парка во время поездки!»",
        "is_correct": true,
        "feedback_art": "🥹❤️",
        "feedback_title": "Они вернулись счастливыми!",
        "feedback_text": "Возвращаются через 40 минут: «Мы не знали, что парк такой интересный! Спасибо!» Рекомендуют вас друзьям.",
        "next_node": "good_5", "effects": { "loyalty": 25, "tech": 0, "safety": 0 }
      },
      {
        "letter": "B",
        "text": "«Не знаю, разберётесь в приложении».",
        "is_correct": false,
        "feedback_art": "😔💨",
        "feedback_title": "Упущенный момент",
        "feedback_text": "Пара уехала и так и не узнала про аудиогид. Упущенная возможность сделать кого-то счастливее.",
        "next_node": "good_5", "effects": { "loyalty": -10, "tech": 0, "safety": 0 }
      }
    ]
  },

  "good_5": {
    "art": "😰🆘👶",
    "chapter": "Сцена 5 — ЧП",
    "title": "Ребёнок упал",
    "bubble": "Карета резко затормозила. Малыш (лет 6) не был пристёгнут — слетел с сиденья и плачет.\n\n😰 Родители в панике. Видимых травм нет, но ребёнок держится за локоть.\n\nВокруг — люди.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Подойти, помочь успокоить, предложить аптечку. Написать ТМ о ЧП прямо сейчас.",
        "is_correct": true,
        "feedback_art": "🩹💚",
        "feedback_title": "Реакция профессионала",
        "feedback_text": "Ребёнок в порядке — просто испугался. Родители увидели, что ты среагировал. ТМ получил уведомление вовремя.",
        "next_node": "good_6", "effects": { "loyalty": 20, "tech": 0, "safety": 25 }
      },
      {
        "letter": "B",
        "text": "Сделать вид, что не заметил — это их ответственность.",
        "is_correct": false,
        "feedback_art": "📸😠",
        "feedback_title": "Тебя сфотографировали",
        "feedback_text": "Родители сами справились, но сняли тебя на видео и написали жалобу в управляющую компанию парка.",
        "next_node": "good_6", "effects": { "loyalty": -40, "tech": 0, "safety": -30 }
      }
    ]
  },

  "good_6": {
    "art": "🔒❓💸",
    "chapter": "Сцена 6 — Замок",
    "title": "Умный замок завис",
    "bubble": "Последний гость возвращает карету, но умный замок не закрывается.\n\n⚠️ Таймер аренды тикает. Деньги продолжают списываться.\n\n💬 Гость: «Да что за ерунда?! Я уже вернул!»",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "«Я закрою вручную, вас это не касается.» Прокатить чуть назад — замок защёлкивается. Закрыть сессию в боте.",
        "is_correct": true,
        "feedback_art": "🤝✅",
        "feedback_title": "Замок закрыт!",
        "feedback_text": "Деньги перестали списываться. Гость жмёт руку: «Спасибо, что не бросил!»",
        "next_node": "good_7", "effects": { "loyalty": 20, "tech": 15, "safety": 0 }
      },
      {
        "letter": "B",
        "text": "«Пишите в поддержку» — и уйти домой. Смена же кончилась.",
        "is_correct": false,
        "feedback_art": "💸😡",
        "feedback_title": "Гость стоит ещё 20 минут",
        "feedback_text": "С его карты списывается лишние 400 рублей. Отзыв на 1 звезду уже в пути.",
        "next_node": "good_7", "effects": { "loyalty": -35, "tech": 0, "safety": 0 }
      }
    ]
  },

  "good_7": {
    "art": "📸🅿️✅",
    "chapter": "Сцена 7 — Закрытие",
    "title": "Конец смены",
    "bubble": "21:55. Последний гость уехал.\n\nПо правилам зафиксировать смену = только селфи в Telegram-боте.\n\n💬 Это единственный способ получить зарплату за день.",
    "bubble_type": "narrator",
    "choices": [
      {
        "letter": "A",
        "text": "Сфотографироваться на фоне ровно расставленных карет. Отправить селфи в бот. Написать ТМ отчёт.",
        "is_correct": true,
        "feedback_art": "🏆🌟",
        "feedback_title": "Смена закрыта идеально!",
        "feedback_text": "ТМ видит твою точность. Зарплата зафиксирована. Это путь к хорошей репутации.",
        "next_node": "ending_master", "effects": { "loyalty": 10, "tech": 10, "safety": 10 }
      },
      {
        "letter": "B",
        "text": "Записать в блокнот, позвонить ТМ завтра — устал, неохота с ботом возиться.",
        "is_correct": false,
        "feedback_art": "❓💰",
        "feedback_title": "Зарплата под вопросом",
        "feedback_text": "Система не зафиксировала смену. Разбираться придётся завтра.",
        "next_node": "ending_master", "effects": { "loyalty": 0, "tech": 0, "safety": -10 }
      }
    ]
  },

  // ── ВЕТКА ТЕРПИЛЫ ──────────────────────────────────────────────────
  "terpila_2": {
    "art": "😤👨‍👩‍👧‍👦💥",
    "chapter": "Сцена 2 — Скандал",
    "title": "Отец семейства",
    "bubble": "Отец орёт матом на весь парк. Штаны в соусе от хот-дога, деньги списались, колесо спущено, дети ревут.\n\nВокруг — толпа. Все смотрят на тебя.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Перевести ему 500₽ со своего Сбера и отдать другую карету бесплатно.",
        "is_correct": false,
        "feedback_art": "😬🔁",
        "feedback_title": "Теперь все хотят скандал",
        "feedback_text": "Двое в толпе это видели. Теперь каждый хочет «скандал за скидку». Ты создал прецедент.",
        "next_node": "terpila_3", "effects": { "loyalty": 10, "tech": -10, "safety": 0 }
      },
      {
        "letter": "B",
        "text": "Спрятаться за карету: «Я тут просто стою. Пишите в техподдержку.»",
        "is_correct": false,
        "feedback_art": "🚔😰",
        "feedback_title": "Он звонит в полицию",
        "feedback_text": "ТМ звонит тебе. Ты не берёшь. ТМ приезжает лично. Это хуже любого скандала.",
        "next_node": "terpila_3", "effects": { "loyalty": -40, "tech": 0, "safety": -10 }
      }
    ]
  },

  "terpila_3": {
    "art": "😅🛺👦👦👦👦👦",
    "chapter": "Сцена 3 — Толпа",
    "title": "Пятеро в двухместной",
    "bubble": "Пятеро подростков хотят все сразу в двухместную. Один планирует встать на бампер сзади.\n\n⚠️ Максимум: 2 взрослых + 2 детей.\nШтраф — 1000 ₽.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Разрешить: «Только поаккуратнее...» — и отвернуться.",
        "is_correct": false,
        "feedback_art": "💥🔩",
        "feedback_title": "Тент сломан. Ось погнута.",
        "feedback_text": "Они срываются с места. Ломают тент, гнут ось. Ремонт — 8000 рублей. Это ляжет на тебя.",
        "next_node": "terpila_4", "effects": { "loyalty": 5, "tech": -50, "safety": -50 }
      },
      {
        "letter": "B",
        "text": "Робко сказать «ребят, так нельзя» и опустить взгляд.",
        "is_correct": false,
        "feedback_art": "😤💨",
        "feedback_title": "«Да расслабься, дядя!»",
        "feedback_text": "И уехали впятером. Тент погнут. Ось скрипит. Ты ничего не сделал.",
        "next_node": "terpila_4", "effects": { "loyalty": -10, "tech": -35, "safety": -40 }
      }
    ]
  },

  "terpila_4": {
    "art": "⏱️😤💬",
    "chapter": "Сцена 4 — Опоздание",
    "title": "+40 минут",
    "bubble": "Гость вернул карету с опозданием на 40 минут:\n\n💬 «Приложение лагало, я вообще не понял что время идёт. Платить не буду.»\n\nПо правилам — он обязан заплатить за доп. время.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Написать ТМ: «Отмени долг — это я виноват, не объяснил.» Долг списывается с твоей зарплаты.",
        "is_correct": false,
        "feedback_art": "💸📉",
        "feedback_title": "Минус 600 рублей. Снова.",
        "feedback_text": "Гость доволен. Ты минус 600₽. Четвёртый раз за месяц. ТМ начинает замечать паттерн.",
        "next_node": "terpila_5", "effects": { "loyalty": 10, "tech": 0, "safety": 0 }
      },
      {
        "letter": "B",
        "text": "«Ладно, ничего страшного» — закрыть аренду без оплаты самому.",
        "is_correct": false,
        "feedback_art": "📊❓",
        "feedback_title": "Система видит несоответствие",
        "feedback_text": "ТМ видит, что ты регулярно закрываешь аренды в минус. Разговор неизбежен.",
        "next_node": "terpila_5", "effects": { "loyalty": 5, "tech": -10, "safety": 0 }
      }
    ]
  },

  "terpila_5": {
    "art": "🩹😰👩",
    "chapter": "Сцена 5 — ЧП",
    "title": "Нужна аптечка!",
    "bubble": "Ребёнок упал с кареты и разбил колено. Мама в слезах требует аптечку.\n\n💬 «Ну где у вас аптечка?! Ребёнок плачет!»\n\nТы знаешь, что она где-то есть... но не помнишь где именно.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Судорожно искать аптечку 10 минут, приговаривая «сейчас найду, наверное...»",
        "is_correct": false,
        "feedback_art": "😞📝",
        "feedback_title": "Полная неорганизованность",
        "feedback_text": "Аптечки не нашёл. Мама достала свои салфетки. Потом написала отзыв про «полную неорганизованность».",
        "next_node": "terpila_6", "effects": { "loyalty": -25, "tech": 0, "safety": -30 }
      },
      {
        "letter": "B",
        "text": "Позвонить ТМ прямо при маме: «Где аптечка?! Не могу найти!»",
        "is_correct": false,
        "feedback_art": "😬📞",
        "feedback_title": "Мама всё видела",
        "feedback_text": "ТМ объяснил где аптечка, нашёл. Но мама уже поняла — ты не готов к работе.",
        "next_node": "terpila_6", "effects": { "loyalty": -15, "tech": 0, "safety": -20 }
      }
    ]
  },

  "terpila_6": {
    "art": "👫🤫📷",
    "chapter": "Сцена 6 — Знакомый",
    "title": "«Мы же друзья»",
    "bubble": "Знакомый просит дать карету на «10 минут бесплатно — никто не увидит».\n\n📷 Камеры в парке есть.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Дать карету, не открывая аренду. Знакомый же.",
        "is_correct": false,
        "feedback_art": "📹😬",
        "feedback_title": "Камера зафиксировала",
        "feedback_text": "ТМ вызывает тебя на разговор. Это уже второй раз. Дружба — не повод нарушать правила.",
        "next_node": "terpila_7", "effects": { "loyalty": 5, "tech": -10, "safety": -20 }
      },
      {
        "letter": "B",
        "text": "«Я бы рад, но меня уволят. Открой аренду по QR как все.»",
        "is_correct": true,
        "feedback_art": "👍🛡️",
        "feedback_title": "Правильное решение!",
        "feedback_text": "Знакомый немного обиделся, но понял. Ты сохранил работу и репутацию. Настоящие друзья поймут.",
        "next_node": "terpila_7", "effects": { "loyalty": 5, "tech": 0, "safety": 10 }
      }
    ]
  },

  "terpila_7": {
    "art": "🅿️😮‍💨",
    "chapter": "Сцена 7 — Закрытие",
    "title": "22:00. Ты устал.",
    "bubble": "Кареты стоят как попало. Замки закрыты, но парковка не в порядке.\n\nМожно уйти — никто сейчас не проверит.\nМожно остаться и расставить всё правильно.",
    "bubble_type": "narrator",
    "choices": [
      {
        "letter": "A",
        "text": "Расставить кареты, сфотографировать, отправить в бот. Ещё 15 минут, но по правилам.",
        "is_correct": true,
        "feedback_art": "💪🌙",
        "feedback_title": "Профессионализм — даже когда устал",
        "feedback_text": "Утренний скаут придёт на ровную парковку. Это и есть характер.",
        "next_node": "ending_terpila", "effects": { "loyalty": 10, "tech": 10, "safety": 10 }
      },
      {
        "letter": "B",
        "text": "Уйти домой. И так сойдёт — замки закрыты.",
        "is_correct": false,
        "feedback_art": "📸😤",
        "feedback_title": "Утро. Фото в общем чате.",
        "feedback_text": "Утренний скаут фотографирует хаос и отправляет в чат. Все знают, чья смена была вчера.",
        "next_node": "ending_terpila", "effects": { "loyalty": -15, "tech": 0, "safety": -10 }
      }
    ]
  },

  // ── ВЕТКА ХАОСА ────────────────────────────────────────────────────
  "chaos_2": {
    "art": "😤😤🛺",
    "chapter": "Сцена 2 — Аукцион",
    "title": "Двойное бронирование",
    "bubble": "Две компании спорят — обе арендовали одну карету одновременно. Система дала двойное бронирование.\n\nОни смотрят на тебя. Ждут решения.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "«Кто скинет мне 500₽ сверху — тот и едет!»",
        "is_correct": false,
        "feedback_art": "📹🤡",
        "feedback_title": "Тебя снимают на видео",
        "feedback_text": "Одна компания уходит в бешенстве и пишет жалобу. Вторая рассказывает всем знакомым. Видео уходит в чаты.",
        "next_node": "chaos_3", "effects": { "loyalty": -50, "tech": 0, "safety": 0 }
      },
      {
        "letter": "B",
        "text": "«Сами разбирайтесь» — уйти пить кофе.",
        "is_correct": false,
        "feedback_art": "👊🛺💥",
        "feedback_title": "Они подрались",
        "feedback_text": "Порвали тент в процессе. Тебя вызывает охрана парка. Объяснять придётся долго.",
        "next_node": "chaos_3", "effects": { "loyalty": -35, "tech": -30, "safety": -25 }
      }
    ]
  },

  "chaos_3": {
    "art": "🔒😤🪨",
    "chapter": "Сцена 3 — Замок",
    "title": "Ремонт по-скаутски",
    "bubble": "Вернули карету. Умный замок не закрывается. Гость нервничает, деньги капают.\n\nТы понятия не имеешь, как это чинится.",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Взять большой камень и ударить по замку посильнее.",
        "is_correct": false,
        "feedback_art": "💥📹😱",
        "feedback_title": "Замок разлетелся",
        "feedback_text": "Гость снимает тебя на видео. Ремонт — 12 000 рублей. Это незабываемый контент.",
        "next_node": "chaos_4", "effects": { "loyalty": -30, "tech": -55, "safety": -20 }
      },
      {
        "letter": "B",
        "text": "Замотать скотчем и не закрывать сессию — «потом разберёмся».",
        "is_correct": false,
        "feedback_art": "🏃💸",
        "feedback_title": "Карету угнали",
        "feedback_text": "Через 10 минут чужой человек садится в незакрытую карету и уезжает. Деньги продолжают капать с гостя.",
        "next_node": "chaos_4", "effects": { "loyalty": -15, "tech": -40, "safety": -45 }
      }
    ]
  },

  "chaos_4": {
    "art": "🍺😎🛺",
    "chapter": "Сцена 4 — Пьяный клиент",
    "title": "«Я айтишник»",
    "bubble": "Мужик явно выпил:\n\n💬 «Братан, я айтишник, гарантирую безопасность. До алкомаркета и обратно — плачу двойную цену наличкой!»",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Взять наличку и дать карету — деньги не пахнут.",
        "is_correct": false,
        "feedback_art": "🚑📷😰",
        "feedback_title": "Скорая. Полиция. Камеры.",
        "feedback_text": "Он проезжает 200 метров и падает на повороте. Камера всё видела. Тебя отстраняют от работы.",
        "next_node": "chaos_5", "effects": { "loyalty": -50, "tech": -20, "safety": -60 }
      },
      {
        "letter": "B",
        "text": "Сесть к нему пассажиром — смена всё равно не задалась.",
        "is_correct": false,
        "feedback_art": "🚔😱",
        "feedback_title": "ДПС. Это уже уголовка.",
        "feedback_text": "Вы выезжаете за ворота парка на дорогу. Навстречу — ДПС. Это больше не рабочий конфликт.",
        "next_node": "chaos_5", "effects": { "loyalty": -60, "tech": -30, "safety": -70 }
      }
    ]
  },

  "chaos_5": {
    "art": "📞😬",
    "chapter": "Сцена 5 — Звонок",
    "title": "ТМ звонит",
    "bubble": "ТМ звонит прямо во время смены. По голосу — уже знает.\n\n💬 «Мне звонили из охраны парка. Что там происходит?»",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Рассказать всё честно. Признать ошибки. Попросить помочь.",
        "is_correct": true,
        "feedback_art": "🤝⚠️",
        "feedback_title": "Предупреждение, но не увольнение",
        "feedback_text": "ТМ приезжает и помогает закрыть скандал. Тебя пока не увольняют. Честность спасла.",
        "next_node": "chaos_6", "effects": { "loyalty": 20, "tech": 0, "safety": 15 }
      },
      {
        "letter": "B",
        "text": "Не брать трубку. Потом само рассосётся.",
        "is_correct": false,
        "feedback_art": "🚗😤",
        "feedback_title": "ТМ едет лично",
        "feedback_text": "ТМ видит всё своими глазами. Это хуже, чем честный разговор по телефону.",
        "next_node": "chaos_6", "effects": { "loyalty": -40, "tech": 0, "safety": -20 }
      }
    ]
  },

  "chaos_6": {
    "art": "🌙🛺🧹",
    "chapter": "Сцена 6 — Последний шанс",
    "title": "Никто не видит",
    "bubble": "ТМ уехал. Ещё 2 часа смены.\n\n4 кареты стоят криво. Одна с открытой сессией. У одной разряжен маячок.\n\nМожно уйти — никто не проверит прямо сейчас.",
    "bubble_type": "narrator",
    "choices": [
      {
        "letter": "A",
        "text": "Остаться. Расставить кареты. Закрыть сессию. Написать заявку на маячок.",
        "is_correct": true,
        "feedback_art": "💪🌟",
        "feedback_title": "Без свидетелей — настоящий ты",
        "feedback_text": "Ты сделал то, что должен. Без свидетелей. Это и есть настоящий профессионализм.",
        "next_node": "chaos_7", "effects": { "loyalty": 25, "tech": 20, "safety": 20 }
      },
      {
        "letter": "B",
        "text": "Уйти. Смена сломана, репутация тоже. Зачем стараться.",
        "is_correct": false,
        "feedback_art": "📸😤🌅",
        "feedback_title": "Утром — фото в чате",
        "feedback_text": "Утренний скаут видит хаос. Фотографирует. Все знают, чья смена была вчера.",
        "next_node": "chaos_7", "effects": { "loyalty": -30, "tech": -20, "safety": -20 }
      }
    ]
  },

  "chaos_7": {
    "art": "📋😤",
    "chapter": "Сцена 7 — Разбор",
    "title": "Завтра в 10:00",
    "bubble": "💬 ТМ пишет: «Завтра в 10:00 — разбор смены. Приходи.»",
    "bubble_type": "speech",
    "choices": [
      {
        "letter": "A",
        "text": "Написать «Буду. Всё расскажу.» и прийти вовремя.",
        "is_correct": true,
        "feedback_art": "🤝💬",
        "feedback_title": "Честность — последний козырь",
        "feedback_text": "ТМ ценит тех, кто приходит и говорит правду. Ты выжил.",
        "next_node": "ending_chaos_survived", "effects": { "loyalty": 15, "tech": 0, "safety": 10 }
      },
      {
        "letter": "B",
        "text": "Написать «Заболел» и не прийти.",
        "is_correct": false,
        "feedback_art": "📦👋",
        "feedback_title": "«Твои вещи можешь забрать»",
        "feedback_text": "ТМ пишет: «Понял. Твои вещи можешь забрать в удобное время.»",
        "next_node": "ending_cringe", "effects": { "loyalty": -50, "tech": 0, "safety": 0 }
      }
    ]
  },

  // ── КОНЦОВКИ ───────────────────────────────────────────────────────
  "ending_master": {
    "art": "🏆",
    "chapter": "Конец",
    "title": "Хранитель локации",
    "bubble": "Смена закрыта идеально.\n\nГости довольны, техника цела, все конфликты улажены по правилам. Замки закрыты, парковка ровная, зарплата зафиксирована в боте.\n\nТМ ставит тебя в пример на общем созвоне.\n\nТы — Хранитель локации. Настоящий Скаут.",
    "bubble_type": "narrator",
    "is_ending": true,
    "choices": [
      { "text": "🎉 Завершить симуляцию", "next_node": "finish_game", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
    ]
  },

  "ending_terpila": {
    "art": "🧸",
    "chapter": "Конец",
    "title": "Душа парка (но не голова)",
    "bubble": "Смена окончена. Ты добрый человек — это правда.\n\nНо доброта без знания правил стоит тебе денег, нервов и репутации. Клиенты чувствуют неуверенность и пользуются этим.\n\nЗавтра — переобучение. Изучи правила по штрафам и нормативам.\n\nТы можешь стать хорошим Скаутом — нужно чуть больше уверенности.",
    "bubble_type": "narrator",
    "is_ending": true,
    "choices": [
      { "text": "🔄 Пройти заново", "next_node": "prologue", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
    ]
  },

  "ending_chaos_survived": {
    "art": "😅",
    "chapter": "Конец",
    "title": "Выжил. Еле-еле.",
    "bubble": "Разбор прошёл тяжело. ТМ выдал последнее предупреждение.\n\nНо ты пришёл, признал ошибки и не убежал от ответственности.\n\nСледующая смена — с напарником. Если справишься — останешься.",
    "bubble_type": "narrator",
    "is_ending": true,
    "choices": [
      { "text": "🔄 Пройти правильно", "next_node": "prologue", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
    ]
  },

  "ending_cringe": {
    "art": "🤡",
    "chapter": "Конец",
    "title": "Уволен. С позором.",
    "bubble": "Пьяный клиент на карете. Камеры парка. ДПС. Звонок ТМ без ответа. Неявка на разбор...\n\nВнезапно ты открываешь глаза.\n\nЭто был кошмар.\n\nПроснись. Пройди нормально.",
    "bubble_type": "narrator",
    "is_ending": true,
    "choices": [
      { "text": "🔄 Проснуться и сделать правильно", "next_node": "prologue", "effects": { "loyalty": 0, "tech": 0, "safety": 0 } }
    ]
  }
};

// =====================================================================
//  ЛОГИКА ИГРЫ
// =====================================================================

const STAT_DANGER = 15;
let currentStats = { loyalty: 50, tech: 50, safety: 50 };
let nextNodeIdToLoad = '';
let gameChoicesLocked = false;

function startSimulatorGame() {
    currentStats = { loyalty: 50, tech: 50, safety: 50 };
    gameChoicesLocked = false;
    showScreen('screen-game');
    renderGameNode('prologue');
}

function updateGameStatsUI() {
    ['loyalty','tech','safety'].forEach(key => {
        const val = Math.max(0, Math.min(100, currentStats[key]));
        const fill = document.getElementById('stat-fill-' + key);
        const valEl = document.getElementById('stat-val-' + key);
        if (fill) {
            fill.style.width = val + '%';
            fill.style.background = val < STAT_DANGER ? 'var(--red)' : val < 40 ? 'var(--orange)' : 'var(--green)';
        }
        if (valEl) valEl.innerText = val;
    });
}

function renderGameNode(nodeId) {
    if (nodeId === 'prologue') currentStats = { loyalty: 50, tech: 50, safety: 50 };
    updateGameStatsUI();
    gameChoicesLocked = false;

    const node = gameData[nodeId];
    if (!node) return;

    const container = document.getElementById('game-choices-container');

    // Если концовка — рендерим особый layout
    if (node.is_ending) {
        renderEnding(node, nodeId);
        return;
    }

    const html = `
        <div class="comic-container">
            <div class="comic-stats">
                <div class="comic-stat">
                    <span class="comic-stat-label">❤️ Лояльность</span>
                    <div class="comic-stat-bar"><div class="comic-stat-fill" id="stat-fill-loyalty" style="width:${currentStats.loyalty}%"></div></div>
                    <span class="comic-stat-value" id="stat-val-loyalty">${currentStats.loyalty}</span>
                </div>
                <div class="comic-stat">
                    <span class="comic-stat-label">🔧 Техника</span>
                    <div class="comic-stat-bar"><div class="comic-stat-fill" id="stat-fill-tech" style="width:${currentStats.tech}%"></div></div>
                    <span class="comic-stat-value" id="stat-val-tech">${currentStats.tech}</span>
                </div>
                <div class="comic-stat">
                    <span class="comic-stat-label">🛡️ Безопасность</span>
                    <div class="comic-stat-bar"><div class="comic-stat-fill" id="stat-fill-safety" style="width:${currentStats.safety}%"></div></div>
                    <span class="comic-stat-value" id="stat-val-safety">${currentStats.safety}</span>
                </div>
            </div>
            <div class="comic-panel">
                <span class="comic-chapter">${node.chapter || ''}</span>
                ${nodeImages[nodeId] ? `<img src="${IMAGE_BASE_PATH}${nodeImages[nodeId]}" class="comic-story-image" alt="">` : `<div class="comic-scene-art">${node.art || '🛺'}</div>`}
                <div class="comic-bubble ${node.bubble_type === 'narrator' ? 'comic-bubble-narrator' : ''}">${node.bubble.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="comic-content">
                <div class="comic-title">${node.title}</div>
            </div>
        </div>
    `;

    // Вставляем карточку перед контейнером выборов
    const gameContent = document.querySelector('.game-content');
    if (gameContent) {
        // Убираем старый контент
        const oldComic = document.querySelector('.comic-container');
        if (oldComic) oldComic.remove();
        const oldTitle = document.getElementById('game-scene-title');
        const oldText  = document.getElementById('game-scene-text');
        if (oldTitle) oldTitle.innerText = '';
        if (oldText)  oldText.innerText  = '';
        gameContent.insertAdjacentHTML('afterbegin', html);
    }

    // Рендерим кнопки выборов
    container.innerHTML = '';
    const letters = ['A','B','C','D'];
    node.choices.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'comic-choice-btn';
        btn.innerHTML = `<span class="comic-choice-letter">${choice.letter || letters[i]}</span><span>${choice.text}</span>`;
        btn.onclick = () => handleGameChoice(choice, btn);
        container.appendChild(btn);
    });
}

function renderEnding(node, nodeId) {
    const gameContent = document.querySelector('.game-content');
    const container   = document.getElementById('game-choices-container');
    const oldComic = document.querySelector('.comic-container');
    if (oldComic) oldComic.remove();
    const oldTitle = document.getElementById('game-scene-title');
    const oldText  = document.getElementById('game-scene-text');
    if (oldTitle) oldTitle.innerText = '';
    if (oldText)  oldText.innerText  = '';

    const endingHtml = `
        <div class="comic-container">
            <div class="comic-ending">
                ${nodeImages[nodeId] ? `<img src="${IMAGE_BASE_PATH}${nodeImages[nodeId]}" class="comic-story-image" alt="">` : `<span class="comic-ending-art">${node.art}</span>`}
                <div class="comic-ending-title">${node.title}</div>
                <div class="comic-ending-text">${node.bubble}</div>
            </div>
        </div>
    `;
    if (gameContent) gameContent.insertAdjacentHTML('afterbegin', endingHtml);

    container.innerHTML = '';
    node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'comic-choice-btn';
        btn.style.justifyContent = 'center';
        btn.style.textAlign = 'center';
        btn.innerText = choice.text;
        btn.onclick = () => handleGameChoice(choice, btn);
        container.appendChild(btn);
    });
}

function handleGameChoice(choice, btn) {
    if (gameChoicesLocked) return;
    gameChoicesLocked = true;

    document.querySelectorAll('.comic-choice-btn').forEach(b => {
        b.style.opacity = '0.35';
        b.style.pointerEvents = 'none';
    });
    btn.style.opacity = '1';
    btn.classList.add(choice.is_correct ? 'selected-correct' : (choice.is_correct === false ? 'selected-wrong' : ''));

    currentStats.loyalty += choice.effects.loyalty;
    currentStats.tech    += choice.effects.tech;
    currentStats.safety  += choice.effects.safety;
    updateGameStatsUI();

    if (choice.feedback_text || choice.feedback_title) {
        nextNodeIdToLoad = choice.next_node;
        showGameFeedback(choice);
    } else {
        setTimeout(() => {
            gameChoicesLocked = false;
            if (choice.next_node === 'finish_game') handleGameWin();
            else renderGameNode(choice.next_node);
        }, 300);
    }
}

function handleGameWin() {
    userData.coins += COINS_FOR_SIMULATOR_WIN;
    localStorage.setItem('scoutCoins', userData.coins);
    completeStep(2);
}

function showGameFeedback(choice) {
    const isGood = choice.is_correct;
    const popup  = document.getElementById('game-feedback-popup');

    popup.innerHTML = `
        <div style="font-size:48px; text-align:center; margin-bottom:8px;">${choice.feedback_art || (isGood ? '✅' : '❌')}</div>
        <div class="comic-feedback-title" style="color:${isGood ? 'var(--green)' : 'var(--red)'}">${choice.feedback_title || (isGood ? 'Верно!' : 'Ой...')}</div>
        <div class="comic-feedback-text">${choice.feedback_text || ''}</div>
        <div id="gf-stats" style="display:flex;justify-content:center;gap:14px;margin-bottom:12px;font-size:16px;font-weight:900;"></div>
        <button class="comic-continue-btn" onclick="closeGameFeedback()">Продолжить →</button>
    `;

    const fx = choice.effects;
    const statsEl = popup.querySelector('#gf-stats');
    if (statsEl) {
        let html = '';
        if (fx.loyalty !== 0) html += `<span style="color:${fx.loyalty > 0 ? 'var(--green)' : 'var(--red)'}">❤️ ${fx.loyalty > 0 ? '+' : ''}${fx.loyalty}</span>`;
        if (fx.tech    !== 0) html += `<span style="color:${fx.tech    > 0 ? 'var(--green)' : 'var(--red)'}">🔧 ${fx.tech    > 0 ? '+' : ''}${fx.tech}</span>`;
        if (fx.safety  !== 0) html += `<span style="color:${fx.safety  > 0 ? 'var(--green)' : 'var(--red)'}">🛡️ ${fx.safety  > 0 ? '+' : ''}${fx.safety}</span>`;
        statsEl.innerHTML = html;
    }

    document.getElementById('overlay').style.display = 'block';
    setTimeout(() => popup.classList.add('show'), 10);
    haptic(isGood ? 'success' : 'error');
}

function closeGameFeedback() {
    const popup = document.getElementById('game-feedback-popup');
    popup.classList.remove('show');
    setTimeout(() => {
        document.getElementById('overlay').style.display = 'none';
        gameChoicesLocked = false;
        if (nextNodeIdToLoad === 'finish_game') handleGameWin();
        else renderGameNode(nextNodeIdToLoad);
    }, 300);
}
