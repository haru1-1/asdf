class SoundManager {
  constructor() {
    this.bgmEnabled = true;
    this.sfxEnabled = true;
    this.ctx = null;
    this.bgmTimer = null;
    this.bgmAudio = null;
    this.noteIndex = 0;
    this.scale = [261.63, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  startBgm() {
    if (!this.bgmEnabled) return;
    if (CUSTOM_ASSETS.audio.bgm) {
      if (!this.bgmAudio) {
        this.bgmAudio = new Audio(CUSTOM_ASSETS.audio.bgm);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.35;
      }
      this.bgmAudio.play().catch(() => {});
      return;
    }

    this.initContext();
    if (this.bgmTimer || !this.ctx) return;

    this.bgmTimer = setInterval(() => {
      if (!this.bgmEnabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = this.scale[this.noteIndex % this.scale.length];
      this.noteIndex++;

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.72);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    }, 820);
  }

  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) this.startBgm();
    else this.stopBgm();
    return this.bgmEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  playClick() {
    if (!this.sfxEnabled) return;
    if (CUSTOM_ASSETS.audio.click) {
      new Audio(CUSTOM_ASSETS.audio.click).play().catch(() => {});
      return;
    }
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.08);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playBattle() {
    if (!this.sfxEnabled) return;
    if (CUSTOM_ASSETS.audio.battle) {
      new Audio(CUSTOM_ASSETS.audio.battle).play().catch(() => {});
      return;
    }
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [130, 95, 160].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.09, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.2);
    });
  }
}

const sound = new SoundManager();
