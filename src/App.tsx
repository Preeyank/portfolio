import { useEffect, useState } from 'react'
import Layout from './layouts/Layout'
import Hero from './sections/Hero'

function App() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <Layout visible={visible}>
      <Hero visible={visible} />
    </Layout>
  )
}

export default App
