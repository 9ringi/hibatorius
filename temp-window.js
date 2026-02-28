/* ======================
   TEMPORARY / NOTEPAD WINDOW MODULE
====================== */

function openTempWindow() {
    // Prevent multiple windows
    if (document.getElementById("temp-window")) return;

    const viewport = document.getElementById("game-viewport");

    // Create the window container
    const win = document.createElement("div");
    win.id = "temp-window";
    win.className = "retro-window";
    win.style.cssText = `
        position: absolute;
        left: 52%;
        top: 48%;
        transform: translate(-50%, -50%);
        width: 700px;
        background: #fff;
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
            <span style="color: white; font-size: 10px;">[Notepad: ShortTerm_Memory.txt]</span>
            <div style="display: flex; gap: 4px;">
                <button class="win-btn" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer;">_</button>
                <button class="win-btn" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer;">□</button>
                <button class="win-close-btn" onclick="this.closest('#temp-window').remove()" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;">X</button>
            </div>
        </div>
        
        <div style="background: #c0c0c0; border-bottom: 2px solid #808080; padding: 2px 10px; font-size: 9px; display: flex; gap: 15px;">
            <span style="border-right: 1px solid #888; padding-right: 10px;">File</span>
            <span style="border-right: 1px solid #888; padding-right: 10px;">Edit</span>
            <span style="border-right: 1px solid #888; padding-right: 10px;">Search</span>
            <span>Help</span>
        </div>

        <textarea id="notepad-text-area" spellcheck="false" style="padding: 20px; font-size: 10px; line-height: 2.0; min-height: 450px; width: 100%; box-sizing: border-box; resize: none; border: none; outline: none; font-family: 'Press Start 2P', monospace; background: #fff; color: #000; cursor: text;"></textarea>
        
        <div style="background: #c0c0c0; border-top: 2px solid #fff; padding: 5px 10px; font-size: 8px; color: #444;">
           UTF-8 | Line 1, Col 1
        </div>
    `;

    viewport.appendChild(win);

    const textArea = win.querySelector("#notepad-text-area");

    const defaultContent = `1. Don't forget: Daughter's dentist appointment at 4:00 PM.

2. Buy more milk (the organic kind she likes).

3. Contact the accountant.

4. [SYSTEM_NOTE]: He looked so tired this morning. Make his favorite dish tomorrow.

5. Last night was amazing

6. Need to call Mom back.

7. Am I doing enough? [ERROR: THOUGHT_LOOP]

8. 12.. 15.. 20.. (counting the days until the anniversary).`;

    // Load from localStorage if exists
    const savedContent = localStorage.getItem("hiba_temp_notepad");

    // Save on input
    textArea.addEventListener("input", () => {
        localStorage.setItem("hiba_temp_notepad", textArea.value);
    });

    if (savedContent === null) {
        // First time opening: type out the default content
        textArea.value = "";
        let charIndex = 0;
        const typingSpeed = 35; // ms per character

        function typeChar() {
            if (charIndex < defaultContent.length) {
                textArea.value += defaultContent.charAt(charIndex);
                charIndex++;
                textArea.scrollTop = textArea.scrollHeight;
                // Save progress in case they close it mid-typing
                localStorage.setItem("hiba_temp_notepad", textArea.value);
                setTimeout(typeChar, typingSpeed);
            }
        }

        setTimeout(typeChar, 500);
    } else {
        // Opened before: show saved content
        textArea.value = savedContent;
    }

    // Add necessary blink style if not exists
    if (!document.getElementById("notepad-styles")) {
        const style = document.createElement("style");
        style.id = "notepad-styles";
        style.innerHTML = `
            @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
            .win-btn:active { border-color: #555 #fff #fff #555 !important; }
        `;
        document.head.appendChild(style);
    }
}
