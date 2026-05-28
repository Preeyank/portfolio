import { useCallback, useEffect, useState } from 'react'
import './Layout.css'
import Nav from './Nav'
import { Marquee } from '../components/ui'
import { CustomCursor, EasterEgg, CommandPalette, AskDrawer } from '../components/effects'
import { useKonami } from '../hooks'
import { KONAMI_SEQUENCE } from '../content'

interface LayoutProps {
  children: React.ReactNode
  visible: boolean
}

export default function Layout({ children, visible }: LayoutProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [eggActive, setEggActive] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  // Question carried in via the `ask:open` event (e.g. a Hero suggestion chip).
  // Consumed once by AskDrawer on open, then cleared.
  const [askQuestion, setAskQuestion] = useState<string | null>(null)
  // The dock pill appears only after the Hero scrolls out of view.
  const [dockVisible, setDockVisible] = useState(false)

  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const openEgg = useCallback(() => { setPaletteOpen(false); setEggActive(true) }, [])
  const closeEgg = useCallback(() => setEggActive(false), [])
  const closeAsk = useCallback(() => { setAskOpen(false); setAskQuestion(null) }, [])
  const consumeAskQuestion = useCallback(() => setAskQuestion(null), [])

  useKonami(KONAMI_SEQUENCE, openEgg, !eggActive)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Open the Ask drawer from anywhere via `window.dispatchEvent(new CustomEvent('ask:open'))`.
  // Decouples the trigger (CommandPalette, Hero prompt bar, dock pill) from the
  // drawer's open state — any future surface can wire in without prop drilling.
  // An optional `detail.question` (e.g. a Hero suggestion chip) is forwarded to
  // the drawer to auto-send on open.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const question = (e as CustomEvent<{ question?: string }>).detail?.question ?? null
      setPaletteOpen(false)
      setAskQuestion(question)
      setAskOpen(true)
    }
    window.addEventListener('ask:open', onOpen)
    return () => window.removeEventListener('ask:open', onOpen)
  }, [])

  // Show the dock pill once the Hero is out of view. IntersectionObserver
  // instead of a scroll handler so we're not running work on every frame.
  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setDockVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`layout ${visible ? 'layout--entered' : ''}`}>
      <CustomCursor />
      <EasterEgg active={eggActive} onClose={closeEgg} />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <AskDrawer
        open={askOpen}
        onClose={closeAsk}
        initialQuestion={askQuestion}
        onConsumeQuestion={consumeAskQuestion}
      />
      <Nav onOpenPalette={openPalette} />
      <main className="layout__content">{children}</main>
      <Marquee />
      <button
        type="button"
        className={`ask-dock ${dockVisible && !askOpen ? 'ask-dock--visible' : ''}`}
        onClick={() => setAskOpen(true)}
        aria-label="Ask Preeyank"
      >
        <span className="ask-dock__icon" aria-hidden="true">✦</span>
        <span className="ask-dock__label">Ask</span>
      </button>
    </div>
  )
}
