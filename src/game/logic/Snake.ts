export type Direction = { x: number; z: number } | null

export const DIRECTIONS: Array<Direction> = [
  { x: 1, z: 0 },   // Grid +X (NE)  → ArrowUp / W
  { x: -1, z: 0 },  // Grid -X (SW)  → ArrowDown / S
  { x: 0, z: -1 },  // Grid -Z (NW)  → ArrowLeft / A
  { x: 0, z: 1 },   // Grid +Z (SE)  → ArrowRight / D
]

export type Segment = { x: number; z: number }

export type SnakeState = {
  segments: Segment[]
  direction: Direction
  nextDirection: Direction | null
  length: number
  alive: boolean
  won: boolean
}

export type SnakeUpdateResult = {
  ateFood: boolean
  gameOver: boolean
  won: boolean
}

export function createSnake(startSegments: Segment[]): SnakeState {
  return {
    segments: [...startSegments],
    direction: { x: 1, z: 0 },
    nextDirection: null,
    length: startSegments.length,
    alive: true,
    won: false,
  }
}

export function isOpposite(a: Direction, b: Direction): boolean {
  if (!a || !b) return false
  return a.x === -b.x && a.z === -b.z
}

export function moveHead(head: Segment, dir: Direction): Segment {
  return { x: head.x + (dir!.x), z: head.z + (dir!.z) }
}

/**
 * Advance snake by one tick.
 * Returns whether food was eaten, whether game over, and whether won.
 */
export function stepSnake(
  state: SnakeState,
  gridSize: number,
  foodPos: Segment,
  winLength: number,
): SnakeUpdateResult {
  if (!state.alive || state.won) {
    return { ateFood: false, gameOver: false, won: state.won }
  }

  // Apply queued direction if valid (not 180 reversal).
  if (state.nextDirection !== null) {
    if (state.direction === null || !isOpposite(state.nextDirection, state.direction)) {
      state.direction = state.nextDirection
    }
    state.nextDirection = null
  }

  const dir = state.direction
  if (dir === null) {
    return { ateFood: false, gameOver: false, won: false }
  }

  const head = state.segments[0]
  const newHead = moveHead(head, dir)

  // Wall collision.
  if (newHead.x < 0 || newHead.x >= gridSize || newHead.z < 0 || newHead.z >= gridSize) {
    return { ateFood: false, gameOver: true, won: false }
  }

  const newSegments = [newHead, ...state.segments.slice(0, -1)]
  const ateFood = newHead.x === foodPos.x && newHead.z === foodPos.z

  if (ateFood) {
    // Grow: keep tail segment (don't pop).
    newSegments.push(state.segments[state.segments.length - 1])
    state.length += 1
  }

  // Self collision: head hits any body segment (excluding head itself).
  for (let i = 1; i < newSegments.length; i++) {
    if (newSegments[i].x === newHead.x && newSegments[i].z === newHead.z) {
      return { ateFood: false, gameOver: true, won: false }
    }
  }

  state.segments = newSegments

  if (state.length >= winLength) {
    state.won = true
  }

  return { ateFood, gameOver: false, won: state.won }
}

export function queueDirection(state: SnakeState, dir: Direction): void {
  if (dir === null) return
  // Ignore 180 reversal.
  if (state.direction !== null && isOpposite(dir, state.direction)) {
    return
  }
  state.nextDirection = dir
}