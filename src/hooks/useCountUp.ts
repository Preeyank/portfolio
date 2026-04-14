import { useEffect, useRef, useState } from 'react'

function parse(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^([\d.]+)(B\+|\+|%)?$/)
  if (!match) return { value: 0, suffix: raw }
  const num = parseFloat(match[1])
  const suffix = match[2] ?? ''
  return { value: num, suffix }
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useCountUp(raw: string, ready: boolean, duration = 1200) {
  const { value: target, suffix } = parse(raw)
  const [display, setDisplay] = useState('0' + suffix)
  const frameRef = useRef<number>(0)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (!ready || hasPlayedRef.current) return
    hasPlayedRef.current = true

    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutExpo(progress)
      const current = target * eased

      const formatted = Number.isInteger(target)
        ? Math.round(current).toString()
        : current.toFixed(1)

      setDisplay(formatted + suffix)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(target + suffix)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [ready, target, suffix, duration])

  return display
}
