import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function scrambledVersion(text: string) {
  return text.split('').map(c => (c === ' ' ? ' ' : randomChar())).join('')
}

function runScramble(
  text: string,
  duration: number,
  setDisplay: (s: string) => void,
  frameRef: React.MutableRefObject<number>
) {
  const start = performance.now()
  const len = text.length

  const tick = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const resolved = Math.floor(progress * len)

    const chars = text.split('').map((char, i) => {
      if (char === ' ') return ' '
      if (i < resolved) return char
      return randomChar()
    })

    setDisplay(chars.join(''))

    if (progress < 1) {
      frameRef.current = requestAnimationFrame(tick)
    } else {
      setDisplay(text)
    }
  }

  frameRef.current = requestAnimationFrame(tick)
}

const DWELL_MS = 400

export function useScramble(text: string, duration = 950) {
  // Start with a scrambled version — never show real text before it plays
  const [display, setDisplay] = useState(() => scrambledVersion(text))
  const ref = useRef<HTMLElement | null>(null)
  const frameRef = useRef<number>(0)
  const hasPlayedRef = useRef(false)
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const clearDwell = () => {
      if (dwellTimerRef.current !== null) {
        clearTimeout(dwellTimerRef.current)
        dwellTimerRef.current = null
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (hasPlayedRef.current) return

        if (entry.isIntersecting) {
          dwellTimerRef.current = setTimeout(() => {
            if (hasPlayedRef.current) return
            hasPlayedRef.current = true
            cancelAnimationFrame(frameRef.current)
            runScramble(text, duration, setDisplay, frameRef)
          }, DWELL_MS)
        } else {
          clearDwell()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      clearDwell()
      cancelAnimationFrame(frameRef.current)
    }
  }, [text, duration])

  return { ref, display }
}
