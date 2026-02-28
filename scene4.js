/* ======================
   SCENE 4: WHITE-OUT → RETRO DESKTOP GUI
====================== */

let scene4Started = false;
let whiteCircleRadius = 0;
const MAX_RADIUS = 2500;
const EXPANSION_SPEED = 5000;

let desktopReady = false;         // true once white-out is complete
let desktopAlpha = 0;             // for fade-in of desktop

/* ── Desktop Icon definitions ── */
const desktopIcons = [
    { file: 'Bios.png', label: 'Bios / Ego' },
    { file: 'memories.png', label: 'Memories' },
    { file: 'Short memory.png', label: 'Temporary' },
    { file: 'System Disk.png', label: 'System Disk' },
    { file: 'Regrets.png', label: 'Trash / Regrets' },
    { file: 'Trauma.png', label: 'Traumas' },
];

/* Pre-load all icon images */
desktopIcons.forEach(icon => {
    icon.img = new Image();
    icon.img.src = `images/assets/pc/${icon.file}`;
});

/* ── Dithered background pattern (2×2 checkerboard) ── */
let ditherPattern = null;

function buildDitherPattern(ctx) {
    if (ditherPattern) return ditherPattern;

    // 4×4 Bayer-style ordered dither — white with sparse black dots
    const size = 4;
    const offscreen = document.createElement('canvas');
    offscreen.width = size;
    offscreen.height = size;
    const octx = offscreen.getContext('2d');

    // Fill white
    octx.fillStyle = '#ffffff';
    octx.fillRect(0, 0, size, size);

    // Place black dots at Bayer threshold positions (light density)
    octx.fillStyle = '#000000';
    // Only 3 out of 16 pixels black — gives a subtle light dither
    const dots = [[0, 0], [2, 1], [1, 3]];
    dots.forEach(([x, y]) => octx.fillRect(x, y, 1, 1));

    ditherPattern = ctx.createPattern(offscreen, 'repeat');
    return ditherPattern;
}

/* ── Icon layout parameters ── */
const ICON_SIZE = 72;   // Smaller icons
const MAX_COLS = 4;     // 4 per line
const ICON_MARGIN_X = 120;
const ICON_MARGIN_Y = 120;
const ICON_GAP_X = 240; // Space between columns
const ICON_GAP_Y = 180; // Space between rows
const LABEL_FONT = '16px "Press Start 2P", monospace';
const LABEL_COLOR = '#ffffff';
const LABEL_SHADOW = '#000000';

/* Hover + click state */
let hoveredIcon = -1;
let selectedIcon = -1;
let mouseX = 0, mouseY = 0;

/* Track icon screen rects so we can hit-test */
const iconRects = [];

function layoutIcons() {
    iconRects.length = 0;
    desktopIcons.forEach((icon, i) => {
        const col = i % MAX_COLS;
        const row = Math.floor(i / MAX_COLS);
        const x = ICON_MARGIN_X + col * ICON_GAP_X;
        const y = ICON_MARGIN_Y + row * ICON_GAP_Y;
        iconRects.push({ x, y, w: ICON_SIZE, h: ICON_SIZE, label: icon.label });
    });
}

/* ── Mouse listener (attached once when desktop is ready) ── */
let desktopListenersAttached = false;
function attachDesktopListeners() {
    if (desktopListenersAttached) return;
    desktopListenersAttached = true;

    const canvasEl = document.getElementById('game-fg');

    canvasEl.addEventListener('mousemove', e => {
        if (scene !== 4 || !desktopReady) return;
        const rect = canvasEl.getBoundingClientRect();
        const scaleX = V_WIDTH / rect.width;
        const scaleY = V_HEIGHT / rect.height;
        mouseX = (e.clientX - rect.left) * scaleX;
        mouseY = (e.clientY - rect.top) * scaleY;

        hoveredIcon = -1;
        iconRects.forEach((r, i) => {
            if (mouseX >= r.x && mouseX <= r.x + r.w &&
                mouseY >= r.y && mouseY <= r.y + r.h) {
                hoveredIcon = i;
            }
        });

        canvasEl.style.cursor = hoveredIcon >= 0 ? 'pointer' : 'default';
    });

    canvasEl.addEventListener('click', e => {
        if (scene !== 4 || !desktopReady) return;
        if (hoveredIcon >= 0) {
            selectedIcon = hoveredIcon;
            console.log('Desktop icon clicked:', desktopIcons[hoveredIcon].label);

            // Allow single click to open windows for this specific game feel
            openDesktopIcon(hoveredIcon);
        } else {
            selectedIcon = -1;
        }
    });

    canvasEl.addEventListener('dblclick', e => {
        if (scene !== 4 || !desktopReady) return;
        if (hoveredIcon >= 0) {
            openDesktopIcon(hoveredIcon);
        }
    });
}

function openDesktopIcon(index) {
    console.log('Opening:', desktopIcons[index].label);
    if (index === 0) { // Bios / Ego
        if (typeof openBiosWindow === 'function') {
            openBiosWindow();
        }
    } else if (index === 1) { // Memories
        if (typeof openMemoriesFolder === 'function') {
            openMemoriesFolder();
        }
    } else if (index === 2) { // Temporary
        if (typeof openTempWindow === 'function') {
            openTempWindow();
        }
    } else if (index === 3) { // System Disk
        if (typeof openDiskWindow === 'function') {
            openDiskWindow();
        }
    } else if (index === 4) { // Trash / Regrets
        if (typeof openRegretsWindow === 'function') {
            openRegretsWindow();
        }
    } else if (index === 5) { // Traumas
        if (typeof openTraumaWindow === 'function') {
            openTraumaWindow();
        }
    }
}
/* ──────────────────────────────
   MAIN ENTRY
────────────────────────────── */
function startScene4() {
    console.log('Starting Scene 4 transition...');
    scene4Started = true;
    scene = 4;
    whiteCircleRadius = 0;
}

/* ──────────────────────────────
   DRAW LOOP (called by script.js)
────────────────────────────── */
function drawScene4(delta) {
    if (!scene4Started) return;

    if (!desktopReady) {
        /* ── Phase 1: White circle expands ── */
        whiteCircleRadius += (EXPANSION_SPEED * delta) / 1000;

        ctxFg.save();
        ctxFg.beginPath();
        ctxFg.arc(V_WIDTH / 2, V_HEIGHT / 2, whiteCircleRadius, 0, Math.PI * 2);
        ctxFg.fillStyle = 'white';
        ctxFg.fill();
        ctxFg.restore();

        if (whiteCircleRadius >= MAX_RADIUS) {
            desktopReady = true;
            layoutIcons();
            attachDesktopListeners();
        }
        return;
    }

    /* ── Phase 2: Desktop GUI ── */

    // Fade in
    if (desktopAlpha < 1) {
        desktopAlpha = Math.min(1, desktopAlpha + delta / 800);
    }

    const ctx = ctxFg;
    ctx.save();
    ctx.globalAlpha = desktopAlpha;

    // 1. Classic OS Background (Teal)
    ctx.fillStyle = '#008080';
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    // 2. Taskbar at the bottom (Windows 95 style)
    const taskbarHeight = 56;
    const taskbarY = V_HEIGHT - taskbarHeight;

    // Main taskbar body
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, taskbarY, V_WIDTH, taskbarHeight);

    // Top 3D highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, taskbarY, V_WIDTH, 2);

    // Start Button
    const startBtnWidth = 160;
    // Button Base
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(8, taskbarY + 8, startBtnWidth, taskbarHeight - 16);
    // Button Highlight (Top & Left)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, taskbarY + 8, startBtnWidth, 2);
    ctx.fillRect(8, taskbarY + 8, 2, taskbarHeight - 16);
    // Button Shadow (Bottom & Right)
    ctx.fillStyle = '#808080';
    ctx.fillRect(8, taskbarY + taskbarHeight - 10, startBtnWidth, 2);
    ctx.fillRect(8 + startBtnWidth - 2, taskbarY + 8, 2, taskbarHeight - 16);
    ctx.fillStyle = '#000000';
    ctx.fillRect(8, taskbarY + taskbarHeight - 8, startBtnWidth + 2, 2);
    ctx.fillRect(8 + startBtnWidth, taskbarY + 6, 2, taskbarHeight - 14);

    // Start Button Text
    ctx.fillStyle = '#000000';
    ctx.font = '20px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HIBA.OS', 8 + startBtnWidth / 2, taskbarY + taskbarHeight / 2);

    // System Tray (right side)
    const timeFont = '16px "Press Start 2P", monospace';
    ctx.font = timeFont;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dateStr = "28/02/2046";
    const trayText = dateStr + "  " + timeStr;
    const textWidth = ctx.measureText(trayText).width;

    const trayWidth = textWidth + 40;
    const trayX = V_WIDTH - trayWidth - 8;

    // Tray sunken border
    ctx.fillStyle = '#808080';
    ctx.fillRect(trayX, taskbarY + 8, trayWidth, taskbarHeight - 16);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(trayX + 2, taskbarY + 10, trayWidth, taskbarHeight - 16);
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(trayX + 2, taskbarY + 10, trayWidth - 2, taskbarHeight - 18);

    // Tray Text
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(trayText, trayX + trayWidth / 2 + 1, taskbarY + taskbarHeight / 2);

    // 3. Draw icons
    desktopIcons.forEach((icon, i) => {
        const r = iconRects[i];
        if (!r) return;

        const isHovered = (hoveredIcon === i);
        const isSelected = (selectedIcon === i);

        // Selection / hover highlight box
        if (isSelected || isHovered) {
            ctx.fillStyle = isSelected ? 'rgba(0,0,128,0.5)' : 'rgba(255,255,255,0.15)';
            ctx.fillRect(r.x - 8, r.y - 8, r.w + 16, r.h + 16 + 40);

            // Dotted selection border (retro)
            if (isSelected) {
                ctx.save();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(r.x - 8, r.y - 8, r.w + 16, r.h + 16 + 40);
                ctx.restore();
            }
        }

        // Icon image
        if (icon.img && icon.img.complete && icon.img.naturalWidth > 0) {
            // Slight pixel-art upscale with pixelated rendering
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(icon.img, r.x, r.y, r.w, r.h);
        } else {
            // Placeholder box
            ctx.fillStyle = '#888';
            ctx.fillRect(r.x, r.y, r.w, r.h);
        }

        // Label text — draw with shadow for retro readability
        ctx.font = LABEL_FONT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const labelLines = wrapText(ctx, r.label, 200);
        labelLines.forEach((line, li) => {
            const lx = r.x + r.w / 2;
            const ly = r.y + r.h + 10 + li * 22;
            // shadow
            ctx.fillStyle = LABEL_SHADOW;
            ctx.fillText(line, lx + 1, ly + 1);
            // text
            ctx.fillStyle = isSelected ? '#ffffff' : LABEL_COLOR;
            if (isSelected) {
                // invert: navy bg, white text
                const tm = ctx.measureText(line);
                ctx.fillStyle = '#000080';
                ctx.fillRect(lx - tm.width / 2 - 2, ly - 1, tm.width + 4, 22);
                ctx.fillStyle = '#ffffff';
            }
            ctx.fillText(line, lx, ly);
        });
    });

    ctx.restore();
}

/* Helper: wrap text to max pixel width */
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let current = '';
    words.forEach(word => {
        const test = current ? current + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && current) {
            lines.push(current);
            current = word;
        } else {
            current = test;
        }
    });
    if (current) lines.push(current);
    return lines;
}
