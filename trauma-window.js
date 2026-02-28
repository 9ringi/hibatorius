/* ======================
   TRAUMA / SECURITY ALERT WINDOW MODULE
====================== */

function openTraumaWindow() {
    // Prevent multiple windows
    if (document.getElementById("trauma-window")) return;

    const viewport = document.getElementById("game-viewport");

    // Create the window container
    const win = document.createElement("div");
    win.id = "trauma-window";
    win.className = "retro-window alert-flicker";
    win.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 550px;
        background: #c0c0c0;
        border: 4px solid #aa0000;
        box-shadow: 0 0 30px rgba(170, 0, 0, 0.4);
        z-index: 20005;
        display: flex;
        flex-direction: column;
        color: #000;
        font-family: 'Press Start 2P', monospace;
        pointer-events: auto;
    `;

    // Title Bar
    win.innerHTML = `
        <div class="win-title-bar" style="background: #aa0000; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: white; font-size: 10px;">[ SECURITY ALERT ]</span>
            <button class="win-close-btn" onclick="this.closest('#trauma-window').remove()" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;">X</button>
        </div>
        
        <div class="win-body" style="padding: 25px; font-size: 10px; line-height: 1.8; text-align: center;">
            
            <div style="margin-bottom: 20px;">
                <img src="images/background/lkawn/kawn.png" style="width: 48px; height: 48px; image-rendering: pixelated; margin-bottom: 10px; filter: grayscale(1) brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5);">
                <div style="color: #aa0000; font-weight: bold; margin-bottom: 15px;">ACCESS DENIED</div>
                <div style="font-size: 9px; color: #333;">
                    This directory has been quarantined by <span style="text-decoration: underline;">HEALING_PROCESS.EXE</span>.
                </div>
            </div>

            <div style="background: #000; color: #aa0000; padding: 15px; font-size: 8px; border: 2px inset #fff; margin-bottom: 25px; line-height: 1.4;">
                WARNING: Accessing these sectors may cause System Instability (Heart_Rate > 140bpm).
            </div>

            <div style="margin-bottom: 25px; text-align: left;">
                <label style="font-size: 8px; display: block; margin-bottom: 10px;">Enter Decryption Key:</label>
                <div style="display: flex; align-items: center; background: #fff; border: 2px inset #777; padding: 8px;">
                    <span style="font-size: 10px; color: #888;">> </span>
                    <input type="password" id="trauma-key" style="border: none; outline: none; background: transparent; font-family: 'Press Start 2P', monospace; font-size: 10px; width: 100%; color: #000;" placeholder="________________">
                </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 20px;">
                <button class="win-btn" onclick="this.closest('#trauma-window').remove()" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 9px; padding: 12px 20px; color: #000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;">FORGET</button>
                <button class="win-btn" id="face-it-btn" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 9px; padding: 12px 20px; color: #aa0000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;">FACE IT</button>
            </div>
        </div>
    `;

    viewport.appendChild(win);

    const faceBtn = win.querySelector("#face-it-btn");
    faceBtn.onclick = () => {
        // Trigger a shake effect on the whole viewport to simulate instability
        const vp = document.getElementById("game-viewport");
        vp.classList.add("shaking-intense");

        // Change text to show error
        faceBtn.innerText = "ERROR...";
        faceBtn.disabled = true;

        setTimeout(() => {
            alert("INTEGRITY_CHECK FAILED: Emotional Load exceeds safety threshold.");
            vp.classList.remove("shaking-intense");
            win.remove();
        }, 1500);
    };

    // Add specific styles for the trauma alert
    if (!document.getElementById("trauma-styles")) {
        const style = document.createElement("style");
        style.id = "trauma-styles";
        style.innerHTML = `
            @keyframes alertBlink { 0% { box-shadow: 0 0 10px rgba(170, 0, 0, 0.4); } 50% { box-shadow: 0 0 30px rgba(170, 0, 0, 0.8); } 100% { box-shadow: 0 0 10px rgba(170, 0, 0, 0.4); } }
            .alert-flicker { animation: alertBlink 1s infinite !important; }
            .shaking-intense { animation: shake 0.1s infinite !important; }
            .win-btn:active { border-color: #555 #fff #fff #555 !important; }
        `;
        document.head.appendChild(style);
    }
}
