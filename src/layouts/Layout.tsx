import './Layout.css'
import Nav from './Nav'
import Marquee from '../components/Marquee'
import CustomCursor from '../components/CustomCursor'
import EasterEgg from '../components/EasterEgg'

interface LayoutProps {
  children: React.ReactNode
  visible: boolean
}

export default function Layout({ children, visible }: LayoutProps) {
  return (
    <div className={`layout ${visible ? 'layout--entered' : ''}`}>
      <CustomCursor />
      <EasterEgg />
      <Nav />
      <main className="layout__content">{children}</main>
      <Marquee />
    </div>
  )
}
