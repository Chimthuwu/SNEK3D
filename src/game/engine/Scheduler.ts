export type ScheduledEvent = {
  id: number
  time: number
  callback: () => void
}

export class Scheduler {
  private events: ScheduledEvent[] = []
  private nextId: number = 0

  /** Schedule a callback to run after `delayMs` from currentTime. */
  schedule(currentTime: number, delayMs: number, callback: () => void): number {
    const id = ++this.nextId
    this.events.push({ id, time: currentTime + delayMs, callback })
    this.events.sort((a, b) => a.time - b.time)
    return id
  }

  /** Process all events due at or before `currentTime`. */
  update(currentTime: number): void {
    while (this.events.length > 0 && this.events[0].time <= currentTime) {
      const event = this.events.shift()!
      event.callback()
    }
  }

  /** Cancel a scheduled event by ID. */
  cancel(id: number): boolean {
    const idx = this.events.findIndex(e => e.id === id)
    if (idx === -1) return false
    this.events.splice(idx, 1)
    return true
  }

  /** Clear all events. */
  clear(): void {
    this.events = []
    this.nextId = 0
  }
}