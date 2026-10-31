// Isometric projection math helpers.
// Camera orientation: yaw 45°, pitch ≈35.264° (position (25,25,25) looking at origin)
// Grid axes: +X = world NE, +Z = world SE

import { GRID_SIZE } from '../game/logic/Grid'

export type WorldPos = [number, number, number]
export type ScreenPos = { x: number; y: number }

/** Convert a grid coordinate to world position on the isometric plane. */
export function isoCoordToWorld(coord: { x: number; z: number }): WorldPos {
  const cx = coord.x - GRID_SIZE / 2 + 0.5
  const cz = coord.z - GRID_SIZE / 2 + 0.5
  return [cx, 0, cz]
}

/** Convert world position to screen space given an orthographic camera.
 * For MVP, we use a simple projection for swipe mapping purposes.
 */
export function worldToScreen(
  worldPos: WorldPos,
  camera: {
    position: { x: number; y: number; z: number }
    // Simple projection based on fixed isometric angles
  },
): ScreenPos {
  // With camera at (25, 25, 25), the projection of (x, 0, z) to screen is:
  // screenX = x + z (diagonal)
  // screenY = x - z (for the isometric rotation)
  const [wx, , wz] = worldPos
  const screenX = (wx - wz) * 0.707 // cos/sin 45°
  const screenY = (wx + wz) * 0.354 // sin(35.264°) ≈ 0.577, scaled
  return { x: screenX, y: screenY }
}

/** Get the screen-space vector for a given grid direction. */
export function directionToScreenVector(dir: { x: number; z: number }): ScreenPos {
  // +X (NE) → screen-up, +Z (SE) → screen-right
  // With isometric projection:
  const screenX = (dir.x - dir.z) * 0.707
  const screenY = (dir.x + dir.z) * 0.354
  return { x: screenX, y: screenY }
}