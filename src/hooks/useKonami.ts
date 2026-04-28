import { useEffect } from 'react'

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'])

export function useKonami(sequence: readonly string[], onMatch: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return

    const buffer: string[] = []

    const onKeyDown = (e: KeyboardEvent) => {
      if (MODIFIER_KEYS.has(e.key)) return

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      buffer.push(key)

      if (buffer.length > sequence.length) buffer.shift()

      if (buffer.length === sequence.length && buffer.every((k, i) => k === sequence[i])) {
        onMatch()
        buffer.length = 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sequence, onMatch, enabled])
}
