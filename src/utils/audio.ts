// Web Audio API ambient runway generator and UI haptics

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private isDronePlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAtmosphere();
    } else {
      this.startAtmosphere();
    }
    return !this.isMuted;
  }

  public getIsActive(): boolean {
    return !this.isMuted;
  }

  public startAtmosphere() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted || this.isDronePlaying) return;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.04, this.ctx.currentTime);
      master.connect(this.ctx.destination);

      // Dark sub-bass drone
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      const filter1 = this.ctx.createBiquadFilter();
      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(160, this.ctx.currentTime);

      osc1.connect(filter1);
      filter1.connect(master);
      osc1.start();
      this.droneOsc1 = osc1;

      // Ethereal fifth harmonic
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(82.4, this.ctx.currentTime); // E2 note

      const filter2 = this.ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(220, this.ctx.currentTime);

      osc2.connect(filter2);
      filter2.connect(master);
      osc2.start();
      this.droneOsc2 = osc2;

      this.isDronePlaying = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAtmosphere() {
    if (this.droneOsc1) {
      try { this.droneOsc1.stop(); this.droneOsc1.disconnect(); } catch {}
      this.droneOsc1 = null;
    }
    if (this.droneOsc2) {
      try { this.droneOsc2.stop(); this.droneOsc2.disconnect(); } catch {}
      this.droneOsc2 = null;
    }
    this.isDronePlaying = false;
  }

  public playJawSnap() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Mechanical transient snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } catch {}
  }
}

export const soundManager = new SoundManager();
