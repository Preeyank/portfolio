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
      <HeroContent visible={visible} />
    </div>
  )
}
