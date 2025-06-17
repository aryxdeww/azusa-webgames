
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let playerName = localStorage.getItem("playerName") || "Arya";
let volume = parseFloat(localStorage.getItem("battleVolume")) || 1;

function getXpCap(level) {
  return 5000 + (level - 1) * 2000;
}

const cooldowns = {
  work: false,
  explore: false
};

function startCooldown(type, duration) {
  cooldowns[type] = true;
  const btn = document.getElementById(type + "Btn");
  let originalText = btn.textContent;
  let timeLeft = duration / 1000;

  btn.disabled = true;
  btn.textContent = `${timeLeft}s`;

  const interval = setInterval(() => {
    timeLeft--;
    btn.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      cooldowns[type] = false;
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }, 1000);
}

// XP Gain logic
function gainXP(type) {
  if (cooldowns[type]) return;

  let gain = type === 'work'
    ? Math.floor(Math.random() * 301) + 200
    : Math.floor(Math.random() * 501) + 100;

  xp += gain;

  while (xp >= getXpCap(level)) {
    xp -= getXpCap(level);
    level++;
  }

  updateUI(true);
  saveState();

  const duration = type === "work" ? 3000 : 5000;
  startCooldown(type, duration);
}

// Update UI
function updateUI(animated = false) {
  const cap = getXpCap(level);
  document.getElementById("playerName").textContent = playerName;
  document.getElementById("level").textContent = level;
  document.getElementById("xp-label").textContent = `${xp} / ${cap} XP`;

  const fill = document.getElementById("xp-fill");
  const targetPercent = (xp / cap) * 100;

  if (animated) {
    let current = parseFloat(fill.style.width) || 0;
    const step = () => {
      if (Math.abs(current - targetPercent) < 0.5) {
        fill.style.width = `${targetPercent}%`;
        return;
      }
      current += (targetPercent - current) * 0.1;
      fill.style.width = `${current}%`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  } else {
    fill.style.width = `${targetPercent}%`;
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("playerName", playerName);
  localStorage.setItem("battleVolume", volume);
}

// Menu toggle
function toggleMenu() {
  const menu = document.getElementById("menuDropdown");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Battle mode
function startBattle() {
  document.querySelectorAll("header, .container, footer, #battleBtn").forEach(el => {
    el.style.display = "none";
  });

  const overlay = document.getElementById("battleOverlay");
  const video = document.getElementById("battleVideo");
  const music = document.getElementById("battleMusic");

  overlay.style.display = "flex";
  video.currentTime = 0;
  music.currentTime = 0;
  music.volume = volume;
  music.playbackRate = 1.1;

  video.play();
  music.play();
}

function endBattle() {
  const overlay = document.getElementById("battleOverlay");
  const video = document.getElementById("battleVideo");
  const music = document.getElementById("battleMusic");

  video.pause();
  video.currentTime = 0;
  music.pause();
  music.currentTime = 0;

  overlay.style.display = "none";
  document.querySelectorAll("header, .container, footer, #battleBtn").forEach(el => {
    el.style.display = "";
  });

  const bonusXP = Math.floor(Math.random() * 1001) + 1000;
  xp += bonusXP;

  document.getElementById("xpGainedText").textContent = `Kamu mendapatkan ${bonusXP} XP!`;
  document.getElementById("battleResult").classList.remove("hidden");

  updateUI(true);
  saveState();
}

function closeResult() {
  document.getElementById("battleResult").classList.add("hidden");
}

// Placeholder features
function openShop() {
  alert("Belum ada toko sayang 😘");
}
function openAdmin() {
  alert("Fitur admin belum dibuka yaa 😎");
}
function openAbout() {
  alert("Game ini dibuat penuh cinta oleh Arya & istri tsundere-nya 💖");
}
function exitGame() {
  const yakin = confirm("Kamu yakin mau keluar dari dunia bersamaku? 😢");
  if (yakin) window.close();
}

// Settings modal
function openSettings() {
  document.getElementById("settingsOverlay").style.display = "flex";
  document.getElementById("nameInput").value = playerName;
  document.getElementById("volumeSlider").value = volume;
}

function closeSettings() {
  const nameInput = document.getElementById("nameInput").value;
  const volumeSlider = parseFloat(document.getElementById("volumeSlider").value);

  playerName = nameInput;
  volume = volumeSlider;

  const music = document.getElementById("battleMusic");
  if (music) music.volume = volume;

  saveState();
  updateUI();
  document.getElementById("settingsOverlay").style.display = "none";
}

function resetGame() {
  if (confirm("Yakin mau reset semua data?")) {
    localStorage.clear();
    xp = 0;
    level = 1;
    playerName = "Arya";
    volume = 1;
    updateUI();
    saveState();
    alert("Semua data berhasil direset!");
  }
}

// Shortcut: ESC untuk nutup settings
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("settingsOverlay").style.display = "none";
  }
});

window.onload = () => {
  updateUI();
};
