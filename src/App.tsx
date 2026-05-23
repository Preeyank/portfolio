import { useEffect, useState } from 'react'
import { Layout } from './layouts'
import { SectionDivider } from './components/ui'
import Hero from './sections/Hero'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import About from './sections/About'
import Now from './sections/Now'
import Contact from './sections/Contact'

function App() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <Layout visible={visible}>
      <Hero visible={visible} />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Now />
      <SectionDivider />
      <Contact />
    </Layout>
  )
}

export default App
