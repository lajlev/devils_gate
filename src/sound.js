let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function ensureResumed() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
  return c;
}

export function playJump() {
  const c = ensureResumed();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(300, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.12);
  gain.gain.setValueAtTime(0.15, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.15);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.15);
}

export function playDoor() {
  const c = ensureResumed();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    const t = c.currentTime + i * 0.08;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.15);

    const osc2 = c.createOscillator();
    const gain2 = c.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, t);
    gain2.gain.setValueAtTime(0.06, t);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    osc2.connect(gain2).connect(c.destination);
    osc2.start(t);
    osc2.stop(t + 0.12);
  });
}

export function playFirework() {
  const c = ensureResumed();
  const bufferSize = c.sampleRate * 0.15;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(3000, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.15);
  filter.Q.value = 2;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.2, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.15);

  noise.connect(filter).connect(gain).connect(c.destination);
  noise.start(c.currentTime);

  const osc = c.createOscillator();
  const g2 = c.createGain();
  osc.type = 'sine';
  const sparkFreq = 1200 + Math.random() * 1600;
  osc.frequency.setValueAtTime(sparkFreq, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(sparkFreq * 0.3, c.currentTime + 0.12);
  g2.gain.setValueAtTime(0.08, c.currentTime);
  g2.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.12);
  osc.connect(g2).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.12);
}

export function playDeath() {
  const c = ensureResumed();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, c.currentTime + 0.5);
  gain.gain.setValueAtTime(0.12, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, c.currentTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.6);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.6);

  const osc2 = c.createOscillator();
  const g2 = c.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(200, c.currentTime + 0.1);
  osc2.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.6);
  g2.gain.setValueAtTime(0.06, c.currentTime + 0.1);
  g2.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.6);
  osc2.connect(g2).connect(c.destination);
  osc2.start(c.currentTime + 0.1);
  osc2.stop(c.currentTime + 0.6);
}

export function playKey() {
  const c = ensureResumed();
  [880, 1108, 1320].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    const t = c.currentTime + i * 0.06;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  });
}

// ── Soundtrack ──
// Catchy chiptune loop — 120 BPM, minor key, 8-bar loop
let musicNodes = null;

const BEAT = 0.5; // 120 BPM

// Melody: quirky minor pentatonic earworm
const MELODY = [
  [392, 1], [0, 0.5], [440, 0.5], [523, 1], [0, 0.5], [440, 0.5],
  [392, 0.5], [349, 0.5], [330, 1], [0, 1],
  [330, 1], [0, 0.5], [392, 0.5], [440, 1], [0, 0.5], [523, 0.5],
  [587, 0.5], [523, 0.5], [440, 1], [0, 1],
  [392, 1], [0, 0.5], [440, 0.5], [523, 1], [0, 0.5], [587, 0.5],
  [659, 0.5], [587, 0.5], [523, 0.5], [440, 0.5], [392, 1],
  [349, 0.5], [330, 0.5], [294, 1], [330, 1], [392, 1], [0, 1],
];

// Bass line: root notes, driving rhythm
const BASS = [
  [131, 1], [131, 0.5], [0, 0.5], [131, 0.5], [165, 0.5],
  [175, 1], [175, 0.5], [0, 0.5], [175, 0.5], [131, 0.5],
  [110, 1], [110, 0.5], [0, 0.5], [131, 0.5], [110, 0.5],
  [147, 1], [147, 0.5], [0, 0.5], [147, 0.5], [165, 0.5],
  [131, 1], [131, 0.5], [0, 0.5], [131, 0.5], [165, 0.5],
  [175, 1], [175, 0.5], [0, 0.5], [175, 0.5], [196, 0.5],
  [110, 1], [110, 0.5], [131, 0.5], [147, 1],
  [165, 1], [131, 0.5], [0, 0.5], [131, 1],
];

function scheduleTrack(c, masterGain, notes, type, volume, startTime) {
  let t = startTime;
  for (const [freq, dur] of notes) {
    const d = dur * BEAT;
    if (freq > 0) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(volume, t);
      gain.gain.setValueAtTime(volume, t + d * 0.7);
      gain.gain.linearRampToValueAtTime(0, t + d * 0.95);
      osc.connect(gain).connect(masterGain);
      osc.start(t);
      osc.stop(t + d);
    }
    t += d;
  }
  return t;
}

function getLoopDuration(notes) {
  let t = 0;
  for (const [, dur] of notes) t += dur * BEAT;
  return t;
}

export function startMusic() {
  if (musicNodes) return;
  const c = ensureResumed();

  const masterGain = c.createGain();
  masterGain.gain.value = 0.6;
  masterGain.connect(c.destination);

  const loopDur = Math.max(getLoopDuration(MELODY), getLoopDuration(BASS));
  let alive = true;

  function scheduleLoop(startTime) {
    if (!alive) return;
    scheduleTrack(c, masterGain, MELODY, 'square', 0.08, startTime);
    scheduleTrack(c, masterGain, BASS, 'triangle', 0.1, startTime);

    // Schedule next loop slightly before this one ends
    const nextTime = startTime + loopDur;
    const scheduleAhead = nextTime - c.currentTime - 0.5;
    if (scheduleAhead > 0) {
      setTimeout(() => scheduleLoop(nextTime), scheduleAhead * 1000);
    } else {
      scheduleLoop(nextTime);
    }
  }

  scheduleLoop(c.currentTime + 0.1);

  musicNodes = { masterGain, kill: () => { alive = false; } };
}

export function stopMusic() {
  if (!musicNodes) return;
  musicNodes.kill();
  musicNodes.masterGain.gain.exponentialRampToValueAtTime(0.01, getCtx().currentTime + 0.5);
  setTimeout(() => {
    musicNodes.masterGain.disconnect();
    musicNodes = null;
  }, 600);
}

export function setMusicVolume(v) {
  if (musicNodes) {
    musicNodes.masterGain.gain.setValueAtTime(v, getCtx().currentTime);
  }
}
