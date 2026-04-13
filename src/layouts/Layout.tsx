import './Layout.css'
import Nav from './Nav'
import BottomBar from './BottomBar'

interface LayoutProps {
  children: React.ReactNode
  visible: boolean
}

export default function Layout({ children, visible }: LayoutProps) {
  return (
    <div className="layout">
      <Nav />
      <main className="layout__content">{children}</main>
      <BottomBar visible={visible} />
    </div>
  )
}
