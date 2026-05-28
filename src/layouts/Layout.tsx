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

  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const openEgg = useCallback(() => { setPaletteOpen(false); setEggActive(true) }, [])
  const closeEgg = useCallback(() => setEggActive(false), [])
  const closeAsk = useCallback(() => setAskOpen(false), [])

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

  // Open the Ask drawer from anywhere via `window.dispatchEvent(new Event('ask:open'))`.
  // Decouples the trigger (CommandPalette, Hero prompt bar, dock pill) from the
  // drawer's open state — any future surface can wire in without prop drilling.
  useEffect(() => {
    const onOpen = () => { setPaletteOpen(false); setAskOpen(true) }
    window.addEventListener('ask:open', onOpen)
    return () => window.removeEventListener('ask:open', onOpen)
  }, [])

  return (
    <div className={`layout ${visible ? 'layout--entered' : ''}`}>
      <CustomCursor />
      <EasterEgg active={eggActive} onClose={closeEgg} />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <AskDrawer open={askOpen} onClose={closeAsk} />
      <Nav onOpenPalette={openPalette} />
      <main className="layout__content">{children}</main>
      <Marquee />
    </div>
  )
}
