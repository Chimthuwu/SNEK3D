// Food view — Icosahedron with bob animation (reduced motion aware).

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { GRID_SIZE } from '../logic/Grid'

export function FoodView() {
  const meshRef = useRef<THREE.Mesh>(null)
  const reducedMotion = useReducedMotion()

  useFrame(state => {
    const food = useGameStore.getState().food
    const pos = food.position

    if (meshRef.current) {
      const cx = pos.x - GRID_SIZE / 2 + 0.5
      const cz = pos.z - GRID_SIZE / 2 + 0.5

      meshRef.current.position.x = cx
      meshRef.current.position.z = cz

      if (!reducedMotion) {
        const time = state.clock.getElapsedTime()
        meshRef.current.position.y = 0.15 + Math.sin(time * 3) * 0.15
      } else {
        meshRef.current.position.y = 0.15
      }
    }
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <icosahedronGeometry args={[0.35, 1]} />
      <meshBasicMaterial color="#ff6b6b" />
    </mesh>
  )
}