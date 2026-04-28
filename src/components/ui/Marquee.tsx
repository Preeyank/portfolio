import './Marquee.css'
import { MARQUEE_ITEMS } from '../../content/marquee'

const SEP = '·'

export default function Marquee() {
  const track = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {track.map((item, i) => (
          <span key={i} className="marquee__item">
            {item}
            <span className="marquee__sep">{SEP}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
