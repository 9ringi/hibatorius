/* ======================
   INTRO SCREEN
====================== */

// Configuration: Each line with its duration in milliseconds
const introLines = [
    { text: "Loading, please wait...", duration: 8500 },
    { text: "It's worth the wait, i promise", duration: 3000 },
    { text: "This one is for you, Hiba", duration: 2800 },
    { text: "For every kind word that held me up...", duration: 3000 },
    { text: "For every color you added to my gray world.", duration: 3000 },
    { text: "For every moment you made me feel alive,", duration: 3000 },
    { text: "Loved,", duration: 2000 },
    { text: "And truly happy.", duration: 2000 },
    { text: "Distance is just a number on a map...", duration: 3000 },
    { text: "We are connected in our own way.", duration: 3200 },
    { text: "In this little world, you'll see a glimpse...", duration: 3000 },
    { text: "Of exactly what is waiting for us.", duration: 4000 },
    { text: "ARE YOU READY?", duration: 2500 }
];

// Assets to display (gifs/videos) with their durations
// They will appear in order, one after another
const introAssets = [
    { src: "images/assets/intro/loading.gif", duration: 9500 },  // 16 seconds
    //{ src: "images/assets/intro/zrd.gif", duration: 1500 },     // 7 seconds
    //{ src: "images/assets/intro/wrd1.gif", duration: 1000 },     // 7 seconds
    //{ src: "images/assets/intro/moli.gif", duration: 500 },     // 7 seconds
    { src: "images/assets/intro/wrd2.gif", duration: 4500 },     // 7 seconds
    { src: "images/assets/intro/fly.gif", duration: 2700 },     // 7 seconds
    { src: "images/assets/intro/uni.gif", duration: 3700 },     // 7 seconds
    { src: "images/assets/intro/men.gif", duration: 4500 },
    { src: "images/assets/intro/eye.gif", duration: 4400 },
    { src: "images/assets/intro/heart.gif", duration: 8500 },
    { src: "images/assets/intro/dance.gif", duration: 4000 },
    { src: "images/assets/intro/flowerss.gif", duration: 5000 },
    { src: "images/assets/intro/aface.gif", duration: 10000 },
];

let currentLineIndex = 0;
let currentAssetIndex = 0;
let introComplete = false;
let assetTimer = null;

// ── Audio ──────────────────────────────────────────────
const introMusic = new Audio('sounds/songs/KAISAN.mp3');
introMusic.loop = true;
introMusic.volume = 1;

const gameMusic = new Audio('sounds/songs/Signal_Flags.mp3');
gameMusic.loop = true;
gameMusic.volume = 0;

/**
 * Crossfade from introMusic → gameMusic over `duration` ms.
 */
function crossfadeToGame(duration = 1500) {
    gameMusic.currentTime = 0;
    gameMusic.play().catch(() => { });

    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const fade = setInterval(() => {
        step++;
        const progress = step / steps;
        introMusic.volume = Math.max(0, 1 - progress);
        gameMusic.volume = Math.min(1, progress);

        if (step >= steps) {
            clearInterval(fade);
            introMusic.pause();
            introMusic.currentTime = 0;
        }
    }, interval);
}

// Get DOM elements
const introScreen = document.getElementById("intro-screen");
const introText = document.getElementById("intro-text");
const introAsset = document.getElementById("intro-asset");
const introQuestion = document.getElementById("intro-question");
const introButtons = document.getElementById("intro-buttons");

// Start with first asset
function startAssetSequence() {
    if (introAssets.length > 0) {
        showAsset(0);
    }
}

function showAsset(index) {
    if (index >= introAssets.length) {
        // All assets shown, loop back to first
        currentAssetIndex = 0;
        showAsset(0);
        return;
    }

    const asset = introAssets[index];
    introAsset.src = asset.src;
    introAsset.style.display = "block";
    currentAssetIndex = index;

    // Schedule next asset
    if (assetTimer) clearTimeout(assetTimer);
    assetTimer = setTimeout(() => {
        showAsset(index + 1);
    }, asset.duration);
}

function showQuestion() {
    // Stop asset cycling
    if (assetTimer) clearTimeout(assetTimer);

    // Hide text, show question and buttons
    introText.style.opacity = "0";

    setTimeout(() => {
        introText.style.display = "none";
        introQuestion.style.display = "block";
        introButtons.style.display = "flex";

        setTimeout(() => {
            introQuestion.style.opacity = "1";
            introButtons.style.opacity = "1";
        }, 100);
    }, 800);
}

function startGame() {
    // Stop asset cycling
    if (assetTimer) clearTimeout(assetTimer);

    // Hide the skip button — it's only for the intro
    const skipBtn = document.getElementById("intro-skip-btn");
    if (skipBtn) skipBtn.style.display = "none";

    // ── Crossfade music: intro → game ──
    crossfadeToGame(1500);

    // ── Start forest ambient sound ──
    if (typeof forestSound !== 'undefined') {
        forestSound.currentTime = 0;
        forestSound.play().catch(() => { });
    }

    // Fade out entire intro screen
    introScreen.style.opacity = "0";
    setTimeout(() => {
        introScreen.style.display = "none";
        introComplete = true;

        // Enable the game to start
        gameStarted = true;

        // Initialize the game loop timer
        last = performance.now();

        // Now start the actual game by calling dialogue typeText
        if (typeof typeText === 'function') {
            typeText();
        }
    }, 1000);
}

function showNextLine() {
    if (currentLineIndex >= introLines.length) {
        // All lines shown, now show question
        setTimeout(() => {
            showQuestion();
        }, 500);
        return;
    }

    const line = introLines[currentLineIndex];

    // Fade in text
    introText.style.opacity = "0";
    introText.textContent = line.text;

    setTimeout(() => {
        introText.style.opacity = "1";
    }, 100);

    // Wait for duration, then fade out and show next
    setTimeout(() => {
        introText.style.opacity = "0";
        setTimeout(() => {
            currentLineIndex++;
            showNextLine();
        }, 800); // Fade out duration
    }, line.duration);
}

// Button handlers — scripts at bottom of <body> run after DOM is ready,
// so we can attach listeners directly without waiting for DOMContentLoaded.
const yesBtn = document.getElementById("intro-yes-btn");
const yesRedBtn = document.getElementById("intro-yes-red-btn");
const skipBtn = document.getElementById("intro-skip-btn");

if (yesBtn) yesBtn.addEventListener('click', startGame);
if (yesRedBtn) yesRedBtn.addEventListener('click', startGame);
if (skipBtn) skipBtn.addEventListener('click', startGame);

// Start intro when all assets (images/gifs) are loaded
window.addEventListener('load', () => {
    // Show skip button immediately from the very first frame
    if (skipBtn) skipBtn.style.display = "block";

    // ── Start intro music ──
    introMusic.play().catch(() => {
        // Autoplay blocked — start on first user interaction
        const unlockAudio = () => {
            introMusic.play().catch(() => { });
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };
        document.addEventListener('click', unlockAudio);
        document.addEventListener('keydown', unlockAudio);
    });

    startAssetSequence(); // Start cycling through assets
    showNextLine();        // Start showing text lines
});
