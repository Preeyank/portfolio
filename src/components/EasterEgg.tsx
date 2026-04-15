import { useEffect, useState, useRef } from 'react'
import './EasterEgg.css'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

const LINES = [
  { text: '> SYSTEM ACCESS GRANTED', delay: 0 },
  { text: '> Loading profile: priyank.bardolia ...', delay: 600 },
  { text: '', delay: 1000 },
  { text: '  First line of code written: Age 16, a Python script', delay: 1200 },
  { text: '  that scraped cricket scores.', delay: 1600 },
  { text: '', delay: 1900 },
  { text: '  Mass-produced bugs before shipping features.', delay: 2100 },
  { text: '  Still do sometimes. But now with 94% test coverage.', delay: 2600 },
  { text: '', delay: 3000 },
  { text: '  Believes every great product starts as an ugly', delay: 3200 },
  { text: '  prototype in someone\'s terminal at 2 AM.', delay: 3600 },
  { text: '', delay: 3900 },
  { text: '  Runs on: chai, lo-fi, and the fear of stale PRs.', delay: 4100 },
  { text: '', delay: 4500 },
  { text: '  If you found this, you\'re the kind of person', delay: 4700 },
  { text: '  I want to work with.', delay: 5100 },
  { text: '', delay: 5400 },
  { text: '> bardoliapriyank05@gmail.com', delay: 5600 },
  { text: '> EOF', delay: 6200 },
]

export default function EasterEgg() {
  const [active, setActive] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)
  const inputRef = useRef<number[]>([])
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Listen for Konami code
  useEffect(() => {
    const seq: number[] = []

    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys — Shift fires before the letter and would reset the sequence
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return

      seq.push(0)
      inputRef.current = seq

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const expected = KONAMI[seq.length - 1]

      if (key !== expected) {
        seq.length = 0
        return
      }

      if (seq.length === KONAMI.length) {
        setActive(true)
        seq.length = 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Type out lines when active
  useEffect(() => {
    if (!active) return

    setVisibleLines(0)
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    LINES.forEach((line, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), line.delay)
      timersRef.current.push(t)
    })

    return () => timersRef.current.forEach(clearTimeout)
  }, [active])

  const close = () => {
    setActive(false)
    setVisibleLines(0)
    timersRef.current.forEach(clearTimeout)
  }

  if (!active) return null

  return (
    <div className="egg" onClick={close}>
      <div className="egg__scanline" />
      <div className="egg__terminal" onClick={(e) => e.stopPropagation()}>
        <div className="egg__header">
          <span className="egg__dots">
            <span className="egg__dot egg__dot--red" onClick={close} />
            <span className="egg__dot egg__dot--yellow" />
            <span className="egg__dot egg__dot--green" />
          </span>
          <span className="egg__title">priyank@portfolio ~ %</span>
        </div>
        <div className="egg__body">
          {LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={`egg__line ${line.text.startsWith('>') ? 'egg__line--accent' : ''}`}>
              {line.text}
            </div>
          ))}
          {visibleLines < LINES.length && (
            <span className="egg__cursor">▋</span>
          )}
        </div>
      </div>
    </div>
  )
}
