/* ======================
   REGRETS / RECYCLE BIN WINDOW MODULE
====================== */

function openRegretsWindow() {
    // Prevent multiple windows
    if (document.getElementById("regrets-window")) return;

    const viewport = document.getElementById("game-viewport");

    // Create the window container
    const win = document.createElement("div");
    win.id = "regrets-window";
    win.className = "retro-window glitch-border";
    win.style.cssText = `
        position: absolute;
        left: 48%;
        top: 45%;
        transform: translate(-50%, -50%);
        width: 620px;
        background: #b0b0b0;
        border: 3px solid;
        border-color: #ffffff #555 #555 #ffffff;
        box-shadow: 6px 6px 20px rgba(0,0,0,0.6);
        z-index: 20001;
        display: flex;
        flex-direction: column;
        color: #000;
        font-family: 'Press Start 2P', monospace;
        pointer-events: auto;
    `;

    // Title Bar
    win.innerHTML = `
        <div class="win-title-bar" style="background: #444; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #aaa; font-size: 10px;">[Directory: C:\\RECYCLE_BIN\\REGRETS]</span>
            <button class="win-close-btn" onclick="this.closest('#regrets-window').remove()" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: none;">X</button>
        </div>
        
        <div class="win-body" style="padding: 15px; font-size: 8px; line-height: 1.4;">
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #555; border-bottom: 1px solid #888; padding-bottom: 5px;">
                <span>6 items found</span>
                <span>[Scanning for hope...]</span>
            </div>

            <div id="regrets-file-list" style="background: #999; border: 2px inset #fff; height: 180px; overflow-y: auto; padding: 5px; margin-bottom: 15px;">
                <div class="regret-file" data-name="Argument_11_2015.mov" data-info="A memory of a fight she wishes she hadn't had.">Argument_11_2015.mov</div>
                <div class="regret-file" data-name="The_Road_Not_Taken.lnk" data-info="A shortcut to a life path she abandoned.">The_Road_Not_Taken.lnk</div>
                <div class="regret-file" data-name="Words_I_Should_Have_Said.txt" data-info="Size: 0KB — because they were never spoken.">Words_I_Should_Have_Said.txt</div>
                <div class="regret-file" data-name="Old_Self_Image_v1.png" data-info="Who she was before meeting her husband.">Old_Self_Image_v1.png</div>
                <div class="regret-file" data-name="Loneliness.zip" data-info="Thrown away 23 years ago.">Loneliness.zip</div>
                <div class="regret-file" data-name="Doubt_About_Motherhood.tmp" data-info="Discarded right before the daughter was born.">Doubt_About_Motherhood.tmp</div>
            </div>

            <div id="file-info-panel" style="border: 2px inset #fff; padding: 10px; background: #c0c0c0; min-height: 90px; margin-bottom: 15px;">
                <div style="color: #000080; margin-bottom: 5px; text-decoration: underline;">File Properties:</div>
                <div id="selected-file-name" style="margin-bottom: 5px;">Select a memory to inspect...</div>
                <div id="selected-file-desc" style="color: #444; font-size: 7px; margin-bottom: 8px; font-style: italic;"></div>
                <div id="static-info" style="display: none;">
                    <div>Original: C:\\HEART\\ACTIVE_THOUGHTS</div>
                    <div>Status: Awaiting Oblivion</div>
                    <div>Recoverable: <span style="color: #aa0000; animation: blink 1s infinite;">YES</span></div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <button id="empty-trash-btn" style="background: #999; border: 2px solid; border-color: #555 #eee #eee #555; font-size: 8px; padding: 10px; color: #444; filter: contrast(0.5); cursor: pointer; text-transform: none; margin: 0; box-shadow: none;">EMPTY REGRETS</button>
                <div style="display: flex; gap: 10px;">
                    <button style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 8px; padding: 10px; color: #000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;" onclick="this.closest('#regrets-window').remove()">CLOSE</button>
                </div>
            </div>
        </div>
    `;

    viewport.appendChild(win);

    // File Selection Logic
    const files = win.querySelectorAll(".regret-file");
    const nameEl = win.querySelector("#selected-file-name");
    const descEl = win.querySelector("#selected-file-desc");
    const staticInfo = win.querySelector("#static-info");

    files.forEach(f => {
        f.style.cssText = "padding: 4px; cursor: pointer; margin-bottom: 2px; white-space: nowrap;";
        f.onmouseover = () => f.style.background = "#777";
        f.onmouseout = () => { if (f.dataset.selected !== "true") f.style.background = "transparent"; };

        f.onclick = () => {
            files.forEach(file => {
                file.style.background = "transparent";
                file.dataset.selected = "false";
                file.style.color = "#000";
            });
            f.style.background = "#000080";
            f.style.color = "#fff";
            f.dataset.selected = "true";

            nameEl.innerText = f.dataset.name;
            descEl.innerText = f.dataset.info;
            staticInfo.style.display = "block";
        };
    });

    // Empty Trash Logic
    const emptyBtn = win.querySelector("#empty-trash-btn");
    emptyBtn.onclick = () => {
        alert("System Error: Cannot empty Regrets. Files are currently in use by: CONSCIENCE.EXE");
    };

    // Add glitch styles
    if (!document.getElementById("regrets-styles")) {
        const style = document.createElement("style");
        style.id = "regrets-styles";
        style.innerHTML = `
            .glitch-border { animation: borderGlitch 4s infinite; }
            @keyframes borderGlitch {
                0%, 100% { border-color: #ffffff #555 #555 #ffffff; }
                95% { border-color: #ffffff #555 #555 #ffffff; }
                96% { border-color: #aa0000 #555 #555 #aa0000; }
                97% { border-color: #ffffff #555 #555 #ffffff; }
                98% { border-color: #0000aa #555 #555 #0000aa; }
            }
            .regret-file:hover { color: #fff; }
        `;
        document.head.appendChild(style);
    }
}
