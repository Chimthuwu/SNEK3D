import { useGameStore } from '../store/useGameStore'

export function PauseOverlay() {
  const store = useGameStore()

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-teal-400 mb-4">Paused</h2>
        <button
          onClick={() => store.togglePause()}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
        >
          Resume
        </button>
      </div>
    </div>
  )
}