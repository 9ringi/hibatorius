const V_WIDTH = 1920;
const V_HEIGHT = 1080;

/* ======================
   SCENE 1 SOUNDS
====================== */

// Ambient forest loop — started by intro.js when the game begins
const forestSound = new Audio('sounds/effects/secne1/forest.mp3');
forestSound.loop = true;
forestSound.volume = 0.7;

// Walking footsteps — toggled by controls.js
const walkSound = new Audio('sounds/effects/secne1/walking.mp3');
walkSound.loop = true;
walkSound.volume = 1;

// Machine shake effect
const machineSound = new Audio('sounds/effects/secne1/machine.mp3');
machineSound.volume = 1;

// Disappear / teleport effect
const disappSound = new Audio('sounds/effects/secne1/disap.mp3');
disappSound.volume = 1;

const viewport = document.getElementById("game-viewport");

const canvasBg = document.getElementById("game-bg");
const ctxBg = canvasBg.getContext("2d");
canvasBg.width = V_WIDTH;
canvasBg.height = V_HEIGHT;
ctxBg.imageSmoothingEnabled = false;

const canvasFg = document.getElementById("game-fg");
const ctxFg = canvasFg.getContext("2d");
canvasFg.width = V_WIDTH;
canvasFg.height = V_HEIGHT;
ctxFg.imageSmoothingEnabled = false;

const canvasGirl = document.getElementById("game-girl");
const ctxGirl = canvasGirl.getContext("2d");
canvasGirl.width = V_WIDTH;
canvasGirl.height = V_HEIGHT;
ctxGirl.imageSmoothingEnabled = false;

const V_MARGIN = 60; // Extra room around the cadre

function resize() {
    const scale = Math.min((window.innerWidth - V_MARGIN) / V_WIDTH, (window.innerHeight - V_MARGIN) / V_HEIGHT);
    viewport.style.transform = `scale(${scale})`;
}
window.addEventListener("resize", resize);
resize();

/* ======================
   HELPER: LOAD FRAMES
====================== */

function log(msg) {
    const d = document.getElementById("debug-log");
    if (d) d.innerHTML += msg + "<br>";
}

function loadFrames(path, count, startIdx = 1) {
    let arr = [];
    for (let i = startIdx; i < startIdx + count; i++) {
        let img = new Image();
        let src = `${path}/${i}.png`;
        img.src = src;
        img.onload = () => log(`LOADED: ${src}`);
        img.onerror = () => log(`ERROR: Failed to load ${src}`);
        arr.push(img);
    }
    return arr;
}

/* ======================
   LOAD ASSETS
====================== */

const farFrames = [
    ...loadFrames("images/background/far", 1, 0),
    ...loadFrames("images/background/far", 1, 1),
    ...loadFrames("images/background/far", 1, 2),
    ...loadFrames("images/background/far", 2, 3)
];
const closeFrames = [
    ...loadFrames("images/background/close", 1, 0),
    ...loadFrames("images/background/close", 1, 1),
    ...loadFrames("images/background/close", 1, 2),
    ...loadFrames("images/background/close", 2, 3)
];
const girlFrames = loadFrames("images/background/girl/scene1", 5);
const girlScene2Frames = loadFrames("images/background/girl/scene2", 5);

/* ======================
   STATE
===================== */

let farX = 0, closeX = 0;
let farFrame = 0, closeFrame = 0, girlFrame = 0;

let farTimer = 0, closeTimer = 0, girlTimer = 0;
let moving = false;
let scene = 1; // 1: Intro/Auto-walk, 2: User Control
let inputState = { left: false, right: false };
let walkStartTime = 0;
let isWalking = false;
let isTired = false;
let tiredStartTime = 0;
let isWaving = false;
let waveStartTime = 0;
let lastWalkDuration = 0;
let gameStarted = false; // Flag to prevent game from starting before intro completes
let isClicking = false;  // New interaction state
let clickStartTime = 0;
let girlHidden = false;  // New state to hide the girl

/* ======================
   DRAW BACKGROUND
====================== */

let isWrongWay = false;
let isAtMachine = false;

// Create Dog
const dog = document.createElement("img");
dog.src = "images/assets/dog.gif";
dog.style.position = "absolute";
dog.style.display = "none";
dog.style.zIndex = "5"; // In front of girl
dog.style.width = "180px";
viewport.appendChild(dog);

// Create Deer
const deer = document.createElement("img");
deer.src = "images/assets/deer.gif";
deer.style.position = "absolute";
deer.style.display = "none";
deer.style.zIndex = "5"; // In front of girl
deer.style.width = "250px";
viewport.appendChild(deer);

// Create Rabbit (Bunny)
const rabbit = document.createElement("img");
rabbit.src = "images/assets/rabbit.gif";
rabbit.style.position = "absolute";
rabbit.style.display = "none";
rabbit.style.zIndex = "3"; // Behind girl
rabbit.style.width = "100px";
viewport.appendChild(rabbit);

// Create Butterflies
const butterflies = document.createElement("img");
butterflies.src = "images/assets/butterflies.gif";
butterflies.style.position = "absolute";
butterflies.style.display = "none";
butterflies.style.zIndex = "5"; // Front-most
butterflies.style.width = "200px";
viewport.appendChild(butterflies);

// Create Bird on Tree
const birdOnTree = document.createElement("img");
birdOnTree.src = "images/assets/bird on tree.gif";
birdOnTree.style.position = "absolute";
birdOnTree.style.display = "none";
birdOnTree.style.zIndex = "3"; // Behind girl
birdOnTree.style.width = "90px"; // Smaller
viewport.appendChild(birdOnTree);

// Create Machine
const machine = document.createElement("img");
machine.src = "images/assets/machine.png";
machine.style.position = "absolute";
machine.style.display = "none";
machine.style.zIndex = "3"; // Behind girl
machine.style.width = "600px";// Bigger
viewport.appendChild(machine);

// Create Effect GIF
const effectGif = document.createElement("img");
effectGif.src = "images/assets/effect.gif";
effectGif.id = "effect-gif";
viewport.appendChild(effectGif);

// Create Falling Leaves
const leafData = [];
const leafTypes = ["leaves.gif", "leave2.gif", "leave3.gif"];
const LEAF_COUNT = 12; // More leaves for variety
for (let i = 0; i < LEAF_COUNT; i++) {
    const img = document.createElement("img");
    img.src = `images/assets/${leafTypes[i % leafTypes.length]}`;
    img.style.position = "absolute";
    img.style.width = (40 + Math.random() * 80) + "px"; // Variable size
    img.style.pointerEvents = "none";
    img.style.zIndex = "5"; // Front-most
    img.style.display = "none";
    viewport.appendChild(img);

    leafData.push({
        el: img,
        // Distribute across Frame 1 and 2 (the forest frames)
        worldX: V_WIDTH * (0.8 + Math.random() * 2.5),
        worldY: Math.random() * V_HEIGHT,
        speedY: 1 + Math.random() * 2,
        driftX: (Math.random() - 0.5) * 0.5
    });
}

function updateDecorations(delta) {
    if (!gameStarted) return;
    let frameWidth = canvasBg.width;
    let worldOffset = closeXObj.val;

    // Update Dog (Frame 1 - worldX around 1.3 * frameWidth)
    let dogWorldX = frameWidth * 1.3;
    let dogScreenX = dogWorldX + worldOffset;
    dog.style.left = dogScreenX + "px";
    dog.style.bottom = "80px";
    dog.style.display = (dogScreenX + 200 > 0 && dogScreenX < canvasBg.width) ? "block" : "none";

    // Update Deer (Frame 2 - worldX around 2.2 * frameWidth)
    let deerWorldX = frameWidth * 2.5;
    let deerScreenX = deerWorldX + worldOffset;
    deer.style.left = deerScreenX + "px";
    deer.style.bottom = "100px";
    deer.style.display = (deerScreenX + 300 > 0 && deerScreenX < canvasBg.width) ? "block" : "none";

    // Update Rabbit (Frame 2 - first corner)
    let rabbitWorldX = frameWidth * 2.1;
    let rabbitScreenX = rabbitWorldX + worldOffset;
    rabbit.style.left = rabbitScreenX + "px";
    rabbit.style.bottom = "60px";
    rabbit.style.display = (rabbitScreenX + 150 > 0 && rabbitScreenX < canvasBg.width) ? "block" : "none";

    // Update Butterflies (Down a bit)
    let butterflyWorldX = frameWidth * 3.1;
    let butterflyScreenX = butterflyWorldX + worldOffset;
    butterflies.style.left = butterflyScreenX + "px";
    butterflies.style.top = "550px";
    butterflies.style.display = (butterflyScreenX + 250 > 0 && butterflyScreenX < canvasBg.width) ? "block" : "none";

    // Update Bird On Tree (Frame 3 middle)
    let botWorldX = frameWidth * 3.5;
    let botScreenX = botWorldX + worldOffset;
    birdOnTree.style.left = botScreenX + "px";
    birdOnTree.style.top = "420px";
    birdOnTree.style.display = (botScreenX + 200 > 0 && botScreenX < canvasBg.width) ? "block" : "none";

    // Update Machine (Frame 3 middle-ish)
    let machineWorldX = frameWidth * 3.55 - 70;
    let machineScreenX = machineWorldX + worldOffset;
    machine.style.left = machineScreenX + "px";
    machine.style.bottom = "-30px";// Down a bit more
    machine.style.display = (machineScreenX + 550 > 0 && machineScreenX < canvasBg.width) ? "block" : "none";

    // Update Leaves
    leafData.forEach(leaf => {
        // Gravity / Fall
        leaf.worldY += leaf.speedY;
        // Reset if bottom
        if (leaf.worldY > canvasBg.height + 100) {
            leaf.worldY = -150;
            leaf.worldXSeed = leaf.worldXSeed || leaf.worldX;
            leaf.worldX = leaf.worldXSeed + (Math.random() - 0.5) * 100;
        }

        // Screen Position
        let screenX = leaf.worldX + worldOffset;
        let screenY = leaf.worldY;

        leaf.el.style.left = screenX + "px";
        leaf.el.style.top = screenY + "px";

        // Visibility Check
        if (screenX + 150 > 0 && screenX < canvasBg.width) {
            leaf.el.style.display = "block";
        } else {
            leaf.el.style.display = "none";
        }
    });
}

function drawLayer(ctx, frames, x) {
    if (!frames || frames.length === 0) return;

    let frameWidth = ctx.canvas.width;

    // Draw all frames side-by-side
    for (let i = 0; i < frames.length; i++) {
        let img = frames[i];
        if (!img || !img.complete || img.naturalWidth === 0) continue;
        let drawX = x.val + (i * frameWidth);

        // Only draw if visible
        if (drawX + frameWidth > 0 && drawX < ctx.canvas.width) {
            ctx.drawImage(img, drawX, 0, frameWidth, ctx.canvas.height);
        }
    }
}

function updateWorld(delta) {
    if (!gameStarted || scene >= 3) return;

    let frameWidth = canvasBg.width;
    let speedMult = (scene === 2) ? 1.5 : 1.0;

    // Parallax: far background moves slower for depth
    let closeSpeed = 2.0 * speedMult;
    let farSpeed = 1.2 * speedMult;

    if (scene === 1 && moving) {
        // Scene 1 logic: move forward
        farXObj.val -= farSpeed;
        closeXObj.val -= closeSpeed;
    } else if (scene === 2) {
        let limitLeft = 0; // Boundary for "Back/Left" showing index 0 (0.png)

        if (inputState.left) {
            // MOVE BACK (LEFT)
            if (closeXObj.val < limitLeft) {
                farXObj.val += farSpeed;
                closeXObj.val += closeSpeed;

                // Final boundary check for foreground
                if (closeXObj.val > limitLeft - 2) {
                    closeXObj.val = limitLeft;
                }

                if (closeXObj.val === limitLeft) {
                    if (!isWrongWay) {
                        isWrongWay = true;
                        if (typeof showMessage === 'function') {
                            showMessage("Technically the wrong way... but honestly? You make every direction look like the right one. ✨", 6000);
                        }
                    }
                }
            }
        }
        if (inputState.right) {
            // MOVE FRONT (RIGHT) - Stop at Machine (Frame 3 middle)
            let limitRight = -3.0 * frameWidth;
            if (closeXObj.val > limitRight) {
                farXObj.val -= farSpeed;
                closeXObj.val -= closeSpeed;

                if (closeXObj.val < limitRight) {
                    closeXObj.val = limitRight;
                }
            }

            if (closeXObj.val === limitRight && !isAtMachine) {
                isAtMachine = true;
                if (typeof showMessage === 'function') {
                    showMessage("hmm, what's this for, it says a time travel machine, sounds interesting, click Enter to click the button", 10000);
                }
            }
        }

        // Reset flag when moving away from the wrong way boundary
        if (closeXObj.val < limitLeft - 100) {
            isWrongWay = false;
        }

        // Reset flag when moving away from the machine boundary
        let limitRight = -3.0 * frameWidth;
        if (closeXObj.val > limitRight + 100) {
            isAtMachine = false;
        }
    }

    // Infinite walking forward: logic to loop removed.
    // If no background left, it will show black default.

    // Update Earth and Leaves
    updateDecorations(delta);
}

/* ======================
   GIRL ANIMATION SEQUENCE
===================== */

const girlSequence = [
    // Custom Sequence: 1, 2, 1, 2, 1, 3, 4, 5, 4, 5, 4, 5, 4, 4, 5, 4, 5, 4, 5, 4, 5
    // Indices: 0, 1, 0, 1, 0, 2, 3, 4, 3, 4, 3, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4
    {
        mode: 'loop',
        frames: [0, 1, 0, 1, 0, 2, 3, 4, 3, 4, 3, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4],
        cycles: 1,
        speed: 200
    }
];

let seqIndex = 0;       // Current step in the sequence
let seqTimer = 0;       // Timer for current step
let seqFrameIndex = 0;  // Current frame index within a loop step
let seqCycleCount = 0;  // How many times we've looped in current step
let scene1Finished = false;
let scene1FinishTime = 0;
let reminderPlayed = false;

/* ======================
   DRAW GIRL
====================== */

function drawScene2Girl(delta) {
    if (girlHidden) return; // Do not draw if hidden
    let currentImg;

    // Update animation timer
    girlTimer += delta;

    const now = Date.now();

    if (isClicking) {
        // Handle clicking animation (Frame 5)
        if (now - clickStartTime > 500) { // Duration of click
            isClicking = false;
        }
        if (girlScene2Frames.length >= 5) {
            currentImg = girlScene2Frames[4]; // 5.png from scene2
        } else {
            currentImg = girlScene2Frames[0];
        }
    } else if (isWalking) {
        // Stop waving if we start walking
        isWaving = false;

        // Walking Loop: 1, 2, 3
        const walkFrameDuration = 120; // Faster walking speed
        const frameIndex = Math.floor(girlTimer / walkFrameDuration) % 3;
        currentImg = girlScene2Frames[frameIndex];
    } else {
        if (isWaving) {
            // Wave for 3 seconds
            if (now - waveStartTime > 3000) {
                isWaving = false;
                currentImg = girlScene2Frames[0]; // Go to idle
            } else {
                // Waving Animation: Alternate between Scene 1 Frame 4 and 5 (indices 3 and 4)
                const waveSpeed = 400;
                const waveIndex = Math.floor(girlTimer / waveSpeed) % 2;
                if (girlFrames.length >= 5) {
                    currentImg = girlFrames[3 + waveIndex];
                } else {
                    currentImg = girlScene2Frames[0]; // Fallback
                }
            }
        } else if (isTired) {
            // Check timeout (4 seconds)
            if (now - tiredStartTime > 4000) {
                isTired = false;
                currentImg = girlScene2Frames[0]; // Auto-stop breathing, go to idle
            } else {
                // Tired Loop: 1, 4
                const tiredFrameDuration = 800;
                const frameIndex = Math.floor(girlTimer / tiredFrameDuration) % 2;
                const tiredIndices = [0, 3];
                currentImg = girlScene2Frames[tiredIndices[frameIndex]];
            }
        } else {
            // Idle: 1.png
            currentImg = girlScene2Frames[0];
        }
    }

    // Draw
    if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
        let scale = 0.4;
        let w = currentImg.width * scale;
        let h = currentImg.height * scale;

        ctxGirl.save();
        if (inputState.left) {
            ctxGirl.translate(canvasGirl.width / 2 + w / 2, 0);
            ctxGirl.scale(-1, 1);
            ctxGirl.drawImage(currentImg, 0, canvasGirl.height - h - 50, w, h);
        } else {
            ctxGirl.drawImage(currentImg, canvasGirl.width / 2 - w / 2, canvasGirl.height - h - 50, w, h);
        }
        ctxGirl.restore();
    }
}

function drawGirl(delta) {
    if (girlHidden) return; // Do not draw if hidden
    if (scene === 2) {
        drawScene2Girl(delta);
        return;
    }

    if (!girlFrames || girlFrames.length === 0) return;

    seqTimer += delta;
    const step = girlSequence[seqIndex];
    let currentImgIndex = 0;

    if (step.mode === 'timer') {
        currentImgIndex = step.frame;

        if (seqTimer >= step.duration) {
            seqIndex = (seqIndex + 1) % girlSequence.length;
            seqTimer = 0;
            seqFrameIndex = 0;
            seqCycleCount = 0;
        }

    } else if (step.mode === 'loop') {
        const frameList = step.frames;

        if (seqTimer >= step.speed) {
            seqTimer = 0;
            seqFrameIndex++;

            if (seqFrameIndex >= frameList.length) {
                seqCycleCount++;

                if (seqCycleCount >= step.cycles) {
                    if (seqIndex < girlSequence.length - 1) {
                        seqIndex++;
                        seqTimer = 0;
                        seqCycleCount = 0;
                        seqFrameIndex = 0;
                    } else {
                        // Sequence Finished
                        if (!scene1Finished) {
                            scene1Finished = true;
                            scene1FinishTime = Date.now();
                        }
                        seqFrameIndex = frameList.length - 1;
                    }
                } else {
                    seqFrameIndex = 0;
                }
            }
        }
        currentImgIndex = frameList[seqFrameIndex];
    }

    if (scene1Finished && scene === 1 && !reminderPlayed) {
        if (Date.now() - scene1FinishTime > 20000) {
            reminderPlayed = true;
            girlSequence.push({
                mode: 'loop',
                frames: [3, 4, 3, 4, 3, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4],
                cycles: 1,
                speed: 200
            });
            seqIndex++;
            seqTimer = 0;
            seqFrameIndex = 0;
            seqCycleCount = 0;

            const container = document.getElementById("dialogue-container");
            const textBox = document.getElementById("dialogue-text");
            if (container && textBox) {
                container.style.display = "flex";
                setTimeout(() => container.classList.add("dialogue-visible"), 10);
                textBox.innerHTML = "Hey! Are you just gonna stand there looking pretty? 🥺 There are secrets to find!";
                textBox.classList.add("pulse-text");
            }
        }
    }

    let img = girlFrames[currentImgIndex];
    if (img && img.complete && img.naturalWidth > 0) {
        let scale = 0.4;
        let w = img.width * scale;
        let h = img.height * scale;
        ctxGirl.drawImage(img, canvasGirl.width / 2 - w / 2, canvasGirl.height - h - 50, w, h);
    }
}

/* ======================
   BIRD LOGIC
====================== */

const bird = document.createElement("img");
bird.src = "images/assets/bird.gif";
bird.style.position = "absolute";
bird.style.left = "-150px";
bird.style.top = "150px";
bird.style.width = "120px";
bird.style.zIndex = "5";
bird.style.display = "none"; // Ensure hidden until game start
viewport.appendChild(bird);

let birdX = -150;
let birdSpeed = 3;
let birdHasFlown = false;
let birdTimer = 0;

function updateBird(delta) {
    if (scene !== 2) return;

    birdTimer += delta;
    if (birdTimer < 3000) return;

    if (birdHasFlown) return;

    if (bird.style.display === "none") bird.style.display = "block";

    birdX += birdSpeed;
    if (birdX > V_WIDTH) {
        birdHasFlown = true;
        bird.style.display = "none";
    }

    bird.style.left = birdX + "px";
}

/* ======================
   LOOP
====================== */

let last = 0;

const farXObj = { val: -V_WIDTH };
const closeXObj = { val: -V_WIDTH };
const farTimerObj = { t: 0 };
const closeTimerObj = { t: 0 };
const farFrameObj = { i: 0 };
const closeFrameObj = { i: 0 };

function loop(time) {
    if (!gameStarted) {
        requestAnimationFrame(loop);
        return;
    }

    let delta = time - last;
    last = time;

    updateWorld(delta);

    ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
    ctxFg.clearRect(0, 0, canvasFg.width, canvasFg.height);
    ctxGirl.clearRect(0, 0, canvasGirl.width, canvasGirl.height);

    if (scene === 3) {
        if (typeof drawScene3 === 'function') {
            drawScene3(delta);
        }
    } else if (scene === 4) {
        if (typeof drawScene4 === 'function') {
            drawScene4(delta);
        }
    } else {
        drawLayer(ctxBg, farFrames, farXObj);
        drawLayer(ctxFg, closeFrames, closeXObj);
        drawGirl(delta);
    }

    // Event listener for Enter Key (Button Click)
    if (!window.enterKeyInit) {
        window.addEventListener('keydown', (e) => {
            if (gameStarted && scene === 2 && e.key === 'Enter') {
                // Only allow clicking if we are near the machine and not walking
                let frameWidth = canvasBg.width;
                let worldPos = -closeXObj.val; // Positive world x
                let machineWorldX = frameWidth * 3.55 - 70;

                // Allow clicking if close to machine (within 200px)
                if (Math.abs(worldPos - (machineWorldX - frameWidth / 2)) < 500 && !isWalking) {
                    isClicking = true;
                    clickStartTime = Date.now();
                    // Hide the dialogue once they click the button
                    if (typeof hideDialogueBox === 'function') {
                        hideDialogueBox();
                    }

                    // TIMED SEQUENCE:
                    // 1. Wait 4 seconds
                    setTimeout(() => {
                        // 2. Start shaking machine
                        machine.classList.add("shaking");
                        machineSound.currentTime = 0;
                        machineSound.play().catch(() => { });

                        // 3. After 3 more seconds of shaking...
                        setTimeout(() => {
                            // Show effect gif as down as the character is
                            effectGif.style.display = "block";
                            machineSound.pause();
                            machineSound.currentTime = 0;
                            disappSound.currentTime = 0;
                            disappSound.play().catch(() => { });
                            effectGif.style.left = (canvasGirl.width / 2) + "px";
                            effectGif.style.bottom = "-550px"; // Lowered further
                            effectGif.style.top = "auto";

                            // 4. Girl disappears 0.4s before the gif disappears
                            // Gif total duration = 0.8s
                            setTimeout(() => {
                                girlHidden = true;
                                machine.classList.remove("shaking"); // Stop shaking when girl disappears
                            }, 400);

                            // 5. Hide gif after 0.8s total
                            setTimeout(() => {
                                effectGif.style.display = "none";
                                // TRIGGER SCENE 3
                                if (typeof startScene3 === 'function') {
                                    startScene3();
                                }
                            }, 800);

                        }, 3000);
                    }, 4000);
                }
            }
        });
        window.enterKeyInit = true;
    }

    updateBird(delta);

    requestAnimationFrame(loop);
}

loop(0);
