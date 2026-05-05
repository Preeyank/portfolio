import Terminal from './Terminal'
import './EasterEgg.css'

interface EasterEggProps {
  active: boolean
  onClose: () => void
}

export default function EasterEgg({ active, onClose }: EasterEggProps) {
  if (!active) return null

  return (
    <div className="egg" onClick={onClose}>
      <div className="egg__scanline" />
      <Terminal onClose={onClose} />
    </div>
  )
}
