import { useEffect, useState } from 'react'
import './Hero.css'
import Nav from './components/Nav'
import HeroContent from './components/HeroContent'
import BottomBar from './components/BottomBar'

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div className="hero">
      {/* Background layers */}
      <div className="hero__grid" />
      <div className="hero__grid-fade" />
      <div className="hero__glow" />

      <Nav />
      <HeroContent visible={visible} />
      <BottomBar visible={visible} />
    </div>
  )
}
