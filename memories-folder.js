/* ======================
   MEMORIES FOLDER MODULE
====================== */

function openMemoriesFolder() {
    if (document.getElementById("memories-folder")) return;

    const viewport = document.getElementById("game-viewport");
    const win = document.createElement("div");
    win.id = "memories-folder";
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
        z-index: 21000;
        display: flex;
        flex-direction: column;
        font-family: 'Press Start 2P', monospace;
    `;

    win.innerHTML = `
        <div class="win-title-bar" style="background: #000080; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: white; font-size: 10px;">[C:\\IMAGES\\MEMORIES]</span>
            <button class="win-close-btn" onclick="this.closest('#memories-folder').remove()" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: none;">X</button>
        </div>
        
        <!-- Retro Menu Bar -->
        <div style="background: #c0c0c0; border-bottom: 2px solid #808080; padding: 4px 10px; font-size: 8px; display: flex; gap: 15px;">
            <span style="cursor: pointer; text-decoration: underline;">F</span>ile
            <span style="cursor: pointer; text-decoration: underline;">E</span>dit
            <span style="cursor: pointer; text-decoration: underline;">V</span>iew
            <span style="cursor: pointer; text-decoration: underline;">H</span>elp
        </div>
        <!-- Address Bar -->
        <div style="background: #c0c0c0; border-bottom: 2px solid #808080; padding: 6px 10px; font-size: 8px; display: flex; align-items: center;">
            Address: 
            <div style="background: #fff; border: 2px inset #fff; padding: 4px 8px; margin-left: 10px; flex-grow: 1; color: #000;">
                C:\\IMAGES\\MEMORIES
            </div>
        </div>

        <div class="win-body" style="padding: 20px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; background: #fff; margin: 10px; border: 2px inset #fff; height: 350px; overflow-y: auto;">
            ${Array.from({ length: 10 }, (_, i) => `
                <div class="file-icon" onclick="openPhotoViewer(${i + 1})" style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                    <img src="images/assets/pc/image.png" style="width: 32px; height: 32px; image-rendering: pixelated; margin-bottom: 8px;">
                    <span style="font-size: 6px; text-align: center; color: #000;">memory${i + 1}.png</span>
                </div>
            `).join('')}
        </div>
        
        <!-- Status Bar -->
        <div style="background: #c0c0c0; border-top: 2px solid #808080; padding: 4px 10px; font-size: 7px; color: #000; display: flex; justify-content: space-between;">
            <span>10 object(s)</span>
            <span>12.4 MB</span>
        </div>
    `;

    viewport.appendChild(win);
}

let currentPhotoIndex = 1;
const totalPhotos = 10;

const photoMemos = [
    "", // index 0 unused
    `<span style="color: #666;">Date:</span> 29/03/2026<br><br><span style="color: #666;">Subject:</span> A kiss<br><br>I remember that kiss so well...<br>it felt like the world stopped spinning just to let us have that moment`,
    `<span style="color: #666;">Date:</span> 20/04/2028<br><br><span style="color: #666;">Subject:</span> A little walk<br><br>Just us, walking through the trees and talking about everything and nothing at once`,
    `<span style="color: #666;">Date:</span> 05/02/2032<br><br><span style="color: #666;">Subject:</span> Warmth<br><br>Even the coldest winter feels like the warmest summer.`,
    `<span style="color: #666;">Date:</span> 02/11/2035<br><br><span style="color: #666;">Subject:</span> A new chapter<br><br>We finally signed our names into the same chapter.`,
    `<span style="color: #666;">Date:</span> 06/04/2036<br><br><span style="color: #666;">Subject:</span> Lunch<br><br>Just a quiet Sunday in our kitchen`,
    `<span style="color: #666;">Date:</span> 12/06/2041<br><br><span style="color: #666;">Subject:</span> A Guest<br><br>A guest is coming soon.`,
    `<span style="color: #666;">Date:</span> 05/05/2042<br><br><span style="color: #666;">Subject:</span> Little by little<br><br>One of the happiest days of my life.`,
    `<span style="color: #666;">Date:</span> 12/09/2042<br><br><span style="color: #666;">Subject:</span> A nap<br><br>Us and a her small version of pinky ball`,
    `<span style="color: #666;">Date:</span> 03/06/2045<br><br><span style="color: #666;">Subject:</span> Balance<br><br>I could still read books and have time for myself`,
    `<span style="color: #666;">Date:</span> 12/10/2047<br><br><span style="color: #666;">Subject:</span> Joy<br><br>A very special birthday early in the morning.`
];

function openPhotoViewer(index) {
    currentPhotoIndex = index;

    if (document.getElementById("photo-viewer-window")) {
        document.getElementById("photo-viewer-window").remove();
    }

    const viewport = document.getElementById("game-viewport");
    const win = document.createElement("div");
    win.id = "photo-viewer-window";
    win.className = "retro-window";
    win.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 1000px;
        background: #c0c0c0;
        border: 3px solid;
        border-color: #ffffff #808080 #808080 #ffffff;
        box-shadow: 4px 4px 15px rgba(0,0,0,0.5);
        z-index: 22000;
        display: flex;
        flex-direction: column;
        font-family: 'Press Start 2P', monospace;
    `;

    win.innerHTML = `
        <div class="win-title-bar" style="background: #000080; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
            <span id="photo-viewer-title" style="color: white; font-size: 10px;">PHOTO VIEWER - memory${currentPhotoIndex}.png</span>
            <button class="win-close-btn" onclick="this.closest('#photo-viewer-window').remove()" style="background: #c0c0c0; border: 2px solid; border-color: #fff #555 #555 #fff; width: 18px; height: 18px; padding: 0; font-size: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;">X</button>
        </div>
        
        <div class="win-body" style="padding: 20px; display: flex; flex-direction: row; gap: 20px; color: #000;">
            <!-- Left Side: Image and Controls -->
            <div style="flex: 2.5; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100%; height: 450px; background: #000; border: 2px inset #fff; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; overflow: hidden; position: relative;">
                    <img id="photo-viewer-img" src="images/assets/pc/memories/memory${currentPhotoIndex}.png" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 10px;">
                    <button onclick="changePhoto(-1)" style="background: #c0c0c0; border: 3px solid; border-color: #fff #555 #555 #fff; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;">
                        <img src="images/assets/pc/memories/arrow left.png" style="width: 24px; height: 24px; image-rendering: pixelated; pointer-events: none;">
                    </button>

                    <div style="text-align: center; background: #fff; border: 2px inset #fff; padding: 8px 20px;">
                        <div id="photo-viewer-name" style="font-size: 10px; font-weight: bold; margin-bottom: 6px; color: #000080;">memory${currentPhotoIndex}.png</div>
                        <div id="photo-viewer-count" style="font-size: 8px; color: #444;">${currentPhotoIndex} of ${totalPhotos}</div>
                    </div>

                    <button onclick="changePhoto(1)" style="background: #c0c0c0; border: 3px solid; border-color: #fff #555 #555 #fff; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;">
                        <img src="images/assets/pc/memories/arrow right.png" style="width: 24px; height: 24px; image-rendering: pixelated; pointer-events: none;">
                    </button>
                </div>
            </div>

            <!-- Right Side: Memo Text -->
            <div style="flex: 1; border: 2px inset #fff; background: #ffffff; padding: 15px; font-size: 8px; line-height: 1.8; color: #000; display: flex; flex-direction: column;">
                <div style="font-weight: bold; font-size: 10px; color: #000080; border-bottom: 1px dashed #aa0000; padding-bottom: 5px; margin-bottom: 10px;">MEMO.TXT</div>
                
                <div id="photo-viewer-desc" style="flex-grow: 1;">
                    ${photoMemos[currentPhotoIndex]}
                </div>
                
                <div style="margin-top: auto; text-align: right; color: #aa0000;">[EOF]</div>
            </div>
        </div>
    `;

    viewport.appendChild(win);
}

function changePhoto(dir) {
    currentPhotoIndex += dir;
    if (currentPhotoIndex > totalPhotos) currentPhotoIndex = 1;
    if (currentPhotoIndex < 1) currentPhotoIndex = totalPhotos;

    const img = document.getElementById("photo-viewer-img");
    const name = document.getElementById("photo-viewer-name");
    const count = document.getElementById("photo-viewer-count");
    const title = document.getElementById("photo-viewer-title");
    const desc = document.getElementById("photo-viewer-desc");

    if (img && name && count && title && desc) {
        img.src = `images/assets/pc/memories/memory${currentPhotoIndex}.png`;
        name.innerText = `memory${currentPhotoIndex}.png`;
        title.innerText = `PHOTO VIEWER - memory${currentPhotoIndex}.png`;
        count.innerText = `${currentPhotoIndex} of ${totalPhotos}`;
        desc.innerHTML = photoMemos[currentPhotoIndex];
    }
}