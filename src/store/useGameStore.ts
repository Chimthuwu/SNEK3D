// Store — Zustand game state with PRNG, score, input, and runtime UI state.

import { create } from 'zustand'
import { createSeededPRNG, PRNG } from '../game/logic/PRNG'
import type { SnakeState, Direction, Segment } from '../game/logic/Snake'
import type { FoodState } from '../game/logic/Food'
import { createSnake, moveHead, stepSnake, queueDirection } from '../game/logic/Snake'
import { createFood } from '../game/logic/Food'
import { loadScore, setHighScore } from '../game/logic/Score'
import { GRID_SIZE } from '../game/logic/Grid'
import { InputManager } from '../game/engine/InputManager'

export type GameOverType = 'wall' | 'self' | 'won' | null

export type GameState = {
  prng: PRNG
  gridSize: number
  winLength: number
  score: number
  snake: SnakeState
  food: FoodState
  input: InputManager
  gameOverType: GameOverType
  paused: boolean
  reducedMotion: boolean

  setReducedMotion: (val: boolean) => void
  toggleReducedMotion: () => void
  setPaused: (val: boolean) => void
  togglePause: () => void
  moveSnake: () => void
  changeDirection: (dir: Direction) => void
  resetGame: () => void
  newGame: () => void
  getDirection: () => Direction
  isGameOver: () => boolean
  isWon: () => boolean
  getScore: () => number
  getHighScore: () => number
}

const START_SEGMENTS: Segment[] = [
  { x: 3, z: 7 }, { x: 4, z: 7 }, { x: 5, z: 7 }, { x: 6, z: 7 },
]

export const useGameStore = create<GameState>((set, get) => ({
  prng: createSeededPRNG(Date.now()),
  gridSize: GRID_SIZE,
  winLength: 225,
  score: 0,
  snake: createSnake(START_SEGMENTS),
  food: createFood(createSeededPRNG(Date.now()), START_SEGMENTS, GRID_SIZE),
  input: new InputManager({} as SnakeState),
  gameOverType: null,
  paused: false,
  reducedMotion: false,

  setReducedMotion: (val: boolean) => set({ reducedMotion: val }),
  toggleReducedMotion: () => set(state => ({ reducedMotion: !state.reducedMotion })),
  setPaused: (val: boolean) => set({ paused: val }),
  togglePause: () => set(state => ({ paused: !state.paused })),

  changeDirection: (dir: Direction) => {
    const state = get()
    if (state.paused) return
    queueDirection(state.snake, dir)
  },

  moveSnake: () => {
    const state = get()
    if (state.paused || !state.snake.alive) return

    const result = stepSnake(state.snake, state.gridSize, state.food.position, state.winLength)
    const { ateFood, gameOver, won } = result

    if (ateFood) {
      const newScore = state.score + 10
      setHighScore(newScore, state.score)
      set({ score: newScore })
      state.snake.length += 1
      const newFood = createFood(state.prng, state.snake.segments, state.gridSize)
      set({ food: newFood })
    }

    set({
      snake: { ...state.snake, segments: state.snake.segments, alive: !gameOver, won },
      gameOverType: gameOver ? 'wall' : null,
    })

    if (won) {
      set({ gameOverType: 'won' })
    }
  },

  resetGame: () => {
    const prng = createSeededPRNG(Date.now())
    const snake = createSnake(START_SEGMENTS)
    const food = createFood(prng, START_SEGMENTS, GRID_SIZE)
    set({
      prng, snake, food, score: 0, gameOverType: null, paused: false, input: new InputManager(snake),
    })
  },

  newGame: () => {
    const state = get()
    setHighScore(state.score, state.score)
    const prng = createSeededPRNG(Date.now())
    const snake = createSnake(START_SEGMENTS)
    const food = createFood(prng, START_SEGMENTS, GRID_SIZE)
    set({
      prng, snake, food, score: 0, paused: false, reducedMotion: false,
      gameOverType: null, input: new InputManager(snake),
    })
  },

  getDirection: () => get().snake.direction,
  isGameOver: () => get().gameOverType !== null && !get().snake.won,
  isWon: () => get().snake.won,
  getScore: () => get().score,
  getHighScore: () => loadScore().highScore,
}))