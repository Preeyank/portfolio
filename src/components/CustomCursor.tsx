import { useEffect, useRef } from 'react'
import './CustomCursor.css'

const TRAIL_COUNT = 5

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLDivElement | null)[]>([])

  // Cursor rendering + hide enforcement in a single effect
  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const dot = dotRef.current
    const trails = trailRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!dot || trails.length === 0) return

    const BLANK = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGIAAAACAAHiIbwzAAAAAElFTkSuQmCC') 0 0, none"

    // Enforce hidden cursor via inline style on html + body
    const hideCursor = () => {
      if (!isFinePointer) return
      document.documentElement.style.setProperty('cursor', BLANK, 'important')
      document.body.style.setProperty('cursor', BLANK, 'important')
    }
    hideCursor()

    // Re-enforce on tab switch and window focus
    const onVisibility = () => { if (document.visibilityState === 'visible') hideCursor() }
    const onFocus = () => hideCursor()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)

    let mouseX = -100
    let mouseY = -100
    const trailPos = trails.map(() => ({ x: -100, y: -100 }))
    let raf: number
    let hoveredEl: HTMLElement | null = null

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      hoveredEl = e.target as HTMLElement
    }

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, .hero__eyebrow, .hero__pill, .hero__redacted, .proj-card, .exp-card'

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      hoveredEl = target
      if (target.closest(INTERACTIVE)) {
        dot.classList.add('cursor-dot--hover')
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(INTERACTIVE)) {
        dot.classList.remove('cursor-dot--hover')
      }
    }

    const tick = () => {
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`

      // Continuously stamp cursor on whatever element the mouse is over.
      // If the browser overrides our cursor, we override it right back next frame.
      if (isFinePointer && hoveredEl && hoveredEl.style) {
        hoveredEl.style.cursor = BLANK
      }

      for (let i = 0; i < trails.length; i++) {
        const target = i === 0 ? { x: mouseX, y: mouseY } : trailPos[i - 1]
        const ease = 0.25 - i * 0.03
        trailPos[i].x += (target.x - trailPos[i].x) * ease
        trailPos[i].y += (target.y - trailPos[i].y) * ease
        trails[i].style.transform = `translate(${trailPos[i].x}px, ${trailPos[i].y}px)`
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
      document.documentElement.style.removeProperty('cursor')
      document.body.style.removeProperty('cursor')
    }
  }, [])

  return (
    <>
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el }}
          className="cursor-trail"
          style={{ opacity: 0.3 - i * 0.055 }}
        />
      ))}
      <div ref={dotRef} className="cursor-dot" />
    </>
  )
}
