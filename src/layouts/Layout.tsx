import './Layout.css'
import Nav from './Nav'
import BottomBar from './BottomBar'
import Marquee from '../components/Marquee'

interface LayoutProps {
  children: React.ReactNode
  visible: boolean
}

export default function Layout({ children, visible }: LayoutProps) {
  return (
    <div className="layout">
      <Nav />
      <main className="layout__content">{children}</main>
      <Marquee />
      <BottomBar visible={visible} />
    </div>
  )
}
