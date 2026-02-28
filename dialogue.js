/* ======================
   DIALOGUE SYSTEM
====================== */

const dialogueContainer = document.getElementById("dialogue-container");
const box = document.getElementById("dialogue-text");
const btn = document.getElementById("startBtn");
const dialogueSkipBtn = document.getElementById("dialogue-skip-btn");
const text = "Welcome to our world! Let's go for a walk shall we? I've missed you...";

let index = 0;
let dialogueTimeout = null;
let hasTypedIntro = false;

function showDialogueBox() {
    dialogueContainer.style.display = "flex";
    setTimeout(() => dialogueContainer.classList.add("dialogue-visible"), 10);
}

function hideDialogueBox() {
    dialogueContainer.classList.remove("dialogue-visible");
    // Wait for transition before hiding
    setTimeout(() => {
        if (!dialogueContainer.classList.contains("dialogue-visible")) {
            dialogueContainer.style.display = "none";
            if (dialogueSkipBtn) dialogueSkipBtn.style.display = "none";
        }
    }, 500);
}

function typeText() {
    if (hasTypedIntro) return;
    if (index === 0) {
        showDialogueBox();
        box.innerHTML = "";
        if (dialogueSkipBtn) dialogueSkipBtn.style.display = "block";
    }

    if (index < text.length) {
        box.innerHTML += text[index++];
        setTimeout(typeText, 35);
    } else {
        btn.style.display = "inline-block";
        if (dialogueSkipBtn) dialogueSkipBtn.style.display = "none";
        hasTypedIntro = true;
        // Let the intro dialogue stay until they click the button
    }
}

function showMessage(msg, duration = 4000) {
    if (dialogueTimeout) clearTimeout(dialogueTimeout);

    showDialogueBox();
    box.innerHTML = msg;
    if (dialogueSkipBtn) dialogueSkipBtn.style.display = "block";

    dialogueTimeout = setTimeout(() => {
        hideDialogueBox();
    }, duration);
}

if (dialogueSkipBtn) {
    dialogueSkipBtn.onclick = () => {
        hideDialogueBox();
        if (dialogueTimeout) clearTimeout(dialogueTimeout);
    };
}

// Button click handler
btn.onclick = () => {
    moving = true;
    btn.style.display = "none";
    btn.remove(); // Remove button from DOM permanently

    // Hide dialogue
    hideDialogueBox();

    scene = 2;
    girlTimer = 0; // Reset timer for fresh animation start

    // Start Waving
    isWaving = true;
    waveStartTime = Date.now();

    document.getElementById("controls").style.display = "flex";
};
