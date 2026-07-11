export const initAudio = () => {
  if (typeof window === 'undefined') return null;
  if (!window.audioCtx) {
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (window.audioCtx.state === 'suspended') {
    window.audioCtx.resume();
  }
  return window.audioCtx;
};

export const playPopSound = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';

    // Quick frequency drop for a "pop" or "bubble" sound
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    // Volume envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio failed", e);
  }
};

export const playWhooshSound = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;

    // Create white noise for a whoosh
    const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter to shape the noise into a wind "whoosh"
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.value = 1.0;

    bandpass.frequency.setValueAtTime(200, ctx.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
    bandpass.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    noise.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio failed", e);
  }
};

export const playClickSound = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'square';

    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.error("Audio failed", e);
  }
};

export const playWaterFillSound = (durationMs = 2000) => {
  try {
    const ctx = initAudio();
    if (!ctx) return null;

    const duration = durationMs / 1000;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 800;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.value = 8.0;

    bandpass.frequency.setValueAtTime(250, ctx.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + duration);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(lowpass);
    lowpass.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();

    return {
      stop: () => {
        try {
          gainNode.gain.cancelScheduledValues(ctx.currentTime);
          gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          noise.stop(ctx.currentTime + 0.1);
        } catch (e) { }
      }
    };
  } catch (e) {
    console.error("Audio failed", e);
    return null;
  }
};


