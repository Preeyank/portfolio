import { useCallback, useEffect, useState } from 'react'
import './Layout.css'
import Nav from './Nav'
import { Marquee } from '../components/ui'
import { CustomCursor, EasterEgg, CommandPalette } from '../components/effects'
import { useKonami } from '../hooks'
import { KONAMI_SEQUENCE } from '../content'

interface LayoutProps {
  children: React.ReactNode
  visible: boolean
}

export default function Layout({ children, visible }: LayoutProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [eggActive, setEggActive] = useState(false)

  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const openEgg = useCallback(() => { setPaletteOpen(false); setEggActive(true) }, [])
  const closeEgg = useCallback(() => setEggActive(false), [])

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

  return (
    <div className={`layout ${visible ? 'layout--entered' : ''}`}>
      <CustomCursor />
      <EasterEgg active={eggActive} onClose={closeEgg} />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <Nav onOpenPalette={openPalette} />
      <main className="layout__content">{children}</main>
      <Marquee />
    </div>
  )
}
