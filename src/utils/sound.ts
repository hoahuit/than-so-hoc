// Web Audio API Synthesizer for Japanese Shrine & Omikuji SFX
// No external mp3 assets needed - 100% reliable and zero latency!

class ShrineAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Wooden sticks shaking inside hexagonal cylinder
  playBoxShake() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Multi-click rattling noise simulating bamboo sticks clattering
      for (let i = 0; i < 7; i++) {
        const timeOffset = now + i * 0.08 + Math.random() * 0.03;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180 + Math.random() * 260, timeOffset);
        osc.frequency.exponentialRampToValueAtTime(70 + Math.random() * 40, timeOffset + 0.06);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450 + Math.random() * 300, timeOffset);
        filter.Q.setValueAtTime(5, timeOffset);

        gain.gain.setValueAtTime(0.35, timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.07);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(timeOffset);
        osc.stop(timeOffset + 0.08);
      }
    } catch {
      // Audio might be blocked until user gesture
    }
  }

  // Single bamboo stick popping out with a crisp wooden 'thock'
  playStickSlide() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Sliding friction noise
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);

      // Wood impact click at end
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'sine';
      click.frequency.setValueAtTime(320, now + 0.18);
      click.frequency.exponentialRampToValueAtTime(100, now + 0.28);
      clickGain.gain.setValueAtTime(0.4, now + 0.18);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      click.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      click.start(now + 0.18);
      click.stop(now + 0.3);
    } catch {
      // Ignore
    }
  }

  // Kagura shrine bell chime (Suzu)
  playShrineBell() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7 harmonics

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.18 / (idx + 1), now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6 + idx * 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + 2.0);
      });
    } catch {
      // Ignore
    }
  }

  // Taiko drum boom for big fortunes
  playTaiko() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch {
      // Ignore
    }
  }

  // Magical card flip shimmer
  playCardFlip() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.07);

        gain.gain.setValueAtTime(0.15, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.45);
      });
    } catch {
      // Ignore
    }
  }
}

export const shrineAudio = new ShrineAudioEngine();
