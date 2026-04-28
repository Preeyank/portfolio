import { useCallback, useState } from 'react'
import { useKonami } from '../../../hooks'
import { KONAMI_SEQUENCE } from '../../../content'
import Terminal from './Terminal'
import './EasterEgg.css'

export default function EasterEgg() {
  const [active, setActive] = useState(false)

  const activate = useCallback(() => setActive(true), [])
  const close = useCallback(() => setActive(false), [])

  useKonami(KONAMI_SEQUENCE, activate, !active)

  if (!active) return null

  return (
    <div className="egg" onClick={close}>
      <div className="egg__scanline" />
      <Terminal onClose={close} />
    </div>
  )
}
