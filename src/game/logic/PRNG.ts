/**
 * xorshift32 seeded PRNG.
 * Serializable state for deterministic replay.
 *
 * Implementation:
 *   x ^= x << 13
 *   x ^= x >>> 17
 *   x ^= x << 5
 *   return x >>> 0 / 0x100000000  // [0, 1)
 *
 * Seed must be non-zero.
 */

type PRNGState = {
  seed: number
}

function xorshift32(state: number): number {
  let x = state | 0
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  return x >>> 0
}

export class PRNG {
  private state: number

  constructor(seed: number) {
    // Ensure seed is a valid 32-bit int and non-zero.
    this.state = (seed >>> 0) || 1
  }

  /** Returns a random float in [0, 1). */
  nextFloat(): number {
    this.state = xorshift32(this.state)
    return this.state / 0x100000000
  }

  /** Returns a random integer in [min, max] inclusive. */
  nextInt(min: number, max: number): number {
    const range = max - min + 1
    return min + Math.floor(this.nextFloat() * range)
  }

  /** Get serializable PRNG state. */
  getState(): PRNGState {
    return { seed: this.state }
  }

  /** Restore PRNG state from serialized form. */
  setState(state: PRNGState): void {
    this.state = (state.seed >>> 0) || 1
  }
}

/** Create a PRNG seeded once per run (Date.now() on New Game). */
export function createSeededPRNG(seed?: number): PRNG {
  const s = seed ?? Date.now()
  return new PRNG(s)
}
