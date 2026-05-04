import { useEffect, useState } from 'react'

export function useTerminalReveal(count: number, startDelay: number = 400, stepMs: number = 60) {
  const [revealed, setRevealed] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)

  const done = revealed >= count

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setRevealed((r) => r + 1), startDelay + revealed * stepMs)
    return () => clearTimeout(t)
  }, [revealed, count, startDelay, stepMs, done])

  useEffect(() => {
    if (done) return
    const t = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => { clearInterval(t); setCursorVisible(false) }
  }, [done])

  return { revealed, cursorVisible: done ? false : cursorVisible, done }
}
