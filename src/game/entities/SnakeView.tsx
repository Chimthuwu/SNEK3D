import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GRID_SIZE } from '../logic/Grid'
import { GRID_COLORS } from '../config'
import { useGameStore } from '../../store/useGameStore'

export function SnakeView() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const geometry = useRef<THREE.CapsuleGeometry | null>(null)
  const material = useRef<THREE.MeshStandardMaterial | null>(null)

  if (geometry.current === null) {
    geometry.current = new THREE.CapsuleGeometry(0.5, 0.5, 8, 8)
  }

  if (material.current === null) {
    material.current = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.5 })
  }

  useFrame(() => {
    const segments = useGameStore.getState().snake.segments

    if (meshRef.current && segments.length > 0) {
      if (meshRef.current.count !== segments.length) {
        console.warn('SnakeView: instance count change - recreate mesh')
      }

      for (let i = 0; i < segments.length; i++) {
        const cx = segments[i].x - GRID_SIZE / 2 + 0.5
        const cz = segments[i].z - GRID_SIZE / 2 + 0.5
        const m = new THREE.Matrix4()
        m.makeTranslation(cx, 0, cz)
        meshRef.current.setMatrixAt(i, m)
        meshRef.current.setColorAt(
          i,
          i === 0 ? new THREE.Color(GRID_COLORS.snakeHead) : new THREE.Color(GRID_COLORS.snakeBody)
        )
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, GRID_SIZE * GRID_SIZE]}
    >
      <primitive object={geometry.current!} />
      <primitive object={material.current!} />
    </instancedMesh>
  )
}