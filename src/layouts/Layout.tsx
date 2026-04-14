import './Layout.css'
import Nav from './Nav'
import Marquee from '../components/Marquee'
import CustomCursor from '../components/CustomCursor'

interface LayoutProps {
  children: React.ReactNode
  visible: boolean
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <CustomCursor />
      <Nav />
      <main className="layout__content">{children}</main>
      <Marquee />
    </div>
  )
}
