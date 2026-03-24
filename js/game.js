// game.js — Симулятор смены | Комикс-формат | Карета Мобилити

// =====================================================================
//  СТИЛИ КОМИКСА (инжектируются в <head>)
// =====================================================================
(function injectComicStyles() {
    const style = document.createElement('style');
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Onest:wght@400;600;700;800;900&display=swap');

    #screen-game { padding: 0 !important; overflow: hidden !important; background: #000; height: 100% !important; min-height: 100vh; background: #000 !important; }

    .game-container {
        position: relative;
        width: 100%;
        height: 100vh; background: #000 !important;
        overflow: hidden;
        font-family: 'Onest', sans-serif;
    }

    /* Фон — картинка во весь экран, БЕЗ градиента */
    .game-bg-img {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        object-fit: cover;
        object-position: center top;
        z-index: 1;
    }
    .game-bg-emoji {
        position: absolute;
        top: 40%; left: 50%;
        transform: translate(-50%,-50%);
        font-size: 120px;
        z-index: 1;
    }

    /* Статбар сверху */
    .game-stats-bar {
        position: absolute;
        top: 0; left: 0; right: 0;
        z-index: 20;
        display: flex;
        justify-content: space-around;
        padding: 10px 8px 16px;
        background: linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%);
    }
    .gs-item { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .gs-label { font-size: 9px; font-weight: 900; text-transform: uppercase; color: rgba(255,255,255,0.6); letter-spacing: 0.8px; font-family: 'Onest', sans-serif; }
    .gs-bar { width: 64px; height: 5px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
    .gs-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease, background 0.3s; }
    .gs-val { font-size: 12px; font-weight: 900; color: #fff100; font-family: 'Onest', sans-serif; }

    /* Нижний блок — поверх картинки */
    .game-bottom {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        z-index: 10;
        padding: 0 16px 28px;
    }

    /* Название сцены (всегда видно) */
    .game-scene-header {
        margin-bottom: 10px;
    }
    .game-tap-chapter {
        font-size: 10px; font-weight: 900; text-transform: uppercase;
        letter-spacing: 1.5px; color: rgba(255,255,255,0.45);
        font-family: 'Onest', sans-serif;
        text-shadow: 0 1px 4px rgba(0,0,0,0.8);
    }
    .game-tap-title {
        font-size: 26px; font-weight: 900; color: #fff;
        line-height: 1.15; font-family: 'Onest', sans-serif;
        text-shadow: 0 2px 8px rgba(0,0,0,0.9);
    }

    /* Жёлтый пузырь — нажимаемый */
    .game-bubble-tap {
        background: #fff100;
        border: 2.5px solid #000;
        border-radius: 16px;
        padding: 14px 16px;
        font-size: 13px;
        font-weight: 600;
        line-height: 1.55;
        color: #000;
        margin-bottom: 10px;
        box-shadow: 3px 3px 0 rgba(0,0,0,0.4);
        font-family: 'Onest', sans-serif;
        cursor: pointer;
        position: relative;
    }
    .game-bubble-narrator-tap {
        background: rgba(255,255,255,0.95);
    }
    .game-bubble-hint {
        font-size: 11px;
        font-weight: 900;
        color: rgba(0,0,0,0.45);
        text-align: right;
        margin-top: 8px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        animation: pulsehint 1.5s infinite;
    }
    @keyframes pulsehint { 0%,100%{opacity:1} 50%{opacity:0.4} }

    /* Кнопки выборов */
    .game-choices { display: flex; flex-direction: column; gap: 8px; }
    .game-choice-btn {
        background: rgba(0,0,0,0.55) !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: #fff !important;
        border: 1.5px solid rgba(255,255,255,0.3) !important;
        padding: 13px 14px !important;
        border-radius: 14px !important;
        font-size: 14px !important;
        font-family: 'Onest', sans-serif !important;
        font-weight: 700 !important;
        text-align: left !important;
        text-transform: none !important;
        line-height: 1.4 !important;
        margin-top: 0 !important;
        cursor: pointer;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
        box-shadow: none !important;
        transition: transform 0.1s !important;
        animation: slideUp 0.3s ease both;
    }
    .game-choice-btn:nth-child(1) { animation-delay: 0.05s; }
    .game-choice-btn:nth-child(2) { animation-delay: 0.1s; }
    .game-choice-btn:nth-child(3) { animation-delay: 0.15s; }
    @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
    .game-choice-btn:active { transform: scale(0.97) !important; }
    .game-choice-letter {
        background: #fff100; color: #000;
        border-radius: 6px; width: 24px; height: 24px; min-width: 24px;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 900; font-family: 'Onest', sans-serif;
    }
    .game-choice-btn.selected-correct { background: rgba(46,204,113,0.4) !important; border-color: #2ecc71 !important; }
    .game-choice-btn.selected-wrong   { background: rgba(231,76,60,0.4)  !important; border-color: #e74c3c !important; }

    /* Концовка */
    .game-ending-title { font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 10px; font-family: 'Onest', sans-serif; text-transform: uppercase; text-shadow: 0 2px 8px rgba(0,0,0,0.9); }
    .game-ending-text { font-size: 13px; color: #000; line-height: 1.6; background: #fff100; padding: 14px; border-radius: 14px; margin-bottom: 14px; white-space: pre-line; font-family: 'Onest', sans-serif; font-weight: 600; border: 2px solid #000; box-shadow: 3px 3px 0 rgba(0,0,0,0.4); }

    /* Фидбек попап */
    #game-feedback-popup { background: #1a1a1a !important; border-top: 3px solid #fff100 !important; }
    #gf-title { font-size: 20px; font-weight: 900; margin: 0 0 10px 0; color: #fff; font-family: 'Onest', sans-serif; }
    #gf-text { font-size: 14px; color: #ccc; line-height: 1.55; margin-bottom: 14px; background: #2a2a2a; padding: 12px 14px; border-radius: 12px; border-left: 4px solid #fff100; font-family: 'Onest', sans-serif; font-weight: 600; }
    .comic-continue-btn {
        display: block; background: #fff100 !important; color: #000 !important;
        border: none !important; padding: 16px !important; border-radius: 14px !important;
        font-size: 16px !important; font-weight: 900 !important; font-family: 'Onest', sans-serif !important;
        width: 100%; text-transform: uppercase !important; letter-spacing: 1px; cursor: pointer; margin-top: 10px !important;
    }
`;
document.head.appendChild(style);
})();

// =====================================================================
//  ДАННЫЕ ИГРЫ
// =====================================================================


const IMAGE_BASE_PATH = 'images/comic/';
const nodeImages = {
  'prologue':              'prologue.png',
  'scene_1':               'scene_1.png',
  'good_2':                'good_2.png',
  'good_3':                'good_3.png',
  'good_4':                'good_4.png',
  'good_5':                'good_5.png',
  'good_6':                'good_6.png',
  'good_7':                'good_7.png',
  'ending_master':         'ending_good.png',
  'terpila_2':             'neutral_2.png',
  'terpila_3':             'neutral_3.png',
  'terpila_4':             'neutral_4.png',
  'terpila_5':             'terpila_5.png',
  'terpila_6':             'terpila_6.png',
  'terpila_7':             'terpila_7.png',
  'ending_terpila':        'ending_neutral.png',
  'chaos_2':               'bad_2.png',
  'chaos_3':               'bad_3.png',
  'chaos_4':               'bad_4.png',
  'chaos_5':               'chaos_5.png',
  'chaos_6':               'chaos_6.png',
  'chaos_7':               'chaos_7.png',
  'ending_chaos_survived': 'ending_chaos_survived.png',
  'ending_cringe':         'ending_bad.png'
};


const gameData = {   "prologue": {

  
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
let gameChoicesLocked = false;

function startSimulatorGame() {
        // Создаём screen-game в DOM если ещё нет
        if (!document.getElementById('screen-game')) {
                    const appScout = document.getElementById('app-scout');
                    const sg = document.createElement('div');
                    sg.id = 'screen-game'; sg.className = 'screen';
                    sg.innerHTML = '<div class="game-container"></div><div id="game-feedback-popup"><div id="gf-title"></div><div id="gf-text"></div><button class="comic-continue-btn" onclick="closeGameFeedback()">Продолжить</button></div>';
                    if (appScout) appScout.appendChild(sg);
                }
    currentStats = { loyalty: 50, tech: 50, safety: 50 };
            // Гарантируем game-container внутри screen-game
            const _sg = document.getElementById('screen-game');
            if (_sg && !_sg.querySelector('.game-container')) { const _gc = document.createElement('div'); _gc.className = 'game-container'; _sg.insertBefore(_gc, _sg.firstChild); }
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
            fill.style.background = val < STAT_DANGER ? '#e74c3c' : val < 40 ? '#f39c12' : '#2ecc71';
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
    if (node.is_ending) { renderEnding(node, nodeId); return; }

    const imgSrc = nodeImages[nodeId] ? IMAGE_BASE_PATH + nodeImages[nodeId] : null;
    const container = document.querySelector('.game-container');
    if (!container) return;

    // Собираем кнопки выборов как строку (скрыты изначально)
    const letters = ['A','B','C','D'];
    const choicesHtml = node.choices.map((choice, i) => `
        <button class="game-choice-btn" data-idx="${i}">
            <span class="game-choice-letter">${choice.letter || letters[i]}</span>
            <span>${choice.text}</span>
        </button>
    `).join('');

    container.innerHTML = `
        ${imgSrc
            ? `<img src="${imgSrc}" class="game-bg-img" alt="">`
            : `<div class="game-bg-emoji">${node.art || '🛺'}</div>`}

        <div class="game-stats-bar">
            <div class="gs-item">
                <span class="gs-label">❤️ Лояльность</span>
                <div class="gs-bar"><div class="gs-fill" id="stat-fill-loyalty" style="width:${currentStats.loyalty}%;background:#2ecc71"></div></div>
                <span class="gs-val" id="stat-val-loyalty">${currentStats.loyalty}</span>
            </div>
            <div class="gs-item">
                <span class="gs-label">🔧 Техника</span>
                <div class="gs-bar"><div class="gs-fill" id="stat-fill-tech" style="width:${currentStats.tech}%;background:#2ecc71"></div></div>
                <span class="gs-val" id="stat-val-tech">${currentStats.tech}</span>
            </div>
            <div class="gs-item">
                <span class="gs-label">🛡️ Безопасность</span>
                <div class="gs-bar"><div class="gs-fill" id="stat-fill-safety" style="width:${currentStats.safety}%;background:#2ecc71"></div></div>
                <span class="gs-val" id="stat-val-safety">${currentStats.safety}</span>
            </div>
        </div>

        <div class="game-bottom">
            <div class="game-scene-header">
                <div class="game-tap-chapter">${node.chapter || ''}</div>
                <div class="game-tap-title">${node.title}</div>
            </div>

            <!-- Жёлтый пузырь — нажми чтобы скрыть и увидеть вопросы -->
            <div class="game-bubble-tap ${node.bubble_type === 'narrator' ? 'game-bubble-narrator-tap' : ''}" id="game-bubble-tap" onclick="revealChoices('${nodeId}')">
                ${node.bubble.replace(/\n/g, '<br>')}
                <div class="game-bubble-hint">Нажми, чтобы ответить ↓</div>
            </div>

            <!-- Кнопки — скрыты до нажатия на пузырь -->
            <div class="game-choices" id="game-choices-container" style="display:none;">
                ${choicesHtml}
            </div>
        </div>
    `;

    // Вешаем обработчики на кнопки
    container.querySelectorAll('.game-choice-btn').forEach((btn, i) => {
        const choice = node.choices[i];
        btn.onclick = () => handleGameChoice(choice, btn);
    });
}

function revealChoices(nodeId) {
    const bubble = document.getElementById('game-bubble-tap');
    const choices = document.getElementById('game-choices-container');
    if (bubble) bubble.style.display = 'none';
    if (choices) choices.style.display = 'flex';
}

function renderEnding(node, nodeId) {
    updateGameStatsUI();
    const imgSrc = nodeImages[nodeId] ? IMAGE_BASE_PATH + nodeImages[nodeId] : null;
    const container = document.querySelector('.game-container');
    if (!container) return;

    const choicesHtml = node.choices.map(choice => `
        <button class="game-choice-btn" style="justify-content:center;text-align:center;">${choice.text}</button>
    `).join('');

    container.innerHTML = `
        ${imgSrc
            ? `<img src="${imgSrc}" class="game-bg-img" alt="">`
            : `<div class="game-bg-emoji">${node.art || '🏆'}</div>`}

        <div class="game-stats-bar">
            <div class="gs-item">
                <span class="gs-label">❤️ Лояльность</span>
                <div class="gs-bar"><div class="gs-fill" id="stat-fill-loyalty" style="width:${currentStats.loyalty}%;background:#2ecc71"></div></div>
                <span class="gs-val" id="stat-val-loyalty">${currentStats.loyalty}</span>
            </div>
            <div class="gs-item">
                <span class="gs-label">🔧 Техника</span>
                <div class="gs-bar"><div class="gs-fill" id="stat-fill-tech" style="width:${currentStats.tech}%;background:#2ecc71"></div></div>
                <span class="gs-val" id="stat-val-tech">${currentStats.tech}</span>
            </div>
            <div class="gs-item">
                <span class="gs-label">🛡️ Безопасность</span>
                <div class="gs-bar"><div class="gs-fill" id="stat-fill-safety" style="width:${currentStats.safety}%;background:#2ecc71"></div></div>
                <span class="gs-val" id="stat-val-safety">${currentStats.safety}</span>
            </div>
        </div>

        <div class="game-bottom">
            <div class="game-ending-title">${node.title}</div>
            <div class="game-ending-text">${node.bubble}</div>
            <div class="game-choices" id="game-choices-container">${choicesHtml}</div>
        </div>
    `;

    container.querySelectorAll('.game-choice-btn').forEach((btn, i) => {
        const choice = node.choices[i];
        btn.onclick = () => handleGameChoice(choice, btn);
    });
}

function handleGameChoice(choice, btn) {
    if (gameChoicesLocked) return;
    gameChoicesLocked = true;

    document.querySelectorAll('.game-choice-btn').forEach(b => {
        b.style.opacity = '0.35';
        b.style.pointerEvents = 'none';
    });
    btn.style.opacity = '1';
    if (choice.is_correct === true) btn.classList.add('selected-correct');
    else if (choice.is_correct === false) btn.classList.add('selected-wrong');

    currentStats.loyalty += choice.effects.loyalty;
    currentStats.tech    += choice.effects.tech;
    currentStats.safety  += choice.effects.safety;
    updateGameStatsUI();

    const nextNodeId = choice.next_node;

    if (choice.feedback_text || choice.feedback_title) {
        const popup = document.getElementById('game-feedback-popup');
        const titleEl = document.getElementById('gf-title');
        const textEl  = document.getElementById('gf-text');
        if (titleEl) titleEl.innerHTML = (choice.feedback_art || '') + ' ' + (choice.feedback_title || '');
        if (textEl)  textEl.innerText  = choice.feedback_text || '';
        if (popup) {
            popup._nextNodeId = nextNodeId;
            popup.style.display = 'block';
popup.classList.add('show');
        }
    } else {
        if (nextNodeId === 'finish_game') {
            finishSimulatorGame();
        } else {
            setTimeout(() => renderGameNode(nextNodeId), 400);
        }
    }
}

function closeGameFeedback() {
    const popup = document.getElementById('game-feedback-popup');
    if (!popup) return;
    const nextNodeId = popup._nextNodeId;
    popup.style.display = 'none';
popup.classList.remove('show');
    if (!nextNodeId || nextNodeId === 'finish_game') {
        finishSimulatorGame();
    } else {
        setTimeout(() => renderGameNode(nextNodeId), 300);
    }
}

function finishSimulatorGame() {
    // Начисляем монеты за симулятор
    userData.coins = parseInt(localStorage.getItem('scoutCoins') || 0) + COINS_FOR_SIMULATOR_WIN;
    localStorage.setItem('scoutCoins', userData.coins);
    localStorage.setItem('scoutCoinsSimulator', userData.coins);
    haptic('success');

    // Показываем экран-результат симулятора
    const container = document.querySelector('.game-container');
    if (container) {
        container.innerHTML = `
            <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;text-align:center;font-family:'Onest',sans-serif;">
                <div style="font-size:80px;margin-bottom:16px;">🎉</div>
                <div style="font-size:24px;font-weight:900;color:#fff100;margin-bottom:12px;text-transform:uppercase;">Симуляция пройдена!</div>
                <div style="font-size:15px;color:#ccc;line-height:1.6;margin-bottom:24px;">Ты прошёл свою первую смену.<br>Теперь ты знаешь, как всё работает.</div>
                <div style="background:#1e1e1e;border:2px solid #fff100;border-radius:16px;padding:18px 28px;margin-bottom:28px;">
                    <div style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Заработано монет</div>
                    <div style="font-size:36px;font-weight:900;color:#fff100;">+${COINS_FOR_SIMULATOR_WIN} 💰</div>
                </div>
                <button onclick="completeSimulator()" style="background:#fff100;color:#000;border:none;padding:18px 32px;border-radius:16px;font-size:17px;font-weight:900;font-family:'Onest',sans-serif;width:100%;cursor:pointer;text-transform:uppercase;letter-spacing:1px;">Продолжить →</button>
            </div>
        `;
    }
}

function completeSimulator() {
    completeStep(2);
}
