import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { StartScreen } from './ui/StartScreen'
import { HUD } from './ui/HUD'
import { PauseOverlay } from './ui/PauseOverlay'
import { GameOverOverlay } from './ui/GameOverOverlay'
import { WinOverlay } from './ui/WinOverlay'
import { SettingsPanel } from './ui/SettingsPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useReducedMotion } from './hooks/useReducedMotion'
import { AudioEngine } from './game/audio/AudioEngine'

// Global styles
import './styles/globals.css'

export function App() {
  const [reducedMotion, setReducedMotion] = useState(useReducedMotion())
  const [showSettings, setShowSettings] = useState(false)
  const [appMode, setAppMode] = useState<'menu' | 'playing' | 'paused' | 'gameover' | 'win'>('menu')
  const [hasInitiatedAudio] = useState(false)

  const audioEngine = new AudioEngine()
  audioEngine.init()

  const handleSettingsOpen = () => setShowSettings(true)
  const handleSettingsClose = () => {
    setShowSettings(false)
    // Persist sound toggle if we had it
  }
  const handleSoundToggle = () => {
    audioEngine.setEnabled(!audioEngine.enabled)
  }

  const resetGame = () => {
    setAppMode('menu')
    audioEngine.dispose()
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <ErrorBoundary
        fallback={
          <div className="flex h-screen items-center justify-center text-red-500">
            Render Error
          </div>
        }
      >
        {appMode === 'menu' ? (
          <>
            <StartScreen />
            <button
              onClick={() => setAppMode('playing')}
              className="absolute top-6 right-6 px-4 py-2 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
            >
              ← Menu
            </button>
          </>
        ) : appMode === 'playing' ? (
          <>
            <Canvas
              camera={{ position: [25, 25, 25], fov: 50, near: 0.1, far: 100 }}
            >
              {/* Sky background */}
              <ambientLight intensity={0.6} />

              {/* Directional light with shadows */}
              <directionalLight
                position={[20, 30, 20]}
                intensity={1.5}
                castShadow
                shadow-map-size={1024}
              >
                <helper position={[20, 30, 20]} attach="helper" args={[10]} />
              </directionalLight>

              {/* Hemisphere light */}
              <hemisphereLight
                skyColor="#87ceeb"
                groundColor="#2c2c2c"
                intensity={0.6}
              />

              {/* Grid */}
              <GridView />

              {/* Snake */}
              <SnakeView />

              {/* Food */}
              <FoodView />

              {/* HUD */}
              <HUD />

              {/* Pause overlay */}
              <PauseOverlay />

              {/* Game Over / Win */}
              <GameOverOverlay />
              <WinOverlay />

              {/* Settings panel (toggled via gear icon in HUD) */}
              {showSettings && <SettingsPanel />}
            </Canvas>
          </>
        ) : appMode === 'paused' ? (
          <>
            <PauseOverlay />
            {showSettings && <SettingsPanel />}
          </>
        ) : appMode === 'gameover' ? (
          <>
            <GameOverOverlay />
            {showSettings && <SettingsPanel />}
          </>
        ) : appMode === 'win' ? (
          <>
            <WinOverlay />
            {showSettings && <SettingsPanel />}
          </>
        )}
      </ErrorBoundary>
    </div>
  )
}