// SETTING MODE DEPLOY:
// Saat ini bernilai 'false' agar kamu bebas klik tombol dan tes web.
// UBAH JADI 'true' NANTI SAAT MAU DEPLOY DI VERCEL agar tombol terkunci sampai tanggal 7 Okt jam 00:00!
const IS_DEPLOY_MODE = false; 

// Data Teks Surat Utama
const mainLetterText = `Selamat Ulang Tahun, Sayang. ❤️

Tepat pada jam 00:00 ini, waktu seolah berhenti sebentar hanya untuk merayakan hadirnya kamu di dunia ini. 

Terima kasih sudah menjadi bagian terindah dalam hidupku. Mendengar alunan lagu ini bersamamu membuatku sadar betapa beruntungnya aku memiliki kamu di setiap perjalanan waktu.

Semoga di usiamu yang baru ini, langkahmu semakin ringan, bahagiamu kian melimpah, dan semua impianmu perlahan menjadi nyata. Aku akan selalu ada di sini, menemani setiap waktu di hidupmu.`;

// Data Amplop "Open When..."
const envelopeContents = {
    1: "🌸 **Buka saat kamu butuh semangat:**\n\nIngat ya Sayang, kamu itu sosok yang luar biasa kuat dan hebat. Kalau hari ini terasa berat, istirahat sebentar ya Cintakuu. Aku selalu bangga sama semua usaha yang udah kamu lakukan Semangat terus Cantik, I believe in you!",
    2: "🌙 **Buka saat kamu kangen:**\n\nKalau kamu kangen, tutup matanya sebentar ya Sayang dan ingat saat-saat kita ketawa bareng. Walau jarak atau waktu memisahkan, ingat ya... hatiku selalu buat kamu. Nanti kita ketemu dan pelukan sepuasnya ya Sayanggg!",
    3: "🌧️ **Buka saat kamu merasa lelah:**\n\nTarik napas dalam-dalam ya Sayang... ga harus semuanya selesai hari ini. Kalau capek, sandarkan kepalamu sebentar. Ceritakan apa aja ke aku, aku siap jadi pendengar setiamu kapan pun.",
    4: "🧸 **Buka saat kamu lagi butuh pelukan:**\n\nSini-sini peyuk dulu dari jauh... 🫂❤️\nAnggap aja pesan ini pelukan terhangat dari aku buat kamu Sayang. Nanti kalau ketemu, aku bakal elus kepala kamu dan sayang-sayang sepuasnya!",
    5: "✨ **Buka saat kamu ingin melihat masa depan:**\n\nHarapanku sederhana Sayang: Aku ingin terus melihat senyum indahmu di setiap ulang tahunmu berikutnya. Mari kita lewati tahun demi tahun bersama dan buat lebih banyak kenangan bahagia lagi!",
    6: "🥺 **Buka saat kamu lagi sedih:**\n\nJangan biarkan hal-hal kecil merusak harimu ya Sayang. Ingat, aku selalu di sini di pihakmu. Jangan dipendam sendiri ya Cintaku, ceritain semuanya ke aku ya Cantikku. "
};

const memoryPhotos = [
    { id: 1, src: "assets/foto/1.jpg", fallback: "🌸" },
    { id: 2, src: "assets/foto/2.jpg", fallback: "💖" },
    { id: 3, src: "assets/foto/3.jpg", fallback: "✨" },
    { id: 4, src: "assets/foto/4.jpg", fallback: "🧸" }
];

const puzzlePhotos = { 1: "assets/foto/5.jpg", 2: "assets/foto/6.jpg", 3: "assets/foto/7.jpg" };
const scratchPhotos = { 1: "assets/foto/8.jpg", 2: "assets/foto/9.jpg", 3: "assets/foto/10.jpg" };

let g2UnlockedLevel = 1, g2CurrentLevel = 1;
let g3UnlockedLevel = 1, g3CurrentLevel = 1;
let flippedCards = [], matchedPairs = 0;
let puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let isScratching = false;

document.addEventListener("DOMContentLoaded", () => {
    const bgMusic = document.getElementById("bg-music");
    const openGateBtn = document.getElementById("open-gate-btn");
    const musicGate = document.getElementById("music-gate");
    const mainContainer = document.getElementById("main-container");
    const disc = document.getElementById("disc");
    const musicToggle = document.getElementById("music-toggle");
    const musicStatus = document.getElementById("music-status");
    const typewriterElement = document.getElementById("typewriter");
    const timerTextElement = document.getElementById("timer-text");

    let index = 0;
    let isTimerFinished = false;

    function typeWriter() {
        if (index < mainLetterText.length) {
            typewriterElement.innerHTML += mainLetterText.charAt(index);
            index++;
            setTimeout(typeWriter, 40);
        }
    }

    // TARGET COUNTDOWN: TANGGAL 7 OKTOBER JAM 00:00:00
    function startCountdown() {
        const targetDate = new Date(2026, 9, 7, 0, 0, 0); // Bulan 9 adalah Oktober di JavaScript

        function updateTimer() {
            const currentTime = new Date().getTime();
            const distance = targetDate.getTime() - currentTime;

            if (distance <= 0) {
                timerTextElement.innerHTML = "🎉 Pukul 00:00 • Waktunya Tiba!";
                isTimerFinished = true;
                
                if (IS_DEPLOY_MODE) {
                    openGateBtn.disabled = false;
                    openGateBtn.innerText = "✨ Buka Kapsul Waktu";
                    openGateBtn.style.opacity = "1";
                    openGateBtn.style.cursor = "pointer";
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const pad = (num) => String(num).padStart(2, '0');

            if (days > 0) {
                timerTextElement.innerHTML = `Membuka Dalam: ${days}h ${pad(hours)}j ${pad(minutes)}m ${pad(seconds)}s`;
            } else {
                timerTextElement.innerHTML = `Membuka Dalam: ${pad(hours)}j ${pad(minutes)}m ${pad(seconds)}s`;
            }

            // Pengunci Tombol jika dalam Mode Deploy & Belum Jam 00:00
            if (IS_DEPLOY_MODE && !isTimerFinished) {
                openGateBtn.disabled = true;
                openGateBtn.innerText = "Tunggu Jam 00:00 Ya Sayang";
                openGateBtn.style.opacity = "0.6";
                openGateBtn.style.cursor = "not-allowed";
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    startCountdown();

    function launchFireworks() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }

    openGateBtn.addEventListener("click", () => {
        if (IS_DEPLOY_MODE && !isTimerFinished) return;

        bgMusic.play().then(() => {
            disc.classList.add("spin-disc");
            musicStatus.textContent = "Memutar...";
        }).catch(err => console.log(err));

        musicGate.style.display = "none";
        mainContainer.classList.remove("blur-screen");
        typeWriter();
        launchFireworks();
    });

    musicToggle.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            disc.classList.add("spin-disc");
            musicToggle.textContent = "⏸";
            musicStatus.textContent = "Memutar...";
        } else {
            bgMusic.pause();
            disc.classList.remove("spin-disc");
            musicToggle.textContent = "▶";
            musicStatus.textContent = "Dihentikan";
        }
    });
});

// POPUP GAME & KONTROL LAINNYA
function selectGame(gameId) {
    if (gameId === 1) { document.getElementById("game-modal-1").style.display = "flex"; initMemoryGame(); }
    else if (gameId === 2) { document.getElementById("game-modal-2").style.display = "flex"; showG2LevelSelect(); }
    else if (gameId === 3) { document.getElementById("game-modal-3").style.display = "flex"; showG3LevelSelect(); }
}

function closeGame(gameId) { document.getElementById(`game-modal-${gameId}`).style.display = "none"; }

/* ==================== GAME 1 ==================== */
function initMemoryGame() {
    const board = document.getElementById("memory-board");
    board.innerHTML = ""; flippedCards = []; matchedPairs = 0;
    document.getElementById("game-win-msg-1").classList.add("hidden");

    let cardsData = [...memoryPhotos, ...memoryPhotos].sort(() => Math.random() - 0.5);
    cardsData.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("memory-card");
        card.dataset.id = item.id; card.dataset.index = index;
        card.innerHTML = "❓";
        card.addEventListener("click", () => flipCard(card, item));
        board.appendChild(card);
    });
}

function flipCard(card, item) {
    if (flippedCards.length >= 2 || card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    card.innerHTML = `<img src="${item.src}" alt="Foto" onerror="this.outerHTML='${item.fallback}'">`;
    flippedCards.push({ card, item });
    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.item.id === card2.item.id) {
        matchedPairs++; flippedCards = [];
        if (matchedPairs === memoryPhotos.length) document.getElementById("game-win-msg-1").classList.remove("hidden");
    } else {
        setTimeout(() => {
            card1.card.classList.remove("flipped"); card2.card.classList.remove("flipped");
            card1.card.innerHTML = "❓"; card2.card.innerHTML = "❓";
            flippedCards = [];
        }, 1000);
    }
}

/* ==================== GAME 2 ==================== */
function showG2LevelSelect() {
    document.getElementById("g2-level-select").classList.remove("hidden");
    document.getElementById("g2-arena").classList.add("hidden");
    updateG2LevelButtons();
}

function updateG2LevelButtons() {
    for (let i = 1; i <= 3; i++) {
        const btn = document.getElementById(`g2-btn-lvl${i}`);
        if (i <= g2UnlockedLevel) {
            btn.disabled = false; btn.className = "btn-level unlocked";
            btn.querySelector(".lvl-status").textContent = "🔓 Terbuka";
        } else {
            btn.disabled = true; btn.className = "btn-level locked";
            btn.querySelector(".lvl-status").textContent = "🔒 Terkunci";
        }
    }
}

function startPuzzleLevel(lvl) {
    g2CurrentLevel = lvl;
    document.getElementById("g2-level-select").classList.add("hidden");
    document.getElementById("g2-arena").classList.remove("hidden");
    document.getElementById("g2-current-level-title").textContent = `🧩 Susun Puzzle Foto - Level ${lvl}`;
    initPuzzleGame();
}

function initPuzzleGame() {
    document.getElementById("game-win-msg-2").classList.add("hidden");
    puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let lastIndex = -1;
    for (let i = 0; i < 5; i++) {
        const emptyIndex = puzzleState.indexOf(8);
        const neighbors = getValidNeighbors(emptyIndex);
        const validChoices = neighbors.filter(n => n !== lastIndex);
        const chosen = validChoices.length > 0 ? validChoices[Math.floor(Math.random() * validChoices.length)] : neighbors[0];
        [puzzleState[emptyIndex], puzzleState[chosen]] = [puzzleState[chosen], puzzleState[emptyIndex]];
        lastIndex = emptyIndex;
    }
    renderPuzzle();
}

function getValidNeighbors(emptyIndex) {
    const neighbors = [];
    const row = Math.floor(emptyIndex / 3), col = emptyIndex % 3;
    if (row > 0) neighbors.push(emptyIndex - 3);
    if (row < 2) neighbors.push(emptyIndex + 3);
    if (col > 0) neighbors.push(emptyIndex - 1);
    if (col < 2) neighbors.push(emptyIndex + 1);
    return neighbors;
}

function renderPuzzle() {
    const board = document.getElementById("puzzle-board");
    board.innerHTML = "";
    const tileSize = (board.clientWidth || 270) / 3;
    const currentPhotoSrc = puzzlePhotos[g2CurrentLevel] || puzzlePhotos[1];

    puzzleState.forEach((tileValue, currentIndex) => {
        const tile = document.createElement("div");
        tile.classList.add("puzzle-tile");
        if (tileValue === 8) {
            tile.classList.add("empty");
        } else {
            tile.setAttribute("data-num", tileValue + 1);
            tile.style.backgroundImage = `url('${currentPhotoSrc}')`;
            tile.style.backgroundPosition = `-${(tileValue % 3) * tileSize}px -${Math.floor(tileValue / 3) * tileSize}px`;
            tile.addEventListener("click", () => movePuzzleTile(currentIndex));
        }
        board.appendChild(tile);
    });
}

function movePuzzleTile(index) {
    const emptyIndex = puzzleState.indexOf(8);
    if (getValidNeighbors(emptyIndex).includes(index)) {
        [puzzleState[index], puzzleState[emptyIndex]] = [puzzleState[emptyIndex], puzzleState[index]];
        renderPuzzle();
        if (puzzleState.every((val, idx) => val === idx)) {
            if (g2CurrentLevel < 3) {
                g2UnlockedLevel = Math.max(g2UnlockedLevel, g2CurrentLevel + 1);
                document.getElementById("g2-next-lvl-btn").classList.remove("hidden");
                document.getElementById("g2-win-text").textContent = `🎉 Hore! Level ${g2CurrentLevel} Berhasil Tersusun! Level ${g2CurrentLevel + 1} Terbuka!`;
            } else {
                document.getElementById("g2-next-lvl-btn").classList.add("hidden");
                document.getElementById("g2-win-text").textContent = `🏆 Horee! Pintar nya Cantikku ❤`;
            }
            document.getElementById("game-win-msg-2").classList.remove("hidden");
        }
    }
}

function nextPuzzleLevel() { if (g2CurrentLevel < 3) startPuzzleLevel(g2CurrentLevel + 1); }

/* ==================== GAME 3 ==================== */
function showG3LevelSelect() {
    document.getElementById("g3-level-select").classList.remove("hidden");
    document.getElementById("g3-arena").classList.add("hidden");
    updateG3LevelButtons();
}

function updateG3LevelButtons() {
    for (let i = 1; i <= 3; i++) {
        const btn = document.getElementById(`g3-btn-lvl${i}`);
        if (i <= g3UnlockedLevel) {
            btn.disabled = false; btn.className = "btn-level unlocked";
            btn.querySelector(".lvl-status").textContent = "🔓 Terbuka";
        } else {
            btn.disabled = true; btn.className = "btn-level locked";
            btn.querySelector(".lvl-status").textContent = "🔒 Terkunci";
        }
    }
}

function startScratchLevel(lvl) {
    g3CurrentLevel = lvl;
    document.getElementById("g3-level-select").classList.add("hidden");
    document.getElementById("g3-arena").classList.remove("hidden");
    document.getElementById("g3-current-level-title").textContent = `🎁 Gosok Foto - Level ${lvl}`;
    document.getElementById("scratch-img").src = scratchPhotos[lvl] || scratchPhotos[1];
    initScratchGame();
}

function initScratchGame() {
    const canvas = document.getElementById("scratch-canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    document.getElementById("game-win-msg-3").classList.add("hidden");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#2c3545";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ GOSOK DI SINI ✨", canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillStyle = "#8b949e";
    ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`Level ${g3CurrentLevel} • Usap Layar`, canvas.width / 2, canvas.height / 2 + 15);

    function scratch(e) {
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(clientX - rect.left, clientY - rect.top, 25, 0, Math.PI * 2);
        ctx.fill();
        checkScratchProgress(ctx, canvas);
    }

    canvas.onmousedown = (e) => { isScratching = true; scratch(e); };
    canvas.onmousemove = scratch;
    canvas.onmouseup = () => { isScratching = false; };
    canvas.ontouchstart = (e) => { isScratching = true; scratch(e); };
    canvas.ontouchmove = scratch;
    canvas.ontouchend = () => { isScratching = false; };
}

function checkScratchProgress(ctx, canvas) {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
    }

    if ((transparent / (pixels.length / 4)) * 100 > 45) {
        canvas.style.display = "none";
        if (g3CurrentLevel < 3) {
            g3UnlockedLevel = Math.max(g3UnlockedLevel, g3CurrentLevel + 1);
            document.getElementById("g3-next-lvl-btn").classList.remove("hidden");
            document.getElementById("g3-win-text").textContent = `💖 Foto Level ${g3CurrentLevel} Terungkap! Level ${g3CurrentLevel + 1} Terbuka!`;
        } else {
            document.getElementById("g3-next-lvl-btn").classList.add("hidden");
            document.getElementById("g3-win-text").textContent = `🏆 SURPRISE! Semua Foto Kita Berhasil Kamu Buka Sayang ❤️`;
        }
        document.getElementById("game-win-msg-3").classList.remove("hidden");
    }
}

function nextScratchLevel() { if (g3CurrentLevel < 3) startScratchLevel(g3CurrentLevel + 1); }

/* ==================== MODAL SURAT ==================== */
function openModal(id) {
    document.getElementById("modal-body").innerHTML = envelopeContents[id].replace(/\n/g, "<br>");
    document.getElementById("letter-modal").style.display = "flex";
}

function closeModal() { document.getElementById("letter-modal").style.display = "none"; }

window.addEventListener("click", (e) => {
    ["game-modal-1", "game-modal-2", "game-modal-3", "letter-modal"].forEach(id => {
        const el = document.getElementById(id);
        if (e.target === el) el.style.display = "none";
    });
});