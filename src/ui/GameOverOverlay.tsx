import React from 'react'
import { useGameStore } from '../store/useGameStore'

export function GameOverOverlay() {
  const store = useGameStore()

  if (!store.isGameOver()) {
    return null
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-teal-400 mb-4">Game Over</h2>
        <p className="text-xl text-gray-300 mb-2">Score: {store.getScore()}</p>
        <button
          onClick={() => store.newGame()}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}