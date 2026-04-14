import './Layout.css'
import Nav from './Nav'
import Marquee from '../components/Marquee'

interface LayoutProps {
  children: React.ReactNode
  visible: boolean
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Nav />
      <main className="layout__content">{children}</main>
      <Marquee />
    </div>
  )
}
