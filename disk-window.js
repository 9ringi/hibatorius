/* ======================
   SYSTEM DISK WINDOW MODULE
====================== */

function openDiskWindow() {
    // Prevent multiple windows
    if (document.getElementById("disk-window")) return;

    const viewport = document.getElementById("game-viewport");

    // Create the window container
    const win = document.createElement("div");
    win.id = "disk-window";
    win.className = "retro-window";
    win.style.cssText = `
        position: absolute;
        left: 54%;
        top: 52%;
        transform: translate(-50%, -50%);
        width: 680px;
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
        <div class="win-title-bar" style="background: #008080; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: white; font-size: 10px;">[System Disk: BRAIN_HD1]</span>
            <button class="win-close-btn" onclick="this.closest('#disk-window').remove()" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: none;">X</button>
        </div>
        
        <div class="win-body" style="padding: 20px; font-size: 9px; line-height: 1.5;">
            
            <!-- 1. Storage Overview -->
            <div style="font-weight: bold; margin-bottom: 10px; color: #000080; border-bottom: 2px solid #888;">1. Storage Overview</div>
            <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
                <div style="width: 100px; height: 100px; border: 2px inset #fff; background: #eee; display: flex; align-items: center; justify-content: center; position: relative;">
                    <!-- Simple CSS Pie Chart approximation -->
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#000080 0% 82%, #ffffff 82% 100%); border: 1px solid #000;"></div>
                    <div style="position: absolute; bottom: 5px; right: 5px; font-size: 8px;">C:</div>
                </div>
                <div>
                    <div>Capacity: 34 YEARS / 12,410 DAYS</div>
                    <div style="color: #000080;">Used Space: 28 YEARS (Life Experiences)</div>
                    <div style="color: #666;">Free Space: 6 YEARS (Unknown Future)</div>
                    <div style="margin-top: 5px;">Format: BIO_LOGICAL (Read/Write)</div>
                </div>
            </div>

            <!-- 2. Disk Partitions -->
            <div style="font-weight: bold; margin-bottom: 10px; color: #000080;">2. Disk Partitions (Sectors)</div>
            <div style="width: 100%; height: 35px; border: 2px inset #fff; display: flex; margin-bottom: 5px; background: #fff;">
                <div style="width: 18%; background: #000080; height: 100%; border-right: 1px solid #fff; cursor: help;" title="Formative"></div>
                <div style="width: 15%; background: #008080; height: 100%; border-right: 1px solid #fff; cursor: help;" title="Academic"></div>
                <div style="width: 40%; background: #800080; height: 100%; border-right: 1px solid #fff; cursor: help;" title="Domestic"></div>
                <div id="partition-daughter" style="width: 27%; background: #aa0000; height: 100%; cursor: pointer; animation: pulse-red 2s infinite;" title="Daughter"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 7px; margin-bottom: 20px; color: #444;">
                 <span>FORMATIVE (18%)</span>
                 <span>ACADEMIC (15%)</span>
                 <span>DOMESTIC (40%)</span>
                 <span style="color: #aa0000;">DAUGHTER (27%*)</span>
            </div>

            <!-- 3. Health Report -->
            <div style="font-weight: bold; margin-bottom: 10px; color: #000080;">3. Disk Health Report</div>
            <div style="background: #e0e0e0; border: 2px inset #fff; padding: 10px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>Physical Condition: <span style="color: #008800;">OPTIMAL</span></div>
                <div>Neural Pathways: <span style="color: #008800;">HEALED</span></div>
                <div>Fragmentation: <span style="color: #000;">LOW</span></div>
                <div>Last Backup: <span style="color: #555;">3 HOURS AGO</span></div>
            </div>

            <!-- 4. Hidden System Files -->
            <div style="font-weight: bold; margin-bottom: 10px; color: #000080;">4. Hidden "System" Files</div>
            <div style="font-family: monospace; font-size: 8px; color: #444; border: 1px solid #888; padding: 5px;">
                > heartbeat.kext (Kernel Extension)<br>
                > reflex_arc.sys (Active)<br>
                > unconscious_bias.db [Locked]<br>
                > maternal_instinct.bin (Priority High)
            </div>

            <!-- Footer Buttons -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <button style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 8px; padding: 8px; color: #aa0000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;" onclick="alert('CRITICAL ERROR: System Disk is required for life.vbs. Action denied.')">FORMAT</button>
                <div style="display: flex; gap: 10px;">
                    <button style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 8px; padding: 8px; color: #000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;" onclick="this.closest('#disk-window').remove()">OK</button>
                    <button style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; font-size: 8px; padding: 8px; color: #000; cursor: pointer; text-transform: none; margin: 0; box-shadow: none;" onclick="this.closest('#disk-window').remove()">CANCEL</button>
                </div>
            </div>
        </div>
    `;

    viewport.appendChild(win);

    // Interactive Daughter Partition
    const daughterPart = win.querySelector("#partition-daughter");
    daughterPart.onclick = () => {
        alert("This sector is Write-Protected. Only the primary user can modify these memories.");
    };

    // Add necessary styles if not exists
    if (!document.getElementById("disk-win-styles")) {
        const style = document.createElement("style");
        style.id = "disk-win-styles";
        style.innerHTML = `
            @keyframes pulse-red { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
            .retro-window button:active { border-color: #555 #fff #fff #555 !important; }
        `;
        document.head.appendChild(style);
    }
}
