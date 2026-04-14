import './Hero.css'
import HeroContent from './HeroContent'

interface HeroProps {
  visible: boolean
}

export default function Hero({ visible }: HeroProps) {
  return (
    <div className="hero">
      <div className="hero__grid" />
      <div className="hero__grid-fade" />
      <div className="hero__glow" />

      {/* Radar sweep lines */}
      <div className="hero__radar" aria-hidden="true">
        <div className="hero__radar-line hero__radar-line--1" />
        <div className="hero__radar-line hero__radar-line--2" />
      </div>

      {/* CRT scan line — fires once on load */}
      <div className="hero__scanline" aria-hidden="true" />

      <HeroContent visible={visible} />
    </div>
  )
}
