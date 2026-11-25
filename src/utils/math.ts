// Isometric projection math helpers.
import { GRID_SIZE } from '../game/logic/Grid'

export type WorldPos = [number, number, number]
export type ScreenPos = { x: number; y: number }

export function isoCoordToWorld(coord: { x: number; z: number }): WorldPos {
  const cx = coord.x - GRID_SIZE / 2 + 0.5
  const cz = coord.z - GRID_SIZE / 2 + 0.5
  return [cx, 0, cz]
}

export function worldToScreen(_worldPos: WorldPos, _camera: { position: { x: number; y: number; z: number } }): ScreenPos {
  return { x: 0, y: 0 }
}

export function directionToScreenVector(dir: { x: number; z: number }): ScreenPos {
  return { x: (dir.x - dir.z) * 0.707, y: (dir.x + dir.z) * 0.354 }
}