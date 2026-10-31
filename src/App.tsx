import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GridView } from './game/entities/GridView'
import { SnakeView } from './game/entities/SnakeView'
import { FoodView } from './game/entities/FoodView'
import { StartScreen } from './ui/StartScreen'
import { GameOverOverlay } from './ui/GameOverOverlay'
import { WinOverlay } from './ui/WinOverlay'
import { HUD } from './ui/HUD'
import { PauseOverlay } from './ui/PauseOverlay'
import './styles/globals.css'

export function App() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <ErrorBoundary fallback={<div className="flex h-screen items-center justify-center text-red-500">Render Error</div>}>
        <StartScreen />
        <Canvas camera={{ position: [25, 25, 25] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[20, 30, 20]} intensity={1.5} castShadow />
          <hemisphereLight skyColor="#87ceeb" groundColor="#2c2c2c" intensity={0.6} />
          <GridView />
          <SnakeView />
          <FoodView />
          <HUD />
          <PauseOverlay />
          <GameOverOverlay />
          <WinOverlay />
          <OrbitControls />
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}