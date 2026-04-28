import { useEffect, useState } from 'react'

export function useTerminalReveal(count: number, startDelay: number = 400, stepMs: number = 60) {
  const [revealed, setRevealed] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (revealed >= count) {
      setDone(true)
      return
    }
    const t = setTimeout(() => setRevealed((r) => r + 1), startDelay + revealed * stepMs)
    return () => clearTimeout(t)
  }, [revealed, count, startDelay, stepMs])

  useEffect(() => {
    if (done) { setCursorVisible(false); return }
    const t = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(t)
  }, [done])

  return { revealed, cursorVisible, done }
}
