const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;

const player = { x: W / 2 - 20, y: H - 50, w: 40, h: 20, speed: 6 };
let blocks = [], keys = {}, state = "menu";
let score = 0, spawnTimer = 0, speedBase = 3, last = 0;
let best = 0;
try { best = Number(localStorage.getItem("neonDodgeBest")) || 0; } catch (e) {}

// ---------- Audio (Web Audio API, sin archivos) ----------
let audio;
function beep(freq, dur, type = "square", vol = 0.08) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator(), gain = audio.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
    osc.connect(gain); gain.connect(audio.destination);
    osc.start(); osc.stop(audio.currentTime + dur);
  } catch (e) {}
}

// ---------- Entrada ----------
addEventListener("keydown", e => {
  keys[e.code] = true;
  if (e.code === "Space") { e.preventDefault(); if (state !== "play") start(); }
});
addEventListener("keyup", e => keys[e.code] = false);

function touchMove(e) {
  const r = canvas.getBoundingClientRect();
  const x = (e.touches[0].clientX - r.left) * (W / r.width);
  player.x = Math.max(0, Math.min(W - player.w, x - player.w / 2));
}
canvas.addEventListener("touchstart", e => { if (state !== "play") start(); touchMove(e); });
canvas.addEventListener("touchmove", e => { e.preventDefault(); touchMove(e); }, { passive: false });

// ---------- Lógica ----------
function start() {
  blocks = []; score = 0; spawnTimer = 0; speedBase = 3;
  player.x = W / 2 - player.w / 2; state = "play";
  beep(660, 0.1, "sine");
}

function gameOver() {
  state = "over";
  beep(90, 0.5, "sawtooth", 0.15);
  if (score > best) {
    best = Math.floor(score);
    try { localStorage.setItem("neonDodgeBest", best); } catch (e) {}
  }
}

function hit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

let lastTick = 0;
function update(dt) {
  if (keys.ArrowLeft || keys.KeyA) player.x -= player.speed * dt;
  if (keys.ArrowRight || keys.KeyD) player.x += player.speed * dt;
  player.x = Math.max(0, Math.min(W - player.w, player.x));

  score += dt / 60;
  speedBase = 3 + score * 0.12;
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    const w = 25 + Math.random() * 45;
    blocks.push({ x: Math.random() * (W - w), y: -30, w, h: 25,
      vy: speedBase + Math.random() * 2 });
    spawnTimer = Math.max(12, 45 - score * 1.2);
  }
  for (const b of blocks) b.y += b.vy * dt;
  blocks = blocks.filter(b => b.y < H);

  for (const b of blocks) if (hit(player, b)) return gameOver();

  const tick = Math.floor(score);
  if (tick > lastTick && tick % 5 === 0) beep(880, 0.08, "triangle");
  lastTick = tick;
}

// ---------- Dibujo ----------
function glowRect(o, color) {
  ctx.shadowColor = color; ctx.shadowBlur = 14; ctx.fillStyle = color;
  ctx.fillRect(o.x, o.y, o.w, o.h); ctx.shadowBlur = 0;
}
function text(t, y, size, color = "#d8f9ff") {
  ctx.fillStyle = color; ctx.font = `${size}px "Courier New", monospace`;
  ctx.textAlign = "center"; ctx.fillText(t, W / 2, y);
}

function draw() {
  ctx.fillStyle = "#07070f"; ctx.fillRect(0, 0, W, H);
  glowRect(player, "#00f0ff");
  blocks.forEach(b => glowRect(b, "#ff2e97"));

  ctx.textAlign = "left"; ctx.fillStyle = "#d8f9ff"; ctx.font = '16px "Courier New"';
  ctx.fillText("Puntos: " + Math.floor(score), 10, 24);
  ctx.textAlign = "right"; ctx.fillText("Récord: " + best, W - 10, 24);

  if (state === "menu") { text("NEON DODGE", 260, 36, "#00f0ff"); text("Espacio o toca para jugar", 300, 16); }
  if (state === "over") {
    text("GAME OVER", 260, 36, "#ff2e97");
    text("Puntos: " + Math.floor(score), 300, 18);
    text("Espacio o toca para reiniciar", 335, 16);
  }
}

// ---------- Game loop ----------
function loop(t) {
  const dt = Math.min((t - last) / 16.67, 3);
  last = t;
  if (state === "play") update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);