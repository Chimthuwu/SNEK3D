import React from 'react'
import { useGameStore } from '../store/useGameStore'

export function SettingsPanel() {
  const store = useGameStore()

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-sm font-semibold text-teal-400 mb-4">Settings</h3>
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={store.reducedMotion}
            onChange={() => store.toggleReducedMotion()}
            className="h-4 w-4 rounded text-teal-400 cursor-pointer"
          />
          <span className="ml-2 text-sm">Reduced Motion</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={store.paused}
            onChange={() => store.togglePause()}
            className="h-4 w-4 rounded text-teal-400 cursor-pointer"
          />
          <span className="ml-2 text-sm">Pause / Resume</span>
        </label>
      </div>
    </div>
  )
}