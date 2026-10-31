// Custom Web Audio wrapper — no external audio libraries.

export class AudioEngine {
  private context: AudioContext | null = null
  private enabled: boolean = true

  constructor(enabled: boolean = true) {
    this.enabled = enabled
  }

  init(): void {
    if (!this.enabled) return
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext
      if (AC && !this.context) {
        this.context = new AC()
      }
      if (this.context && this.context.state === 'suspended') {
        this.context.resume()
      }
    } catch {
      // Audio not supported.
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (!enabled && this.context && this.context.state === 'running') {
      this.context.suspend().catch(() => {})
    } else if (enabled && this.context && this.context.state === 'suspended') {
      this.context.resume().catch(() => {})
    }
  }

  playPop(): void {
    if (!this.enabled || !this.context) return
    try {
      const ctx = this.context
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch {
      // Ignore audio errors.
    }
  }

  playClick(): void {
    if (!this.enabled || !this.context) return
    try {
      const ctx = this.context
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.05)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    } catch {
      // Ignore audio errors.
    }
  }

  playChord(type: 'death' | 'win'): void {
    if (!this.enabled || !this.context) return
    try {
      const ctx = this.context
      const freqs = type === 'win' ? [261.63, 329.63, 392.0] : [130.81, 110.0, 92.5]
      const duration = type === 'win' ? 0.6 : 0.8
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = type === 'win' ? 'sine' : 'square'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05)
        gain.gain.setValueAtTime(0.2 / freqs.length, ctx.currentTime + i * 0.05)
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.05)
        osc.stop(ctx.currentTime + i * 0.05 + duration)
      })
    } catch {
      // Ignore audio errors.
    }
  }

  dispose(): void {
    if (this.context) {
      this.context.close().catch(() => {})
      this.context = null
    }
  }
}