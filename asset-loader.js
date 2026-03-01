const allAssets = [
    "images/assets/arrows/left.png",
    "images/assets/arrows/right.png",
    "images/assets/bird on tree.gif",
    "images/assets/bird.gif",
    "images/assets/butterflies.gif",
    "images/assets/deer.gif",
    "images/assets/dog.gif",
    "images/assets/earth.gif",
    "images/assets/effect.gif",
    "images/assets/intro/aface.gif",
    "images/assets/intro/anatomy.gif",
    "images/assets/intro/atom.gif",
    "images/assets/intro/dance.gif",
    "images/assets/intro/eye.gif",
    "images/assets/intro/face.gif",
    "images/assets/intro/flowerss.gif",
    "images/assets/intro/fly.gif",
    "images/assets/intro/galaxy.gif",
    "images/assets/intro/head.gif",
    "images/assets/intro/heart.gif",
    "images/assets/intro/illu.gif",
    "images/assets/intro/kiss.gif",
    "images/assets/intro/loading.gif",
    "images/assets/intro/men.gif",
    "images/assets/intro/moli.gif",
    "images/assets/intro/moon.gif",
    "images/assets/intro/msg.gif",
    "images/assets/intro/shine.gif",
    "images/assets/intro/star.gif",
    "images/assets/intro/ufo.gif",
    "images/assets/intro/uni.gif",
    "images/assets/intro/wave.gif",
    "images/assets/intro/wrd1.gif",
    "images/assets/intro/wrd2.gif",
    "images/assets/intro/zrd.gif",
    "images/assets/leave2.gif",
    "images/assets/leave3.gif",
    "images/assets/leaves.gif",
    "images/assets/machine.png",
    "images/assets/pc/Bios.png",
    "images/assets/pc/Regrets.png",
    "images/assets/pc/Short memory.png",
    "images/assets/pc/System Disk.png",
    "images/assets/pc/Trauma.png",
    "images/assets/pc/image.png",
    "images/assets/pc/memories.png",
    "images/assets/pc/memories/arrow left.png",
    "images/assets/pc/memories/arrow right.png",
    "images/assets/pc/memories/memory1.png",
    "images/assets/pc/memories/memory10.png",
    "images/assets/pc/memories/memory2.png",
    "images/assets/pc/memories/memory3.png",
    "images/assets/pc/memories/memory4.png",
    "images/assets/pc/memories/memory5.png",
    "images/assets/pc/memories/memory6.png",
    "images/assets/pc/memories/memory7.png",
    "images/assets/pc/memories/memory8.png",
    "images/assets/pc/memories/memory9.png",
    "images/assets/rabbit.gif",
    "images/background/close/0.png",
    "images/background/close/1.png",
    "images/background/close/2.png",
    "images/background/close/3.png",
    "images/background/far/0.png",
    "images/background/far/1.png",
    "images/background/far/2.png",
    "images/background/far/3.png",
    "images/background/girl/portrait.png",
    "images/background/girl/scene1/1.png",
    "images/background/girl/scene1/2.png",
    "images/background/girl/scene1/3.png",
    "images/background/girl/scene1/4.png",
    "images/background/girl/scene1/5.png",
    "images/background/girl/scene2/1.png",
    "images/background/girl/scene2/2.png",
    "images/background/girl/scene2/3.png",
    "images/background/girl/scene2/4.png",
    "images/background/girl/scene2/5.png",
    "images/background/girl/scene3/10.png",
    "images/background/girl/scene3/11.png",
    "images/background/girl/scene3/12.png",
    "images/background/lkawn/16.png",
    "images/background/lkawn/17.png",
    "images/background/lkawn/18.png",
    "images/background/lkawn/19.png",
    "images/background/lkawn/20.png",
    "images/background/lkawn/21.png",
    "images/background/lkawn/22.png",
    "images/background/lkawn/23.png",
    "images/background/lkawn/24.png",
    "images/background/lkawn/25.png",
    "images/background/lkawn/26.png",
    "images/background/lkawn/27.png",
    "images/background/lkawn/28.png",
    "images/background/lkawn/29.png",
    "images/background/lkawn/back/back.png",
    "images/background/lkawn/kawn.png",
    "sounds/effects/secne1/disap.mp3",
    "sounds/effects/secne1/forest.mp3",
    "sounds/effects/secne1/machine.mp3",
    "sounds/effects/secne1/walking.mp3",
    "sounds/songs/KAISAN.mp3",
    "sounds/songs/Oblivion.mp3",
    "sounds/songs/Signal_Flags.mp3",
    "sounds/songs/snow.mp3"
];

let loadedCount = 0;

window.addEventListener('DOMContentLoaded', () => {
    const loaderScreen = document.getElementById("asset-loader-screen");
    const bar = document.getElementById("loading-bar");
    const text = document.getElementById("loading-text");
    const startBtn = document.getElementById("loader-start-btn");

    function updateProgress() {
        loadedCount++;
        const p = Math.floor((loadedCount / allAssets.length) * 100);
        bar.style.width = p + "%";
        text.innerText = p + "%";

        if (loadedCount >= allAssets.length) {
            text.innerText = "ALL MEMORIES LOADED";
            startBtn.style.display = "block";
        }
    }

    startBtn.addEventListener('click', () => {
        loaderScreen.style.opacity = "0";
        setTimeout(() => {
            loaderScreen.style.display = "none";
            // Dispatch a custom event to tell intro.js we can start
            window.dispatchEvent(new Event('assetsLoaded'));
        }, 500);
    });

    allAssets.forEach(src => {
        if (src.endsWith('.mp3')) {
            const audio = new Audio();
            audio.oncanplaythrough = updateProgress;
            audio.onerror = updateProgress; // still count even if fail
            audio.src = src;
            audio.preload = "auto";
            audio.load();
        } else {
            const img = new Image();
            img.onload = updateProgress;
            img.onerror = updateProgress;
            img.src = src;
        }
    });

    // Fallback: If after 15 seconds stuff still hasn't fired (sometimes audio oncanplaythrough hangs on mobile)
    setTimeout(() => {
        if (loadedCount < allAssets.length) {
            loadedCount = allAssets.length;
            bar.style.width = "100%";
            text.innerText = "FORCE READY (TIMEOUT)";
            startBtn.style.display = "block";
        }
    }, 15000);
});
