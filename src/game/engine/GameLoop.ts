// Game Loop — rAF render with fixed-tick logic accumulator (8 Hz)

type LogicStep = () => void
type RenderCallback = (interpAlpha: number) => void

let lastTime: number = 0
let accumulator: number = 0
let isRunning: boolean = false
let logicStep: LogicStep | null = null
let renderCallback: RenderCallback | null = null

/** Start the game loop. Call once per game lifecycle. */
export function startLoop(
  onLogicStep: LogicStep,
  onRender: RenderCallback,
): void {
  if (isRunning) return
  isRunning = true
  lastTime = performance.now()
  accumulator = 0
  logicStep = onLogicStep
  renderCallback = onRender
  requestAnimationFrame(frame)
}

/** Core animation loop. */
function frame(): void {
  if (!isRunning || logicStep === null || renderCallback === null) return

  requestAnimationFrame(frame)

  const now = performance.now()
  const delta = (now - lastTime) / 1000
  lastTime = now
  accumulator += delta

  // Fixed-tick logic steps (8 Hz = 0.125 s per tick).
  while (accumulator >= 0.125) {
    logicStep()
    accumulator -= 0.125
  }

  // Interpolated render for the remaining fractional tick.
  const interpAlpha = accumulator / 0.125
  renderCallback(interpAlpha)
}

export function stopLoop(): void {
  isRunning = false
  logicStep = null
  renderCallback = null
  lastTime = 0
  accumulator = 0
}