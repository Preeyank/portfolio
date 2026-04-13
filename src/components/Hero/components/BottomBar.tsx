interface BottomBarProps {
  visible: boolean
}

export default function BottomBar({ visible }: BottomBarProps) {
  return (
    <div
      className="hero__fade-up hero__bottom-bar"
      style={{ animationDelay: '0.5s', opacity: visible ? 1 : 0 }}
    >
      <span className="hero__bottom-left">
        Currently building →&nbsp;
        <span className="hero__bottom-project">API Sentinel</span>
      </span>

      <div className="hero__bottom-center">
        <span className="hero__scroll-label">Scroll</span>
        <span className="hero__scroll-arrow">◆</span>
      </div>

      <span className="hero__bottom-right">21.1702° N, 72.8311° E</span>
    </div>
  )
}
