import './Marquee.css'

const ITEMS = [
  'Available for Work',
  'Full Stack Developer',
  'React · TypeScript · Node.js',
  'Open to Remote',
  'Building for the Web',
  'preeyank.dev',
]

const SEP = '·'

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS] // duplicate for seamless loop

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
