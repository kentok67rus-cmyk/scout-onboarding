// config.js — Конфигурация и утилиты

const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbztUcsreMEKKZ4QfjmKWgkYmZTfBx1WRZRdQQjIcnjryp29vKYN9PbrzJ8lxG6jFK86/exec";

// Константы геймификации
const COINS_PER_CORRECT_ANSWER = 100; // монет за правильный ответ в экзамене
const QUIZ_PASS_THRESHOLD = 4;        // минимум правильных ответов для сдачи (из 5)
const COINS_FOR_SIMULATOR_WIN = 500;  // монет за прохождение симулятора
        
let tg = {}; try { tg = window.Telegram.WebApp;
tg.expand(); } catch(e) { tg = { expand: ()=>{}, HapticFeedback: { impactOccurred: ()=>{}, notificationOccurred: ()=>{} }, showConfirm: (m, cb) => { cb(confirm(m)); }, showAlert: (m) => { alert(m); }, initDataUnsafe: {}, ready: ()=>{} }; }

// Улучшенная генерация PIN — не детерминирована напрямую по телефону,
        // использует несколько шагов хеширования на строке
        function generateUserPin(phoneStr) {
            let digits = String(phoneStr).replace(/\D/g, '');
            if (digits.length < 6) return "1234";
            // Берём последние 8 цифр, умножаем с сдвигом и XOR
            let a = parseInt(digits.slice(-8, -4)) || 1111;
            let b = parseInt(digits.slice(-4)) || 2222;
            let raw = ((a * 31) ^ (b * 17) ^ (a + b) * 7) % 9000;
            if (raw < 0) raw = -raw;
            return (raw + 1000).toString();
        }

        function haptic(type) {
            try { 
                if (type === 'impact') tg.HapticFeedback.impactOccurred('light');
                else tg.HapticFeedback.notificationOccurred(type); 
            } catch(e) {}
        }
