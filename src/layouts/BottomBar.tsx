import { useEffect, useState } from 'react'

function usePSTClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const pst = new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setTime(pst)
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return time
}

function useTimeOnPage() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

interface BottomBarProps {
  visible: boolean
}

export default function BottomBar({ visible }: BottomBarProps) {
  const clock = usePSTClock()
  const elapsed = useTimeOnPage()

  return (
    <div
      className="hero__fade-up bottom-bar"
      style={{ animationDelay: '0.5s', opacity: visible ? 1 : 0 }}
    >
      <span className="bottom-bar__left">
        Currently building →&nbsp;
        <span className="bottom-bar__project">API Sentinel</span>
      </span>

      <div className="bottom-bar__center">
        <span className="bottom-bar__scroll-label">Scroll</span>
        <span className="bottom-bar__scroll-arrow">◆</span>
      </div>

      <span className="bottom-bar__right">
        <span className="bottom-bar__elapsed" title="time on page">{elapsed}</span>
        <span className="bottom-bar__divider"> · </span>
        <span className="bottom-bar__clock">{clock} PST</span>
      </span>
    </div>
  )
}
