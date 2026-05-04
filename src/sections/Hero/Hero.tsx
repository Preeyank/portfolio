import { useEffect, useRef } from 'react'
import './Hero.css'
import HeroContent from './HeroContent'

interface HeroProps {
  visible: boolean
}

export default function Hero({ visible }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const spot = spotRef.current
    const grid = gridRef.current
    const glow = glowRef.current
    const content = contentRef.current
    if (!hero || !spot || !grid || !glow || !content) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let targetX = 50
    let targetY = 50
    let currentX = 50
    let currentY = 50
    let raf: number
    let heroVisible = true

    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) / rect.width) * 100
      targetY = ((e.clientY - rect.top) / rect.height) * 100
    }

    const tick = () => {
      if (heroVisible) {
        currentX += (targetX - currentX) * 0.08
        currentY += (targetY - currentY) * 0.08
        spot.style.setProperty('--spot-x', `${currentX}%`)
        spot.style.setProperty('--spot-y', `${currentY}%`)

        const scrollY = window.scrollY
        grid.style.transform    = `translateY(${scrollY * 0.3}px)`
        glow.style.transform    = `translateX(-50%) translateY(${scrollY * 0.5}px)`
        content.style.transform = `translateY(${scrollY * 0.12}px)`
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => { heroVisible = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(hero)

    raf = requestAnimationFrame(tick)
    hero.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      hero.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div className="hero" ref={heroRef}>
      <div className="hero__grid" ref={gridRef} />
      <div className="hero__grid-fade" />
      <div className="hero__glow" ref={glowRef} />
      <div className="hero__spotlight" ref={spotRef} />

      {/* Radar sweep lines */}
      <div className="hero__radar" aria-hidden="true">
        <div className="hero__radar-line hero__radar-line--1" />
        <div className="hero__radar-line hero__radar-line--2" />
      </div>

      {/* CRT scan line — fires once on load */}
      <div className="hero__scanline" aria-hidden="true" />

      <div ref={contentRef} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HeroContent visible={visible} />
      </div>
    </div>
  )
}
