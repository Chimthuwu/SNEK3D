import { useGameStore } from '../store/useGameStore'

export function StartScreen() {
  const store = useGameStore()

  const handleStart = () => {
    store.resetGame()
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <h1 className="text-3xl font-bold text-teal-400 mb-8">3D Snake</h1>
      <p className="text-center text-gray-400 mb-8">Isometric Snake Game — MVP</p>
      <button
        onClick={handleStart}
        className="mx-auto px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
      >
        Start Game
      </button>
    </div>
  )
}