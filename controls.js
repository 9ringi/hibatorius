/* ======================
   CONTROLS LOGIC
====================== */

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

function handleInput(direction, pressed) {
    if (scene !== 2) return; // Only handle input in scene 2
    inputState[direction] = pressed;

    const wasWalking = isWalking;
    isWalking = inputState.left || inputState.right;

    const now = Date.now();

    if (isWalking && !wasWalking) {
        // Started walking
        log("Walking STARTED");
        walkStartTime = now;
        isTired = false; // Reset tired state when starting to walk
        // Play walking sound
        if (typeof walkSound !== 'undefined') {
            walkSound.currentTime = 0;
            walkSound.play().catch(() => { });
        }
    } else if (!isWalking && wasWalking) {
        // Stopped walking
        log("Walking STOPPED");
        lastWalkDuration = now - walkStartTime;
        // Stop walking sound
        if (typeof walkSound !== 'undefined') {
            walkSound.pause();
            walkSound.currentTime = 0;
        }
        if (lastWalkDuration > 7000) {
            isTired = true;
            tiredStartTime = Date.now();
            log("State: TIRED");
        }
    }
}

// Left button events
leftBtn.addEventListener("mousedown", () => handleInput("left", true));
leftBtn.addEventListener("mouseup", () => handleInput("left", false));
leftBtn.addEventListener("mouseleave", () => handleInput("left", false));
leftBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("left", true); });
leftBtn.addEventListener("touchend", (e) => { e.preventDefault(); handleInput("left", false); });

// Right button events
rightBtn.addEventListener("mousedown", () => handleInput("right", true));
rightBtn.addEventListener("mouseup", () => handleInput("right", false));
rightBtn.addEventListener("mouseleave", () => handleInput("right", false));
rightBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("right", true); });
rightBtn.addEventListener("touchend", (e) => { e.preventDefault(); handleInput("right", false); });

// Keyboard Listeners
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") handleInput("left", true);
    if (e.key === "ArrowRight") handleInput("right", true);

    if (e.key === "Enter") {
        // Find visible buttons that the user might want to click
        const introButtons = document.getElementById("intro-buttons");
        const startBtn = document.getElementById("startBtn");
        const introYesBtn = document.getElementById("intro-yes-btn");

        if (introButtons && introButtons.style.display !== "none" && introButtons.style.opacity !== "0") {
            if (introYesBtn) introYesBtn.click();
        } else if (startBtn && startBtn.style.display !== "none") {
            startBtn.click();
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") handleInput("left", false);
    if (e.key === "ArrowRight") handleInput("right", false);
});
