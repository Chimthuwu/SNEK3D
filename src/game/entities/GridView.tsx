// Isometric grid view — 225 InstancedMesh planes, alternating colors.

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GRID_SIZE } from '../logic/Grid'
import { GRID_COLORS } from '../config'

export function GridView() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // Build matrices once on mount.
  const matrices = useRef<THREE.Matrix4[] | null>(null)

  if (matrices.current === null) {
    matrices.current = []
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const cx = x - GRID_SIZE / 2 + 0.5
        const cz = z - GRID_SIZE / 2 + 0.5
        const m = new THREE.Matrix4()
        m.makeTranslation(cx, 0, cz)
        matrices.current.push(m)
      }
    }
  }

  useFrame(() => {
    if (meshRef.current && matrices.current) {
      for (let i = 0; i < matrices.current.length; i++) {
        meshRef.current.setMatrixAt(i, matrices.current[i])
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, GRID_SIZE * GRID_SIZE]}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={GRID_COLORS.even}
        roughness={0.8}
        metalness={0.2}
      />
    </instancedMesh>
  )
}