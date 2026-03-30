const canvas = document.getElementById('garden');
const ctx = canvas.getContext('2d');
const song = document.getElementById('song');
const startBtn = document.getElementById('startBtn');
const intro = document.getElementById('intro');

let width = 0;
let height = 0;
let running = false;
let frame = 0;
let fadeTimer = null;
let bloomProgress = 0;

const stems = [];
const fallingPetals = [];
const fireflies = [];
const particles = [];

const pointerTarget = { x: 0, y: 0 };
const pointerCurrent = { x: 0, y: 0 };

const MAX_VOLUME = 1;
const FADE_IN_DURATION_MS = 3000;
const FADE_TICK_MS = 80;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function clearFadeTimer() {
  if (fadeTimer !== null) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
}

function fadeInSong(duration = FADE_IN_DURATION_MS) {
  clearFadeTimer();
  song.volume = 0.04;

  const steps = Math.max(1, Math.floor(duration / FADE_TICK_MS));
  const increment = (MAX_VOLUME - song.volume) / steps;

  fadeTimer = setInterval(() => {
    const nextVolume = Math.min(MAX_VOLUME, song.volume + increment);
    song.volume = nextVolume;
    if (nextVolume >= MAX_VOLUME) {
      clearFadeTimer();
    }
  }, FADE_TICK_MS);
}

function setPointerFromClient(clientX, clientY) {
  const nx = clientX / Math.max(1, width);
  const ny = clientY / Math.max(1, height);
  pointerTarget.x = (nx - 0.5) * 2;
  pointerTarget.y = (ny - 0.5) * 2;
  document.documentElement.style.setProperty('--mx', `${nx}`);
  document.documentElement.style.setProperty('--my', `${ny}`);
}

function makeStem(index, total) {
  const spread = index / Math.max(1, total - 1);
  const baseX = width * 0.12 + spread * width * 0.76 + randomBetween(-26, 26);
  const baseY = height + randomBetween(30, 120);
  const topY = randomBetween(height * 0.28, height * 0.68);

  return {
    baseX,
    baseY,
    controlX: baseX + randomBetween(-120, 120),
    topY,
    topOffset: randomBetween(-14, 14),
    swayAmp: randomBetween(14, 34),
    swaySpeed: randomBetween(0.009, 0.016),
    phase: randomBetween(0, Math.PI * 2),
    width: randomBetween(2.2, 4.1),
    bloomDelay: randomBetween(0.04, 0.72),
    petals: Math.floor(randomBetween(8, 13)),
    bloomSize: randomBetween(22, 40),
    hue: randomBetween(280, 350),
    centerHue: randomBetween(34, 54),
    leaves: [
      { t: randomBetween(0.36, 0.48), side: Math.random() > 0.5 ? 1 : -1, size: randomBetween(12, 18) },
      { t: randomBetween(0.56, 0.78), side: Math.random() > 0.5 ? 1 : -1, size: randomBetween(15, 22) }
    ]
  };
}

function buildGarden() {
  stems.length = 0;
  fallingPetals.length = 0;
  fireflies.length = 0;

  const stemCount = Math.max(18, Math.floor(width / 60));
  for (let i = 0; i < stemCount; i += 1) {
    stems.push(makeStem(i, stemCount));
  }

  const lightCount = Math.max(16, Math.floor(width / 80));
  for (let i = 0; i < lightCount; i += 1) {
    fireflies.push({
      x: randomBetween(0, width),
      y: randomBetween(height * 0.08, height * 0.84),
      size: randomBetween(1.2, 2.9),
      phase: randomBetween(0, Math.PI * 2),
      speed: randomBetween(0.005, 0.014),
      hue: randomBetween(40, 70)
    });
  }

  particles.length = 0;
  const particleCount = Math.max(120, Math.floor((width * height) / 6500));
  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      r: randomBetween(0.4, 2.2),
      hue: randomBetween(260, 360),
      alpha: randomBetween(0.18, 0.72),
      phase: randomBetween(0, Math.PI * 2),
      driftX: randomBetween(-0.12, 0.12),
      driftY: randomBetween(-0.06, 0.06),
      twinkleSpeed: randomBetween(0.012, 0.038),
      depth: randomBetween(0.2, 1.0)
    });
  }
}

function quadraticPoint(p0, p1, p2, t) {
  const k = 1 - t;
  return {
    x: k * k * p0.x + 2 * k * t * p1.x + t * t * p2.x,
    y: k * k * p0.y + 2 * k * t * p1.y + t * t * p2.y
  };
}

function quadraticTangent(p0, p1, p2, t) {
  return {
    x: 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x),
    y: 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
  };
}

function drawBackground() {
  const pulse = 0.2 + (Math.sin(frame * 0.01) + 1) * 0.06;
  const glowX = width * 0.5 + pointerCurrent.x * 90;
  const glowY = height * 0.52 + pointerCurrent.y * 60;

  const glow = ctx.createRadialGradient(glowX, glowY, 40, glowX, glowY, Math.max(width, height) * 0.78);
  glow.addColorStop(0, `rgba(255, 99, 206, ${0.18 + pulse})`);
  glow.addColorStop(0.35, `rgba(83, 200, 255, ${0.08 + pulse * 0.5})`);
  glow.addColorStop(0.68, `rgba(136, 105, 255, ${0.07 + pulse * 0.45})`);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const ground = ctx.createLinearGradient(0, height * 0.62, 0, height);
  ground.addColorStop(0, 'rgba(7, 22, 26, 0)');
  ground.addColorStop(1, 'rgba(4, 14, 16, 0.78)');
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, width, height);
}

function drawParticles() {
  for (const p of particles) {
    p.x += p.driftX + pointerCurrent.x * p.depth * 1.8;
    p.y += p.driftY + pointerCurrent.y * p.depth * 1.2;
    if (p.x < -4) p.x = width + 4;
    if (p.x > width + 4) p.x = -4;
    if (p.y < -4) p.y = height + 4;
    if (p.y > height + 4) p.y = -4;
    const twinkle = p.alpha * (0.5 + (Math.sin(frame * p.twinkleSpeed + p.phase) + 1) * 0.28);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 82%, ${twinkle})`;
    ctx.fill();
    if (p.r > 1.1) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${twinkle * 0.18})`;
      ctx.fill();
    }
  }
}

function drawFireflies() {
  for (const light of fireflies) {
    const driftX = Math.sin(frame * light.speed + light.phase) * 10;
    const driftY = Math.cos(frame * light.speed * 1.15 + light.phase) * 7;
    const twinkle = 0.35 + ((Math.sin(frame * 0.04 + light.phase) + 1) * 0.5);
    const x = light.x + driftX + pointerCurrent.x * 8;
    const y = light.y + driftY + pointerCurrent.y * 6;

    ctx.fillStyle = `hsla(${light.hue}, 95%, 75%, ${twinkle * 0.85})`;
    ctx.beginPath();
    ctx.arc(x, y, light.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLeaf(point, angle, leaf, sway) {
  const side = leaf.side;
  const leafAngle = angle + side * (0.8 + sway * 0.004);

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(leafAngle);

  const grad = ctx.createLinearGradient(0, 0, leaf.size * 1.4, 0);
  grad.addColorStop(0, 'rgba(98, 255, 196, 0.74)');
  grad.addColorStop(1, 'rgba(29, 172, 106, 0.28)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(leaf.size * 0.4, -leaf.size * 0.55, leaf.size * 1.35, 0);
  ctx.quadraticCurveTo(leaf.size * 0.4, leaf.size * 0.55, 0, 0);
  ctx.fill();
  ctx.restore();
}

function drawBloom(headX, headY, stem, open) {
  if (open <= 0) return;

  const baseSize = stem.bloomSize;
  const slowSpin = frame * 0.0015 + stem.phase;

  // --- BUD STAGE (open 0 → 0.3) ---
  if (open < 0.3) {
    const t = open / 0.3;
    const budH = baseSize * (0.5 + t * 0.5);
    const budW = baseSize * (0.22 + t * 0.14);

    ctx.save();
    ctx.translate(headX, headY);

    // 5 green sepals
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI;
      const sg = ctx.createLinearGradient(0, 0, Math.cos(a) * budW * 1.1, -budH * 0.5);
      sg.addColorStop(0, 'rgba(50, 175, 85, 0.92)');
      sg.addColorStop(1, 'rgba(85, 225, 130, 0.3)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(Math.cos(a) * budW * 1.7, -budH * 0.26, 0, -budH * 0.6);
      ctx.fill();
    }

    // Wrapped bud petals
    const budGrad = ctx.createLinearGradient(0, 0, 0, -budH);
    budGrad.addColorStop(0,   `hsla(${stem.hue}, 88%, 48%, 0.92)`);
    budGrad.addColorStop(0.5, `hsla(${(stem.hue + 14) % 360}, 92%, 70%, 0.88)`);
    budGrad.addColorStop(1,   `hsla(${(stem.hue + 26) % 360}, 95%, 82%, 0.62)`);
    ctx.fillStyle = budGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo( budW * 1.1, -budH * 0.28,  budW * 0.98, -budH * 0.88, 0, -budH);
    ctx.bezierCurveTo(-budW * 0.98, -budH * 0.88, -budW * 1.1, -budH * 0.28, 0,  0);
    ctx.fill();

    ctx.restore();
    return;
  }

  // --- OPEN STAGE — 3 rings unfurling one after another ---
  const openFull = Math.min(1, (open - 0.3) / 0.7);

  const rings = [
    { count: stem.petals,                  lenRatio: 1.0,  widRatio: 0.58, openAt: 0.0,  hueShift:  0, alphaBase: 0.80, tiltMax: 0.42 },
    { count: Math.max(5, stem.petals - 2), lenRatio: 0.71, widRatio: 0.52, openAt: 0.26, hueShift: 18, alphaBase: 0.88, tiltMax: 0.62 },
    { count: Math.max(4, stem.petals - 4), lenRatio: 0.46, widRatio: 0.44, openAt: 0.56, hueShift: 32, alphaBase: 0.95, tiltMax: 0.82 },
  ];

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(slowSpin);

  for (const ring of rings) {
    const ringProgress = Math.max(0, Math.min(1, (openFull - ring.openAt) / 0.46));
    if (ringProgress <= 0) continue;

    const petalLen = baseSize * ring.lenRatio * (0.22 + ringProgress * 0.78);
    const petalW   = petalLen * ring.widRatio;
    const scaleY   = 1 - ring.tiltMax * (1 - ringProgress) * 0.5;

    for (let i = 0; i < ring.count; i++) {
      const wobble   = Math.sin(frame * 0.018 + i * 1.7 + stem.phase) * 0.024 * ringProgress;
      const angle    = ((Math.PI * 2) / ring.count) * i + wobble;
      const petalHue = (stem.hue + (i / ring.count) * 20 + ring.hueShift + frame * 0.04) % 360;

      ctx.save();
      ctx.rotate(angle);
      ctx.scale(1, scaleY);

      // Petal gradient: rich at base, luminous at tip
      const pg = ctx.createLinearGradient(0, 0, 0, -petalLen);
      pg.addColorStop(0,    `hsla(${petalHue}, 86%, 46%, ${ring.alphaBase})`);
      pg.addColorStop(0.4,  `hsla(${(petalHue + 14) % 360}, 90%, 66%, ${ring.alphaBase * 0.94})`);
      pg.addColorStop(1,    `hsla(${(petalHue + 28) % 360}, 88%, 82%, ${ring.alphaBase * 0.56})`);
      ctx.fillStyle = pg;

      // Rose petal: wide rounded sides + subtle heart notch at tip
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo( petalW * 0.92,  -petalLen * 0.17,  petalW * 1.02,  -petalLen * 0.70,  petalW * 0.26,  -petalLen        );
      ctx.bezierCurveTo( petalW * 0.10,  -petalLen * 1.07,  0,              -petalLen * 1.03,  0,              -petalLen * 0.96 );
      ctx.bezierCurveTo( 0,              -petalLen * 1.03, -petalW * 0.10,  -petalLen * 1.07, -petalW * 0.26,  -petalLen        );
      ctx.bezierCurveTo(-petalW * 1.02,  -petalLen * 0.70, -petalW * 0.92,  -petalLen * 0.17,  0,               0               );
      ctx.fill();

      // Midrib vein
      if (ringProgress > 0.42) {
        ctx.strokeStyle = `hsla(${petalHue}, 65%, 92%, ${0.20 * ringProgress})`;
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(0, -petalLen * 0.52, 0, -petalLen * 0.88);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Stamens — fade in once inner ring opens
  const stamenOpen = Math.max(0, Math.min(1, (openFull - 0.54) / 0.34));
  if (stamenOpen > 0) {
    const stamenCount = 12;
    const stamenR    = baseSize * 0.20 * stamenOpen;
    for (let i = 0; i < stamenCount; i++) {
      const a  = (i / stamenCount) * Math.PI * 2 + Math.sin(frame * 0.008 + i) * 0.06;
      const sx = Math.cos(a) * stamenR * 0.5;
      const sy = Math.sin(a) * stamenR * 0.5;
      ctx.strokeStyle = `hsla(${stem.centerHue + 8}, 82%, 76%, ${0.62 * stamenOpen})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(sx * 0.2, sy * 0.2);
      ctx.lineTo(sx, sy - stamenR);
      ctx.stroke();
      ctx.fillStyle = `hsla(${stem.centerHue - 4}, 100%, 90%, ${0.88 * stamenOpen})`;
      ctx.beginPath();
      ctx.arc(sx, sy - stamenR, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    const discR = Math.max(2, baseSize * 0.10 * stamenOpen);
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, discR);
    cg.addColorStop(0, `hsla(${stem.centerHue}, 100%, 94%, 0.98)`);
    cg.addColorStop(1, `hsla(${stem.centerHue - 12}, 95%, 58%, 0.48)`);
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(0, 0, discR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawStem(stem) {
  const sway = Math.sin(frame * stem.swaySpeed + stem.phase) * stem.swayAmp + pointerCurrent.x * 22;
  const p0 = { x: stem.baseX, y: stem.baseY };
  const p1 = { x: stem.controlX + sway * 0.72, y: (stem.baseY + stem.topY) * 0.5 };
  const p2 = {
    x: stem.baseX + stem.topOffset + sway,
    y: stem.topY + pointerCurrent.y * 10
  };

  const stemGrad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
  stemGrad.addColorStop(0, 'rgba(44, 157, 101, 0.34)');
  stemGrad.addColorStop(0.6, 'rgba(89, 236, 165, 0.78)');
  stemGrad.addColorStop(1, 'rgba(133, 255, 207, 0.5)');

  ctx.strokeStyle = stemGrad;
  ctx.lineWidth = stem.width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
  ctx.stroke();

  for (const leaf of stem.leaves) {
    const point = quadraticPoint(p0, p1, p2, leaf.t);
    const tangent = quadraticTangent(p0, p1, p2, leaf.t);
    const angle = Math.atan2(tangent.y, tangent.x);
    drawLeaf(point, angle, leaf, sway);
  }

  const open = Math.max(0, Math.min(1, (bloomProgress - stem.bloomDelay) * 1.1));
  drawBloom(p2.x, p2.y, stem, open);

  if (running && open > 0.55 && fallingPetals.length < 45 && Math.random() < 0.008) {
    fallingPetals.push({
      x: p2.x,
      y: p2.y,
      vx: randomBetween(-0.7, 0.7),
      vy: randomBetween(0.8, 1.8),
      spin: randomBetween(-0.05, 0.05),
      angle: randomBetween(0, Math.PI * 2),
      size: randomBetween(6, 12),
      hue: stem.hue + randomBetween(-15, 15),
      alpha: randomBetween(0.45, 0.86)
    });
  }
}

function drawFallingPetals() {
  for (let i = fallingPetals.length - 1; i >= 0; i -= 1) {
    const petal = fallingPetals[i];
    petal.vx += Math.sin(frame * 0.02 + petal.angle) * 0.002;
    petal.x += petal.vx + pointerCurrent.x * 0.16;
    petal.y += petal.vy;
    petal.angle += petal.spin;

    if (petal.y > height + 20 || petal.x < -40 || petal.x > width + 40) {
      fallingPetals.splice(i, 1);
      continue;
    }

    const grad = ctx.createLinearGradient(0, -petal.size, 0, petal.size);
    grad.addColorStop(0, `hsla(${petal.hue % 360}, 95%, 78%, ${petal.alpha})`);
    grad.addColorStop(1, `hsla(${(petal.hue + 18) % 360}, 90%, 60%, ${petal.alpha * 0.62})`);

    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.angle);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -petal.size);
    ctx.bezierCurveTo(petal.size * 0.7, -petal.size * 0.52, petal.size * 0.68, petal.size * 0.62, 0, petal.size);
    ctx.bezierCurveTo(-petal.size * 0.68, petal.size * 0.62, -petal.size * 0.7, -petal.size * 0.52, 0, -petal.size);
    ctx.fill();
    ctx.restore();
  }
}

function drawBackground() {
  const pulse = 0.2 + (Math.sin(frame * 0.01) + 1) * 0.06;
  const glowX = width * 0.5 + pointerCurrent.x * 90;
  const glowY = height * 0.52 + pointerCurrent.y * 60;

  const glow = ctx.createRadialGradient(glowX, glowY, 40, glowX, glowY, Math.max(width, height) * 0.78);
  glow.addColorStop(0, `rgba(255, 99, 206, ${0.18 + pulse})`);
  glow.addColorStop(0.35, `rgba(83, 200, 255, ${0.08 + pulse * 0.5})`);
  glow.addColorStop(0.68, `rgba(136, 105, 255, ${0.07 + pulse * 0.45})`);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const ground = ctx.createLinearGradient(0, height * 0.62, 0, height);
  ground.addColorStop(0, 'rgba(7, 22, 26, 0)');
  ground.addColorStop(1, 'rgba(4, 14, 16, 0.78)');
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, width, height);
}

function drawFrame() {
  frame += 1;
  pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.055;
  pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.055;

  if (running) {
    bloomProgress = Math.min(1, bloomProgress + 0.0026);
  }

  ctx.clearRect(0, 0, width, height);
  drawBackground();
  drawParticles();
  drawFireflies();

  for (const stem of stems) {
    drawStem(stem);
  }

  drawFallingPetals();
}

function animate() {
  drawFrame();
  requestAnimationFrame(animate);
}

async function startExperience() {
  if (running) {
    return;
  }

  running = true;
  intro.classList.add('hidden');
  setTimeout(() => {
    intro.style.display = 'none';
  }, 560);

  try {
    await song.play();
    fadeInSong();
  } catch (error) {
    console.warn('No se pudo reproducir el audio automaticamente.', error);
  }
}

window.addEventListener('resize', () => {
  resizeCanvas();
  buildGarden();
});

window.addEventListener('mousemove', (event) => {
  setPointerFromClient(event.clientX, event.clientY);
});

window.addEventListener('mouseleave', () => {
  pointerTarget.x = 0;
  pointerTarget.y = 0;
  document.documentElement.style.setProperty('--mx', '0.5');
  document.documentElement.style.setProperty('--my', '0.5');
});

window.addEventListener(
  'touchmove',
  (event) => {
    if (event.touches.length > 0) {
      setPointerFromClient(event.touches[0].clientX, event.touches[0].clientY);
    }
  },
  { passive: true }
);

startBtn.addEventListener('click', startExperience);

resizeCanvas();
buildGarden();
animate();
