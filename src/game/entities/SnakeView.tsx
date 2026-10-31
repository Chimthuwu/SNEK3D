// Snake view — single InstancedMesh with low-poly capsule geometry.

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GRID_SIZE } from '../logic/Grid'
import { GRID_COLORS } from '../config'
import { useGameStore } from '../../store/useGameStore'

export function SnakeView() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // Build geometry once on mount.
  const geometry = useRef<THREE.CapsuleGeometry | null>(null)
  const material = useRef<THREE.MeshStandardMaterial | null>(null)

  if (geometry.current === null) {
    geometry.current = new THREE.CapsuleGeometry(0.5, 0.5, 8, 8)
  }

  if (material.current === null) {
    material.current = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.5,
    })
  }

  // Update matrices on each frame using current store state.
  useFrame(() => {
    const segments = useGameStore.getState().snake.segments

    if (meshRef.current && segments.length > 0) {
      // If instance count differs, recreate mesh (unlikely in MVP).
      if (meshRef.current.count !== segments.length) {
        // In production we'd recreate the mesh.
        console.warn('SnakeView: instance count change - recreate mesh')
      }

      // Update each instance.
      for (let i = 0; i < segments.length; i++) {
        const cx = segments[i].x - GRID_SIZE / 2 + 0.5
        const cz = segments[i].z - GRID_SIZE / 2 + 0.5
        const m = new THREE.Matrix4()
        m.makeTranslation(cx, 0, cz)
        meshRef.current.setMatrixAt(i, m)
        meshRef.current.setColorAt(i, i === 0 ? new THREE.Color(GRID_COLORS.snakeHead) : new THREE.Color(GRID_COLORS.snakeBody))
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, GRID_SIZE * GRID_SIZE]} // max 225
    >
      <primitive object={geometry.current!} />
      <primitive object={material.current!} />
    </instancedMesh>
  )
}