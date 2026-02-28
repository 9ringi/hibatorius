/* ======================
   BIOS / EGO WINDOW MODULE
====================== */

function openBiosWindow() {
    // Prevent multiple windows
    if (document.getElementById("bios-window")) return;

    const viewport = document.getElementById("game-viewport");

    // Create the window container
    const win = document.createElement("div");
    win.id = "bios-window";
    win.className = "retro-window";
    win.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 650px;
        background: #c0c0c0;
        border: 3px solid;
        border-color: #ffffff #808080 #808080 #ffffff;
        box-shadow: 4px 4px 15px rgba(0,0,0,0.5);
        z-index: 20000;
        display: flex;
        flex-direction: column;
        color: #000;
        font-family: 'Press Start 2P', monospace;
        pointer-events: auto;
    `;

    // Title Bar
    win.innerHTML = `
        <div class="win-title-bar" style="background: #000080; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: white; font-size: 10px;">[System Properties: EGO.SYS]</span>
            <button class="win-close-btn" onclick="this.closest('#bios-window').remove()" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: none;">X</button>
        </div>
        
        <div class="win-body" style="padding: 20px; font-size: 10px; line-height: 1.6;">
            
            <!-- 1. Identity & Network Status -->
            <div class="ident-section" style="border: 2px inset #fff; padding: 10px; margin-bottom: 20px; background: #d0d0d0;">
                <div style="font-weight: bold; margin-bottom: 5px; color: #000080;">1. Identity & Network Status</div>
                <div id="user-id-line" style="cursor: help; position: relative;">
                    Primary User: <span id="user-id-text">SELF</span>
                    <div id="secret-portrait" style="display: none; position: absolute; left: 180px; top: -10px; border: 2px solid #000; background: #000; z-index: 100;">
                         <img src="images/background/girl/portrait.png" style="width: 64px; height: 64px; image-rendering: pixelated;">
                    </div>
                </div>
                <div>Status: <span style="color: #008800;">ONLINE / STABLE (SHARED_MODE)</span></div>
                <div>Uptime: 8,153 Days since the first question</div>
                <div style="font-size: 8px; margin-top: 5px; color: #444;">Secondary Users: HUSBAND_LOCAL, DAUGHTER_REMOTE_MONITOR</div>
            </div>

            <!-- 2. Memory & Resource Allocation -->
            <div class="mem-section" style="margin-bottom: 20px;">
                <div style="font-weight: bold; margin-bottom: 10px; color: #000080;">2. Memory & Resource Allocation</div>
                <div class="progress-item" style="margin-bottom: 8px;">
                    <div>Core Logic: [||||||----] 60% <span style="font-size: 8px; color: #666;">(Distracted by love)</span></div>
                </div>
                <div class="progress-item" style="margin-bottom: 8px;">
                    <div>Empathy_Protocol: <span style="color: #008800;">[||||||||||] 99%</span></div>
                </div>
                <div class="progress-item" style="margin-bottom: 8px;">
                    <div>Shared_Storage: [||||||||--] 82%</div>
                </div>
                <div class="progress-item">
                    <div>Background Noise: [|||-------] 30%</div>
                </div>
            </div>

            <!-- 3. Attributes Checklist -->
            <div class="attr-section" style="border: 2px inset #fff; padding: 10px; background: #d0d0d0; margin-bottom: 20px;">
                <div style="font-weight: bold; margin-bottom: 10px; color: #000080;">3. Attributes Checklist</div>
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="width: 14px; height: 14px; border: 2px inset #777; background: #fff; position: relative; margin-right: 10px;">
                        <span style="position: absolute; left: 0px; top: -2px; color: #000;">X</span>
                    </div>
                    <span>Connection.established</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="width: 14px; height: 14px; border: 2px inset #777; background: #fff; position: relative; margin-right: 10px;">
                        <span style="position: absolute; left: 0px; top: -2px; color: #000;">X</span>
                    </div>
                    <span>Protection_Mode.active</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="width: 14px; height: 14px; border: 2px inset #777; background: #fff; position: relative; margin-right: 10px;">
                        <span style="position: absolute; left: 0px; top: -2px; color: #000;">X</span>
                    </div>
                    <span>Shared_Future.cfg</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="width: 14px; height: 14px; border: 2px inset #777; background: #fff; margin-right: 10px;"></div>
                    <span style="color: #666;">Loneliness.temp (Deleted)</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 14px; height: 14px; border: 2px inset #777; background: #c0c0c0; position: relative; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 8px;">L</span>
                    </div>
                    <span style="color: #666;">Old_Heartache.bak (Archived)</span>
                </div>
            </div>

            <!-- 4. System Action Buttons -->
            <div class="btn-footer" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 5px;">
                <button style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 8px; padding: 8px; color: #000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;" onclick="alert('Synchronizing with HUSBAND_LOCAL...')">SYNC DATA</button>
                <button style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 8px; padding: 8px; color: #000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;" onclick="alert('Creating Backup: memories_of_daughter.bak')">BACKUP</button>
                <button style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 8px; padding: 8px; color: #000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;" onclick="this.closest('#bios-window').remove()">CLOSE</button>
            </div>
        </div>
    `;

    viewport.appendChild(win);

    // Setup Hover Secret Logic
    const idLine = win.querySelector("#user-id-line");
    const idText = win.querySelector("#user-id-text");
    const portrait = win.querySelector("#secret-portrait");

    idLine.onmouseover = () => {
        idText.innerText = "HIBA";
        idText.style.color = "#000080";
        portrait.style.display = "block";
    };
    idLine.onmouseout = () => {
        idText.innerText = "SELF";
        idText.style.color = "#000";
        portrait.style.display = "none";
    };

    // Add necessary styles if not exists
    if (!document.getElementById("win-styles")) {
        const style = document.createElement("style");
        style.id = "win-styles";
        style.innerHTML = `
            .retro-window * { box-sizing: border-box; }
            .win-close-btn:active { border-color: #555 #fff #fff #555 !important; }
        `;
        document.head.appendChild(style);
    }
}
