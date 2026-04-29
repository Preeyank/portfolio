import './Layout.css'
import Nav from './Nav'
import { Marquee } from '../components/ui'
import { CustomCursor, EasterEgg } from '../components/effects'

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
