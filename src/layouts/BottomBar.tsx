interface BottomBarProps {
  visible: boolean
}

export default function BottomBar({ visible }: BottomBarProps) {
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

      <span className="bottom-bar__right">21.1702° N, 72.8311° E</span>
    </div>
  )
}
