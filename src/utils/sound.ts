// Web Audio API Synthesizer for Japanese Shrine & Omikuji SFX
// No external mp3 assets needed - 100% reliable and zero latency!

class ShrineAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  // ===== BACKGROUND MUSIC STATE =====
  public bgMusicPlaying: boolean = false;
  private bgMusicScheduler: ReturnType<typeof setTimeout> | null = null;
  private bgMasterGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // iOS Safari / Chrome mobile unlock trick
  public async unlock(): Promise<boolean> {
    this.initCtx();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }
    try {
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);
    } catch {
      // ignore
    }
    return this.ctx.state === 'running';
  }

  // ===== AMBIENT JAPANESE BACKGROUND MUSIC =====
  // Generates a looping lofi ambient track with koto-like plucks, shakuhachi pads, and gentle rain
  async startBackgroundMusic(): Promise<boolean> {
    if (this.bgMusicPlaying) {
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.unlock();
      }
      return true;
    }
    await this.unlock();
    if (!this.ctx) return false;

    this.bgMusicPlaying = true;
    const ctx = this.ctx;

    // Master gain for bg music
    this.bgMasterGain = ctx.createGain();
    this.bgMasterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.bgMasterGain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 2.5);
    this.bgMasterGain.connect(ctx.destination);

    // Add gentle reverb (convolver simulation via feedback delay)
    const delay = ctx.createDelay(0.6);
    const delayGain = ctx.createGain();
    delay.delayTime.setValueAtTime(0.42, ctx.currentTime);
    delayGain.gain.setValueAtTime(0.28, ctx.currentTime);
    delay.connect(delayGain);
    delayGain.connect(delay);
    delayGain.connect(this.bgMasterGain);

    // Low-pass filter for warmth
    const warmFilter = ctx.createBiquadFilter();
    warmFilter.type = 'lowpass';
    warmFilter.frequency.setValueAtTime(2200, ctx.currentTime);
    warmFilter.Q.setValueAtTime(0.7, ctx.currentTime);
    warmFilter.connect(delay);
    warmFilter.connect(this.bgMasterGain);

    // === WIND PAD (drone) ===
    const windDrone = () => {
      if (!this.bgMusicPlaying || !this.ctx || !this.bgMasterGain) return;
      const c = this.ctx;
      const osc1 = c.createOscillator();
      const osc2 = c.createOscillator();
      const g = c.createGain();
      const f = c.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(600, c.currentTime);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(130.81, c.currentTime); // C3
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(196.00, c.currentTime); // G3
      g.gain.setValueAtTime(0, c.currentTime);
      g.gain.linearRampToValueAtTime(0.07, c.currentTime + 1.5);
      g.gain.setValueAtTime(0.07, c.currentTime + 5);
      g.gain.linearRampToValueAtTime(0, c.currentTime + 7);
      osc1.connect(f); osc2.connect(f); f.connect(g); g.connect(this.bgMasterGain);
      osc1.start(c.currentTime); osc1.stop(c.currentTime + 7.5);
      osc2.start(c.currentTime); osc2.stop(c.currentTime + 7.5);
    };

    // === KOTO-LIKE PLUCK ===
    const kotoNote = (freq: number, time: number, vol = 0.12) => {
      if (!this.bgMusicPlaying || !this.ctx || !this.bgMasterGain) return;
      const c = this.ctx;
      const osc = c.createOscillator();
      const osc2 = c.createOscillator();
      const g = c.createGain();
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.setValueAtTime(freq * 2.5, time);
      f.Q.setValueAtTime(3, time);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.995, time + 0.08);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, time);
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(vol, time + 0.005);
      g.gain.exponentialRampToValueAtTime(vol * 0.3, time + 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 1.4);
      osc.connect(f); osc2.connect(f); f.connect(g); g.connect(warmFilter);
      osc.start(time); osc.stop(time + 1.6);
      osc2.start(time); osc2.stop(time + 1.6);
    };

    // === SHAKUHACHI-LIKE BREATHY TONE ===
    const shakuNote = (freq: number, time: number, dur = 2.5) => {
      if (!this.bgMusicPlaying || !this.ctx || !this.bgMasterGain) return;
      const c = this.ctx;
      const osc = c.createOscillator();
      const noise = c.createOscillator();
      const g = c.createGain();
      const nGain = c.createGain();
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.setValueAtTime(freq, time);
      f.Q.setValueAtTime(8, time);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.98, time);
      osc.frequency.linearRampToValueAtTime(freq, time + 0.3);
      noise.type = 'triangle';
      noise.frequency.setValueAtTime(freq * 1.5 + Math.random() * 20, time);
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.055, time + 0.4);
      g.gain.setValueAtTime(0.055, time + dur - 0.5);
      g.gain.linearRampToValueAtTime(0, time + dur);
      nGain.gain.setValueAtTime(0.015, time);
      osc.connect(g); noise.connect(f); f.connect(nGain);
      g.connect(this.bgMasterGain); nGain.connect(this.bgMasterGain);
      osc.start(time); osc.stop(time + dur + 0.1);
      noise.start(time); noise.stop(time + dur + 0.1);
    };

    // === GENTLE RAIN NOISE ===
    const rainNode = () => {
      if (!this.bgMusicPlaying || !this.ctx || !this.bgMasterGain) return;
      const c = this.ctx;
      // Simulate rain with filtered noise via many triangle oscillators
      for (let i = 0; i < 4; i++) {
        const osc = c.createOscillator();
        const g = c.createGain();
        const f = c.createBiquadFilter();
        const startT = c.currentTime + i * 0.1;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2000 + Math.random() * 3000, startT);
        f.type = 'bandpass';
        f.frequency.setValueAtTime(3000 + Math.random() * 2000, startT);
        f.Q.setValueAtTime(0.5, startT);
        g.gain.setValueAtTime(0.004, startT);
        osc.connect(f); f.connect(g); g.connect(this.bgMasterGain);
        osc.start(startT); osc.stop(startT + 3.5);
      }
    };

    // Japanese pentatonic scale: C D E G A (C4=261.63, D4=293.66, E4=329.63, G4=392, A4=440)
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

    // Compose a looping phrase
    const playPhrase = () => {
      if (!this.bgMusicPlaying || !this.ctx) return;
      const c = this.ctx;
      const now = c.currentTime;

      windDrone();

      // Koto melody line (pentatonic motif)
      const melody = [4, 5, 3, 6, 4, 2, 5, 3]; // indices into pentatonic
      const rhythm = [0, 0.65, 1.1, 1.8, 2.6, 3.4, 4.2, 5.0]; // beat offsets
      melody.forEach((noteIdx, i) => {
        kotoNote(pentatonic[noteIdx], now + rhythm[i], 0.09 + Math.random() * 0.04);
      });

      // Bass koto notes
      kotoNote(130.81, now + 0.0, 0.06);  // C2
      kotoNote(130.81, now + 1.8, 0.06);
      kotoNote(98.00,  now + 3.6, 0.05);  // G2

      // Shakuhachi phrases
      shakuNote(392.00, now + 0.5, 2.8);
      shakuNote(329.63, now + 4.2, 2.2);

      // Rain sprinkles
      rainNode();
      this.bgMusicScheduler = setTimeout(() => {
        if (this.bgMusicPlaying) playPhrase();
      }, 7200);
    };

    playPhrase();
    return true;
  }

  stopBackgroundMusic() {
    if (!this.bgMusicPlaying) return;
    this.bgMusicPlaying = false;
    if (this.bgMusicScheduler) {
      clearTimeout(this.bgMusicScheduler);
      this.bgMusicScheduler = null;
    }
    if (this.bgMasterGain && this.ctx) {
      this.bgMasterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
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
