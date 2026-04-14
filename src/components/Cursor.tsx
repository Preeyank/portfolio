import { useEffect, useRef } from 'react'
import './Cursor.css'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      raf = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      dot.classList.add('cursor__dot--hover')
      ring.classList.add('cursor__ring--hover')
    }
    const onLeave = () => {
      dot.classList.remove('cursor__dot--hover')
      ring.classList.remove('cursor__ring--hover')
    }

    const addHoverListeners = () => {
      document
        .querySelectorAll('a, button, [data-cursor-hover]')
        .forEach((el) => {
          el.addEventListener('mouseenter', onEnter)
          el.addEventListener('mouseleave', onLeave)
        })
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(animate)
    addHoverListeners()

    // Re-attach when DOM changes (e.g. pills appearing)
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor__dot"  />
      <div ref={ringRef} className="cursor__ring" />
    </>
  )
}
