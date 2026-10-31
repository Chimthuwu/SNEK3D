import type { SnakeState, Direction } from '../logic/Snake'
import { queueDirection } from '../logic/Snake'

export type SwipeVector = {
  dx: number
  dy: number
  timestamp: number
}

export type InputEvent = {
  type: 'keyboard' | 'swipe'
  direction: Direction
}

export class InputManager {
  private keys: Set<string> = new Set()
  private pendingSwipe: SwipeVector | null = null
  private state: SnakeState
  private listeners: ((e: InputEvent) => void)[] = []

  constructor(state: SnakeState) {
    this.state = state
  }

  private keyToDirection(key: string): Direction | null {
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        return { x: 1, z: 0 }
      case 'ArrowDown':
      case 's':
      case 'S':
        return { x: -1, z: 0 }
      case 'ArrowLeft':
      case 'a':
      case 'A':
        return { x: 0, z: -1 }
      case 'ArrowRight':
      case 'd':
      case 'D':
        return { x: 0, z: 1 }
      default:
        return null
    }
  }

  private swipeToDirection(s: SwipeVector): Direction | null {
    const absDx = Math.abs(s.dx)
    const absDy = Math.abs(s.dy)

    if (absDx < 30 && absDy < 30) {
      return null
    }

    if (absDy > absDx) {
      if (s.dy < -30) {
        return { x: 1, z: 0 }
      }
      if (s.dy > 30) {
        return { x: -1, z: 0 }
      }
    } else {
      if (s.dx < -30) {
        return { x: 0, z: -1 }
      }
      if (s.dx > 30) {
        return { x: 0, z: 1 }
      }
    }

    return null
  }

  processKey(key: string, isDown: boolean): void {
    if (isDown) {
      this.keys.add(key)
    } else {
      this.keys.delete(key)
    }

    if (!isDown) {
      const pressedKey = Array.from(this.keys).pop() ?? key
      const dir = this.keyToDirection(pressedKey)
      if (dir) {
        queueDirection(this.state, dir)
        for (const listener of this.listeners) {
          listener({ type: 'keyboard', direction: dir })
        }
      }
    }
  }

  processSwipe(startX: number, startY: number, endX: number, endY: number): void {
    const dir = this.swipeToDirection({ dx: endX - startX, dy: endY - startY, timestamp: Date.now() })
    if (dir) {
      queueDirection(this.state, dir)
      for (const listener of this.listeners) {
        listener({ type: 'keyboard', direction: dir })
      }
    }
  }

  on(event: (e: InputEvent) => void): () => void {
    this.listeners.push(event)
    return () => {
      this.listeners = this.listeners.filter(l => l !== event)
    }
  }

  reset(): void {
    this.keys.clear()
    this.pendingSwipe = null
  }
}