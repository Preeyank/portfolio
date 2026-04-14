import { useEffect, useState } from 'react'
import Layout from './layouts/Layout'
import Hero from './sections/Hero'
import Experience from './sections/Experience/Experience'
import Projects from './sections/Projects/Projects'
import About from './sections/About/About'
import Contact from './sections/Contact/Contact'
import SectionDivider from './components/SectionDivider'

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
      <Contact />
    </Layout>
  )
}

export default App
