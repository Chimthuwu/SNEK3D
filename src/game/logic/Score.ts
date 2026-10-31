export type ScoreState = {
  current: number
  highScore: number
}

export type ScorePersisted = {
  score: number
  version: 1
}

const KEY = 'snake3d_high_score_v1'

export function loadScore(): ScoreState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { current: 0, highScore: 0 }
    const parsed = JSON.parse(raw) as ScorePersisted
    return { current: 0, highScore: parsed.score }
  } catch {
    return { current: 0, highScore: 0 }
  }
}

export function saveScore(score: number): void {
  const persisted: ScorePersisted = { score, version: 1 }
  localStorage.setItem(KEY, JSON.stringify(persisted))
}

export function setHighScore(current: number, highScore: number): number {
  const newHigh = current > highScore ? current : highScore
  saveScore(newHigh)
  return newHigh
}

export function resetScore(): ScoreState {
  saveScore(0)
  return { current: 0, highScore: 0 }
}
