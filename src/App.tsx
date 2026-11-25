import { Canvas } from '@react-three/fiber'

import { ErrorBoundary } from './components/ErrorBoundary'
import { GridView } from './game/entities/GridView'
import { SnakeView } from './game/entities/SnakeView'
import { FoodView } from './game/entities/FoodView'
import { StartScreen } from './ui/StartScreen'
import { HUD } from './ui/HUD'
import { PauseOverlay } from './ui/PauseOverlay'
import { GameOverOverlay } from './ui/GameOverOverlay'
import { WinOverlay } from './ui/WinOverlay'
import './styles/globals.css'

export function App() {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <ErrorBoundary fallback={<div className="flex h-screen items-center justify-center text-red-500">Render Error — check console</div>}>
        <StartScreen />
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [25, 25, 25], fov: 50, near: 0.1, far: 100 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[20, 30, 20]} intensity={1.5} castShadow />
            <hemisphereLight args={['#87ceeb', '#2c2c2c', 0.6] as any} />
            <GridView />
            <SnakeView />
            <FoodView />
          </Canvas>
        </div>
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
          <HUD />
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none">
          <PauseOverlay />
          <GameOverOverlay />
          <WinOverlay />
        </div>
      </ErrorBoundary>
    </div>
  )
}