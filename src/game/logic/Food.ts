import type { Segment } from './Grid.ts'

export type FoodState = {
  position: Segment
  eatenCount: number
}

export function createFood(prng: PRNG, snakeSegments: Segment[], gridSize: number): FoodState {
  const allCells: Segment[] = []
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      if (!snakeSegments.some(s => s.x === x && s.z === z)) {
        allCells.push({ x, z })
      }
    }
  }

  if (allCells.length === 0) {
    return { position: snakeSegments[0], eatenCount: 0 }
  }

  const idx = prng.nextInt(0, allCells.length - 1)
  return { position: allCells[idx], eatenCount: 1 }
}

export function foodEaten(current: FoodState, prng: PRNG, snakeSegments: Segment[], gridSize: number): FoodState {
  return createFood(prng, snakeSegments, gridSize)
}