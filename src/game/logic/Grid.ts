export type GridCoord = { x: number; z: number }
export const GRID_SIZE = 15
export const GRID_MIN = 0
export const GRID_MAX = GRID_SIZE - 1

export function isInsideGrid(coord: GridCoord): boolean {
  return coord.x >= GRID_MIN && coord.x <= GRID_MAX && coord.z >= GRID_MIN && coord.z <= GRID_MAX
}

export function toWorldPos(coord: GridCoord): [number, number, number] {
  // Isometric projection: centered at (0,0,0), grid spans [-7.5, 7.5]
  const cx = coord.x - GRID_SIZE / 2 + 0.5
  const cz = coord.z - GRID_SIZE / 2 + 0.5
  return [cx, 0, cz]
}

export function toGridCoord(x: number, z: number): GridCoord {
  return {
    x: Math.round(x + GRID_SIZE / 2 - 0.5),
    z: Math.round(z + GRID_SIZE / 2 - 0.5),
  }
}

export function neighbors(c: GridCoord): GridCoord[] {
  return [
    { x: c.x + 1, z: c.z },
    { x: c.x - 1, z: c.z },
    { x: c.x, z: c.z + 1 },
    { x: c.x, z: c.z - 1 },
  ].filter(isInsideGrid)
}
