import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'

export function useScrambleOnMount(target: string, delay: number = 0) {
  const [display, setDisplay] = useState('')
  const frameRef = useRef(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0
      const total = target.length * 6

      const tick = () => {
        setDisplay(
          target
            .split('')
            .map((_, i) => {
              if (i < Math.floor(iteration / 6)) return target[i]
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )
        iteration++
        if (iteration <= total) {
          frameRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(target)
        }
      }
      frameRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frameRef.current)
    }
  }, [target, delay])

  return display
}
