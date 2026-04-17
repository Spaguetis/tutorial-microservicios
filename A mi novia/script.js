const card = document.getElementById("card");
const buttonZone = document.getElementById("buttonZone");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const successPanel = document.getElementById("successPanel");
const audioToggle = document.getElementById("audioToggle");

let escapes = 0;
let hasAudioUnlocked = false;
let yesHoverCooldown = false;
let activeMusicKey = "question";
let fadeInterval = null;

const initialMuted = localStorage.getItem("valentina-muted") === "true";

const soundState = {
  muted: initialMuted,
  phase: "question",
};

const audioFiles = {
  question: new Audio("assets/audio/bg-question.mp3"),
  yes: new Audio("assets/audio/bg-yes.mp3"),
  sfxNo: new Audio("assets/audio/sfx-no.mp3"),
  sfxYesHover: new Audio("assets/audio/sfx-yes-hover.mp3"),
  sfxYesConfirm: new Audio("assets/audio/sfx-yes-confirm.mp3"),
};

audioFiles.question.loop = true;
audioFiles.yes.loop = true;
audioFiles.question.preload = "auto";
audioFiles.yes.preload = "auto";
audioFiles.sfxNo.preload = "auto";
audioFiles.sfxYesHover.preload = "auto";
audioFiles.sfxYesConfirm.preload = "auto";
audioFiles.question.volume = 0;
audioFiles.yes.volume = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateAudioButton() {
  if (soundState.muted) {
    audioToggle.textContent = "Activar sonido";
    audioToggle.classList.remove("is-on");
    audioToggle.setAttribute("aria-pressed", "false");
    return;
  }

  audioToggle.textContent = "Sonido activo";
  audioToggle.classList.add("is-on");
  audioToggle.setAttribute("aria-pressed", "true");
}

function safePlay(audio, resetTime = false) {
  if (!audio) {
    return;
  }

  if (resetTime) {
    audio.currentTime = 0;
  }

  const promise = audio.play();
  if (promise && typeof promise.catch === "function") {
    promise.catch(() => {});
  }
}

function applyMutedState() {
  const bgVolume = soundState.muted ? 0 : 0.34;
  const fxVolume = soundState.muted ? 0 : 0.85;

  audioFiles.question.volume = activeMusicKey === "question" ? bgVolume : 0;
  audioFiles.yes.volume = activeMusicKey === "yes" ? bgVolume : 0;
  audioFiles.sfxNo.volume = fxVolume;
  audioFiles.sfxYesHover.volume = fxVolume;
  audioFiles.sfxYesConfirm.volume = fxVolume;
}

function crossfadeTo(nextKey, duration = 950) {
  if (!hasAudioUnlocked || soundState.muted) {
    activeMusicKey = nextKey;
    applyMutedState();
    return;
  }

  const fromTrack = audioFiles[activeMusicKey];
  const toTrack = audioFiles[nextKey];

  if (!toTrack) {
    return;
  }

  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }

  safePlay(toTrack);

  const startTime = performance.now();
  const fromStart = fromTrack ? fromTrack.volume : 0;
  const toStart = toTrack.volume;
  const targetVolume = 0.34;

  fadeInterval = setInterval(() => {
    const elapsed = performance.now() - startTime;
    const ratio = Math.min(elapsed / duration, 1);

    if (fromTrack) {
      fromTrack.volume = Math.max(0, fromStart * (1 - ratio));
    }
    toTrack.volume = toStart + (targetVolume - toStart) * ratio;

    if (ratio >= 1) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      if (fromTrack && fromTrack !== toTrack) {
        fromTrack.pause();
      }
      activeMusicKey = nextKey;
      applyMutedState();
    }
  }, 28);
}

function setMusicPhase(phase) {
  soundState.phase = phase;
  crossfadeTo(phase === "yes" ? "yes" : "question");
}

function setMuted(muted) {
  soundState.muted = muted;
  localStorage.setItem("valentina-muted", String(muted));
  updateAudioButton();
  applyMutedState();

  if (muted) {
    audioFiles.question.pause();
    audioFiles.yes.pause();
    return;
  }

  if (hasAudioUnlocked) {
    setMusicPhase(soundState.phase);
  }
}

function unlockAudio() {
  if (hasAudioUnlocked) {
    return;
  }

  hasAudioUnlocked = true;
  if (!soundState.muted) {
    setMusicPhase(soundState.phase);
  }
}

function playNoFx() {
  if (soundState.muted) {
    return;
  }
  safePlay(audioFiles.sfxNo, true);
}

function playYesHoverFx() {
  if (soundState.muted || yesHoverCooldown) {
    return;
  }

  yesHoverCooldown = true;
  safePlay(audioFiles.sfxYesHover, true);

  setTimeout(() => {
    yesHoverCooldown = false;
  }, 170);
}

function playYesConfirmFx() {
  if (soundState.muted) {
    return;
  }
  safePlay(audioFiles.sfxYesConfirm, true);
}

function moveNoButton() {
  const zoneRect = buttonZone.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = zoneRect.width - btnRect.width - 8;
  const maxY = zoneRect.height - btnRect.height - 8;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  const x = clamp(randomX, 6, maxX);
  const y = clamp(randomY, 0, maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  playNoFx();

  escapes += 1;

  if (escapes === 2) {
    hint.textContent = "Casi... pero ese No no coopera.";
  } else if (escapes === 4) {
    hint.textContent = "Ese boton sabe que contigo solo quiero amor bonito.";
  } else if (escapes >= 6) {
    hint.textContent = "El destino ya voto por el Si.";
  }
}

function showSuccess() {
  unlockAudio();
  playYesConfirmFx();
  setMusicPhase("yes");
  card.classList.add("hidden");
  successPanel.classList.remove("hidden");
}

audioToggle.addEventListener("click", () => {
  unlockAudio();
  setMuted(!soundState.muted);
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  unlockAudio();
  moveNoButton();
});

// Extra safety in case someone tries very fast clicks.
noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  unlockAudio();
  moveNoButton();
});

yesBtn.addEventListener("mouseenter", () => {
  unlockAudio();
  playYesHoverFx();
});

yesBtn.addEventListener("click", showSuccess);

["pointerdown", "keydown"].forEach((eventName) => {
  window.addEventListener(eventName, unlockAudio, { once: true });
});

updateAudioButton();
applyMutedState();

window.addEventListener("resize", () => {
  const zoneRect = buttonZone.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const left = parseFloat(noBtn.style.left || "0");
  const top = parseFloat(noBtn.style.top || "0");

  const maxX = Math.max(0, zoneRect.width - btnRect.width - 8);
  const maxY = Math.max(0, zoneRect.height - btnRect.height - 8);

  noBtn.style.left = `${clamp(left, 6, maxX)}px`;
  noBtn.style.top = `${clamp(top, 0, maxY)}px`;
});
