const GAME_TIME = 4;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let currentKana;
let checkInterval;

const wordInput = document.querySelector(".word-input");
const wordDisplay = document.querySelector(".word-display");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const btn = document.querySelector(".button");
const langSelect = document.getElementById("langSelect");

const translations = {
    en: { title: "Hiragana / Katakana Test", time: "Time left", sec: "sec.", score: "Score", point: "point", start: "Game Start", type: "Type!" },
    es: { title: "Prueba de Hiragana / Katakana", time: "Tiempo", sec: "seg.", score: "Puntos", point: "punto", start: "Comenzar", type: "¡Escribe!" },
    fr: { title: "Test de Hiragana / Katakana", time: "Temps", sec: "sec.", score: "Score", point: "point", start: "Démarrer", type: "Tapez!" },
    de: { title: "Hiragana / Katakana Test", time: "Zeit", sec: "sek.", score: "Ergebnis", point: "punkt", start: "Spiel Starten", type: "Tippen!" },
    ar: { title: "اختبار/كاتاكانا الهيراغانا", time: "الوقت المتبقي", sec: "ثانية", score: "النتيجة", point: "نقطة", start: "ابدأ اللعبة", type: "اكتب!" },
    ko: { title: "히라가나 / 가타카나 테스트", time: "남은 시간", sec: "초", score: "점수", point: "점", start: "게임 시작", type: "입력하세요!" },
    zh: { title: "平假名 / 片假名 测试", time: "剩余时间", sec: "秒", score: "得分", point: "分", start: "开始游戏", type: "输入！" },
    ja: { title: "平仮名 / 片仮名 テスト", time: "残り時間", sec: "秒", score: "スコア", point: "点", start: "ゲーム開始", type: "入力！" }
};

const hiraganas = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "wo",
  ん: "n",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  ア: "a",
  イ: "i",
  ウ: "u",
  エ: "e",
  オ: "o",
  カ: "ka",
  キ: "ki",
  ク: "ku",
  ケ: "ke",
  コ: "ko",
  サ: "sa",
  シ: "shi",
  ス: "su",
  セ: "se",
  ソ: "so",
  タ: "ta",
  チ: "chi",
  ツ: "tsu",
  て: "te",
  ト: "to",
  ナ: "na",
  ニ: "ni",
  ヌ: "nu",
  ネ: "ne",
  ノ: "no",
  ハ: "ha",
  ヒ: "hi",
  フ: "fu",
  ヘ: "he",
  ホ: "ho",
  マ: "ma",
  ミ: "mi",
  ム: "mu",
  メ: "me",
  モ: "mo",
  ヤ: "ya",
  ユ: "yu",
  よ: "yo",
  ラ: "ra",
  リ: "ri",
  ル: "ru",
  レ: "re",
  ロ: "ro",
  ワ: "wa",
  ヲ: "wo",
  ン: "n",
  ガ: "ga",
  ギ: "gi",
  グ: "gu",
  げ: "ge",
  ゴ: "go",
  ザ: "za",
  ジ: "ji",
  ズ: "zu",
  ぜ: "ze",
  ぞ: "zo",
  ダ: "da",
  ヂ: "ji",
  ヅ: "zu",
  デ: "de",
  ド: "do",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  パ: "pa",
  ピ: "pi",
  プ: "pu",
  ペ: "pe",
  ポ: "po",
};


const kanaKeys = Object.keys(hiraganas);

function INIT() {
    getWords();
    wordInput.addEventListener("input", checkMatch);
    btn.addEventListener("click", run);
    
    const savedLang = localStorage.getItem('user_lang') || 'en';
    
    langSelect.value = savedLang;
    changeLanguage(savedLang);

    langSelect.addEventListener("change", (e) => {
        const newLang = e.target.value;
        localStorage.setItem('user_lang', newLang);
        changeLanguage(newLang);
    });
}

function changeLanguage(lang) {
    const t = translations[lang];
    if(!t) return;

    document.getElementById("ui-title").innerText = t.title;
    document.getElementById("ui-time-label").innerText = t.time;
    document.getElementById("ui-sec-label").innerText = t.sec;
    document.getElementById("ui-score-label").innerText = t.score;
    document.getElementById("ui-point-label").innerText = t.point;
    
    btn.innerText = isPlaying ? t.type : t.start;
    document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
}

function getWords() {
    currentKana = kanaKeys[Math.floor(Math.random() * kanaKeys.length)];
    wordDisplay.innerText = currentKana;
}

function checkMatch() {
    // Only check answer if game is active
    if (!isPlaying) return;

    if (wordInput.value.toLowerCase().trim() === hiraganas[currentKana]) {
        wordInput.value = "";
        score++;
        scoreDisplay.innerText = score;
        time = GAME_TIME; // Reset timer on correct answer
        getWords(); // Show new word
    }
}

function run() {
    if (isPlaying) return;
    
    isPlaying = true;
    score = 0;
    time = GAME_TIME;
    scoreDisplay.innerText = 0;
    timeDisplay.innerText = GAME_TIME;
    
    wordInput.value = "";
    wordInput.focus();
    
    // Toggle UI State
    btn.classList.add("loading");
    btn.innerText = translations[langSelect.value].type;

    timeInterval = setInterval(countDown, 1000);
    checkInterval = setInterval(checkStatus, 100);
}

function countDown() {
    if (time > 0) {
        time--;
    } else {
        isPlaying = false;
        clearInterval(timeInterval);
    }
    timeDisplay.innerText = time;
}

function checkStatus() {
    if (!isPlaying) {
        // Game Over State
        btn.classList.remove("loading");
        btn.innerText = translations[langSelect.value].start;
        clearInterval(checkInterval);
    }
}

INIT();