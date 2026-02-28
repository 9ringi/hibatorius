/* ======================
   SCENE 3 LOGIC
====================== */

// Oblivion music — played when Scene 3 starts, fades in gradually
const oblivionMusic = new Audio('sounds/songs/snow.mp3');
oblivionMusic.loop = true;
oblivionMusic.volume = 0;

/**
 * Fade `audioObj` from its current volume to `targetVol` over `duration` ms.
 */
function fadeAudio(audioObj, targetVol, duration, onDone) {
    const steps = 60;
    const interval = duration / steps;
    const startVol = audioObj.volume;
    const diff = targetVol - startVol;
    let step = 0;
    const timer = setInterval(() => {
        step++;
        audioObj.volume = Math.min(1, Math.max(0, startVol + diff * (step / steps)));
        if (step >= steps) {
            clearInterval(timer);
            audioObj.volume = targetVol;
            if (typeof onDone === 'function') onDone();
        }
    }, interval);
}

let scene3Assets = {
    bg: new Image(),
    girl: new Image(),
    fgFrames: [] // Animating frames 16 to 29
};

scene3Assets.bg.src = 'images/background/lkawn/back/back.png';
scene3Assets.girl.src = 'images/background/girl/scene3/10.png';

// Pre-load foreground frames 16-29
for (let i = 16; i <= 29; i++) {
    let img = new Image();
    img.src = `images/background/lkawn/${i}.png`;
    scene3Assets.fgFrames.push(img);
}

let scene3Alpha = 0;
let scene3Started = false;
let fgFrameIndex = 0;
let fgTimer = 0;
const FG_FRAME_DURATION = 150; // Delay between frames in ms
let dialogueActive = false;
let dialogueFinished = false;
let currentDialogueIndex = 0;
let scene3StartTime = 0; // To track floating animation
let scene4Triggered = false;

const scene3Dialogues = [
    {
        name: "KARAKIZ ALKAWN",
        text: "GREETINGS, HIBA. YOUR HEART HAS EMITTED A FREQUENCY SO PURE... WE COULD NOT IGNORE IT.",
        portrait: "images/background/lkawn/kawn.png"
    },
    {
        name: "HIBA",
        text: "Oh! I'm just being myself... but I'm curious. What is this place?",
        portrait: "images/background/girl/portrait.png"
    },
    {
        name: "KARAKIZ ALKAWN",
        text: "WE KNOW YOU SEEK ANSWERS. YOU ASK REDA ABOUT THE FUTURE, BUT HE IS BOUND BY THE PRESENT...",
        portrait: "images/background/lkawn/kawn.png"
    },
    {
        name: "KARAKIZ ALKAWN",
        text: "HE CANNOT SHOW YOU WHAT IS YET TO BE WRITTEN. BUT WE CAN.",
        portrait: "images/background/lkawn/kawn.png"
    }
];

function nextScene3Dialogue() {
    if (currentDialogueIndex >= scene3Dialogues.length) {
        dialogueActive = false;
        dialogueFinished = true;
        if (typeof hideDialogueBox === 'function') hideDialogueBox();
        return;
    }

    const d = scene3Dialogues[currentDialogueIndex];
    const nameEl = document.getElementById("dialogue-name");
    const textEl = document.getElementById("dialogue-text");
    const portEl = document.querySelector("#dialogue-portrait img");
    const container = document.getElementById("dialogue-container");

    if (nameEl) nameEl.innerText = d.name;
    if (textEl) textEl.innerText = d.text;
    if (portEl) portEl.src = d.portrait;

    if (container) {
        container.style.display = "flex";
        setTimeout(() => container.classList.add("dialogue-visible"), 10);

        // Add "Next" indicator icon if it doesn't exist
        let nextIcon = document.getElementById("dialogue-next-icon");
        if (!nextIcon) {
            nextIcon = document.createElement("div");
            nextIcon.id = "dialogue-next-icon";
            nextIcon.innerHTML = "▶";
            nextIcon.style.position = "absolute";
            nextIcon.style.bottom = "10px";
            nextIcon.style.right = "20px";
            nextIcon.style.fontSize = "12px";
            nextIcon.style.color = "white";
            nextIcon.style.animation = "pulse 1s infinite alternate";
            // Add style for pulse if not in css
            if (!document.getElementById("style-pulse-simple")) {
                let s = document.createElement("style");
                s.id = "style-pulse-simple";
                s.innerHTML = "@keyframes pulse { from { opacity: 0.3; transform: translateX(0); } to { opacity: 1; transform: translateX(5px); } }";
                document.head.appendChild(s);
            }
            container.querySelector("#dialogue-box").appendChild(nextIcon);
        }
    }

    currentDialogueIndex++;
}

// Global click listener for Scene 3 dialogues
window.addEventListener('click', () => {
    if (scene === 3 && dialogueActive) {
        nextScene3Dialogue();
    }
});
window.addEventListener('keydown', (e) => {
    if (scene === 3 && dialogueActive && (e.key === 'Enter' || e.key === ' ')) {
        nextScene3Dialogue();
    }
});

function startScene3() {
    console.log("Starting Scene 3 transition...");

    // Stop walking sound immediately (player can't walk during transition)
    if (typeof walkSound !== 'undefined') {
        walkSound.pause();
        walkSound.currentTime = 0;
    }

    const overlay = document.getElementById('scene-transition-overlay');
    if (!overlay) return;

    // 1. Fade the game music (Signal_Flags) out over 3 seconds while screen goes black
    if (typeof gameMusic !== 'undefined') {
        fadeAudio(gameMusic, 0, 3000, () => {
            gameMusic.pause();
            gameMusic.currentTime = 0;
        });
    }
    // Also fade forest ambient out
    if (typeof forestSound !== 'undefined') {
        fadeAudio(forestSound, 0, 3000, () => {
            forestSound.pause();
            forestSound.currentTime = 0;
        });
    }

    // 2. Fade screen to black (transition is 4s via CSS, we trigger it now)
    overlay.style.opacity = '1';

    // 3. Fade in takes 4s (CSS transition), then hold fully black for 5s = 9s total
    setTimeout(() => {
        // Change scene state
        scene = 3;
        scene3Started = true;

        // Reset animation state
        fgFrameIndex = 0;
        fgTimer = 0;

        // Hide elements from previous scene
        if (typeof dog !== 'undefined') dog.style.display = 'none';
        if (typeof deer !== 'undefined') deer.style.display = 'none';
        if (typeof rabbit !== 'undefined') rabbit.style.display = 'none';
        if (typeof butterflies !== 'undefined') butterflies.style.display = 'none';
        if (typeof birdOnTree !== 'undefined') birdOnTree.style.display = 'none';
        if (typeof machine !== 'undefined') machine.style.display = 'none';
        if (typeof bird !== 'undefined') bird.style.display = 'none';

        const controls = document.getElementById('controls');
        if (controls) controls.style.display = 'none';

        if (typeof leafData !== 'undefined') {
            leafData.forEach(l => l.el.style.display = 'none');
        }

        // Bring foreground canvas to front for this scene
        const canvasFg = document.getElementById('game-fg');
        const canvasGirl = document.getElementById('game-girl');
        if (canvasFg && canvasGirl) {
            canvasFg.style.zIndex = "10";
            canvasGirl.style.zIndex = "5";
        }

        // 4. Start Oblivion music immediately, fading in over 4 seconds
        oblivionMusic.currentTime = 0;
        oblivionMusic.volume = 0;
        oblivionMusic.play().catch(() => { });
        fadeAudio(oblivionMusic, 1, 4000);

        // 5. Fade out the black overlay to reveal Scene 3
        overlay.style.opacity = '0';

        scene3StartTime = Date.now();

        setTimeout(() => {
            dialogueActive = true;
            nextScene3Dialogue();
        }, 1000);

        console.log("Scene 3 started.");
    }, 9000);
}

function drawScene3(delta) {
    if (!scene3Started) return;

    const now = Date.now();
    const elapsed = now - scene3StartTime;

    // Slowly increase alpha for the fade-in effect
    if (scene3Alpha < 1) {
        scene3Alpha += delta / 5000; // 5 seconds to full visibility
        if (scene3Alpha > 1) scene3Alpha = 1;
    }

    const alpha = scene3Alpha;

    // Draw Background
    if (scene3Assets.bg.complete) {
        ctxBg.globalAlpha = alpha;
        ctxBg.drawImage(scene3Assets.bg, 0, 0, V_WIDTH, V_HEIGHT);
        ctxBg.globalAlpha = 1.0;
    }

    // Draw Girl (scene3/10.png, 11.png, 12.png) with Floating Animation
    let girlImg = scene3Assets.girl; // Default 10.png
    let verticalOffset = 0;

    // Ensure 11/12 are loaded
    if (!scene3Assets.girl11) {
        scene3Assets.girl11 = new Image();
        scene3Assets.girl11.src = 'images/background/girl/scene3/11.png';
    }
    if (!scene3Assets.girl12) {
        scene3Assets.girl12 = new Image();
        scene3Assets.girl12.src = 'images/background/girl/scene3/12.png';
    }

    if (elapsed > 5000 && elapsed < 11000) {
        // Phase 1: Ascend slowly (5s to 11s = 6 seconds)
        let floatProgress = (elapsed - 5000) / 6000;
        verticalOffset = floatProgress * 150;

        // Transition frames
        if (floatProgress < 0.4) girlImg = scene3Assets.girl;
        else if (floatProgress < 0.8) girlImg = scene3Assets.girl11;
        else girlImg = scene3Assets.girl12;

    } else if (elapsed >= 11000 && elapsed < 18000) {
        // Phase 2: Stay in sky (11s to 18s = 7 seconds)
        verticalOffset = 150;
        // Fastly alternate between 11.png and 12.png (every 100ms)
        girlImg = (Math.floor(now / 100) % 2 === 0) ? scene3Assets.girl11 : scene3Assets.girl12;

    } else if (elapsed >= 18000 && elapsed < 22000) {
        // Phase 3: Descend (18s to 22s = 4 seconds)
        let descendProgress = (elapsed - 18000) / 4000;
        verticalOffset = 150 * (1 - descendProgress);
        girlImg = scene3Assets.girl; // Back to 10.png
    }

    if (girlImg && girlImg.complete) {
        ctxGirl.globalAlpha = alpha;
        let scale = 0.2;
        let w = girlImg.width * scale;
        let h = girlImg.height * scale;
        // Float position: baseline is V_HEIGHT/2. Subtract verticalOffset to move UP.
        ctxGirl.drawImage(girlImg, V_WIDTH / 2 - w / 2, (V_HEIGHT / 2 - h / 2) - verticalOffset, w, h);
        ctxGirl.globalAlpha = 1.0;
    }

    // Draw Animating Foreground (lkawn/16.png to 29.png)
    // Only start animating once dialogue is finished AND she has finished her descent
    if (dialogueFinished && elapsed >= 22000) {
        fgTimer += delta;
        if (fgTimer >= FG_FRAME_DURATION) {
            fgTimer = 0;
            if (fgFrameIndex < scene3Assets.fgFrames.length - 1) {
                fgFrameIndex++;
            }
        }
    } else {
        // Keep at 16.png while dialogue is showing
        fgFrameIndex = 0;
    }

    // Trigger Scene 4 after animation finishes and holds for 3 seconds
    if (dialogueFinished && fgFrameIndex === (scene3Assets.fgFrames.length - 1) && !scene4Triggered) {
        // Track the exact time the animation finished
        if (!this.fgEndTime) this.fgEndTime = now;

        if (now - this.fgEndTime > 3000) {
            scene4Triggered = true;
            if (typeof startScene4 === 'function') {
                startScene4();
            }
        }
    }

    let currentFgImg = scene3Assets.fgFrames[fgFrameIndex];
    if (currentFgImg && currentFgImg.complete) {
        ctxFg.globalAlpha = alpha;
        let scale = 0.4;
        let w = currentFgImg.width * scale;
        let h = currentFgImg.height * scale;
        // Positioned 140px to the right of center as requested
        ctxFg.drawImage(currentFgImg, V_WIDTH / 2 - w / 2 + 140, V_HEIGHT / 2 - h - 50, w, h);
        ctxFg.globalAlpha = 1.0;
    }
}
