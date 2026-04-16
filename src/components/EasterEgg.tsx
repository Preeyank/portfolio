import { useEffect, useState, useRef, useCallback } from 'react'
import './EasterEgg.css'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

// ── Intro lines (typed out on open) ──
const INTRO: string[] = [
  '> SYSTEM ACCESS GRANTED',
  '> Loading profile: priyank.bardolia ...',
  '',
  '  Welcome to the other side.',
  '  Type "help" to see what\'s here.',
  '',
]

// ── Command responses ──
const COMMANDS: Record<string, string[]> = {
  help: [
    '',
    '  Available commands:',
    '',
    '  help          you\'re looking at it',
    '  whoami        the short version',
    '  skills        what I work with',
    '  story         how it started',
    '  resume        download my resume',
    '  hire          you know you want to',
    '  secret        if you dare',
    '  clear         wipe the terminal',
    '  exit          close this window',
    '',
  ],
  whoami: [
    '',
    '  Full-stack engineer. Seattle.',
    '  Founding engineer energy — zero-to-one is where I live.',
    '  I care about systems that scale and interfaces that don\'t suck.',
    '',
  ],
  skills: [
    '',
    '  Languages    Python ████████████░░  TypeScript ██████████░░░░',
    '               Go ██████░░░░░░░░  C# ████████░░░░░░',
    '',
    '  Frontend     React ██████████████  Next.js ████████████░░',
    '',
    '  Backend      FastAPI ████████████░░  Node.js ██████████░░░░',
    '',
    '  Infra        AWS ██████████████  Docker ██████████░░░░',
    '               DynamoDB ████████████░░  PostgreSQL ██████████░░░░',
    '',
    '  Also:        Kinesis, Lambda, CDK, SES, S3, API Gateway,',
    '               Prisma, Better Auth, CI/CD, BDD testing',
    '',
  ],
  story: [
    '',
    '  Age 16: wrote a Python script that scraped cricket scores.',
    '  It broke every other week. I loved it.',
    '',
    '  Built my first real app at Cepheid — C# .NET, 10K users.',
    '  Then Scale AI — teaching LLMs to code better than me.',
    '  Now GE Healthcare — processing billions of events.',
    '',
    '  The pattern: find a hard problem, build the ugly v1,',
    '  then polish it until it feels inevitable.',
    '',
    '  This portfolio? v47. (I counted.)',
    '',
  ],
  resume: [
    '',
    '  > Preparing download...',
    '  > Just kidding. Email me: bardoliapriyank05@gmail.com',
    '  > Or find me on LinkedIn: priyank-bardolia',
    '',
  ],
  hire: [
    '',
    '  > sudo hire priyank --force',
    '',
    '  ✓ Email copied to clipboard.',
    '  ✓ Your future just got better.',
    '',
    '  bardoliapriyank05@gmail.com',
    '',
  ],
  secret: [
    '',
    '  Runs on: chai, lo-fi, and the fear of stale PRs.',
    '',
    '  Believes every great product starts as an ugly',
    '  prototype in someone\'s terminal at 2 AM.',
    '',
    '  Has mass-produced bugs before shipping features.',
    '  Still does sometimes. But now with 94% test coverage.',
    '',
    '  If you found this, you\'re the kind of person',
    '  I want to work with.',
    '',
  ],
}

const UNKNOWN = (cmd: string) => [
  '',
  `  command not found: ${cmd}`,
  '  Type "help" for available commands.',
  '',
]

type Line = { text: string; type: 'output' | 'input' }

export default function EasterEgg() {
  const [active, setActive] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [introComplete, setIntroComplete] = useState(false)
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputElRef = useRef<HTMLInputElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // ── Konami listener ──
  useEffect(() => {
    const seq: string[] = []

    const onKeyDown = (e: KeyboardEvent) => {
      if (active) return
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      seq.push(key)

      // Only keep last N keys
      if (seq.length > KONAMI.length) seq.shift()

      if (seq.length === KONAMI.length && seq.every((k, i) => k === KONAMI[i])) {
        setActive(true)
        seq.length = 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  // ── Play intro on activate ──
  useEffect(() => {
    if (!active) return

    setLines([])
    setIntroComplete(false)
    setInput('')
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    INTRO.forEach((text, i) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, { text, type: 'output' }])
      }, i * 400)
      timersRef.current.push(t)
    })

    const finalTimer = setTimeout(() => {
      setIntroComplete(true)
    }, INTRO.length * 400 + 200)
    timersRef.current.push(finalTimer)

    return () => timersRef.current.forEach(clearTimeout)
  }, [active])

  // ── Auto-scroll + focus ──
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    if (introComplete) inputElRef.current?.focus()
  }, [introComplete])

  // ── Run command ──
  const runCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const inputLine: Line = { text: `> ${cmd}`, type: 'input' }

    if (trimmed === 'clear') {
      setLines([])
      return
    }

    if (trimmed === 'exit') {
      close()
      return
    }

    if (trimmed === 'hire' || trimmed === 'sudo hire priyank' || trimmed === 'sudo hire priyank --force') {
      navigator.clipboard.writeText('bardoliapriyank05@gmail.com').catch(() => {})
    }

    const response = COMMANDS[trimmed] || UNKNOWN(trimmed)
    const outputLines: Line[] = response.map(text => ({ text, type: 'output' }))

    setLines(prev => [...prev, inputLine, ...outputLines])
  }, [])

  const close = () => {
    setActive(false)
    setLines([])
    setIntroComplete(false)
    setInput('')
    timersRef.current.forEach(clearTimeout)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    runCommand(input)
    setInput('')
  }

  if (!active) return null

  return (
    <div className="egg" onClick={close}>
      <div className="egg__scanline" />
      <div className="egg__terminal" onClick={(e) => { e.stopPropagation(); inputElRef.current?.focus() }}>
        <div className="egg__header">
          <span className="egg__dots">
            <span className="egg__dot egg__dot--red" onClick={close} />
            <span className="egg__dot egg__dot--yellow" />
            <span className="egg__dot egg__dot--green" />
          </span>
          <span className="egg__title">priyank@portfolio ~ %</span>
        </div>
        <div className="egg__body" ref={bodyRef}>
          {lines.map((line, i) => (
            <div key={i} className={`egg__line ${line.type === 'input' ? 'egg__line--accent' : ''}`}>
              {line.text}
            </div>
          ))}
          {!introComplete && (
            <span className="egg__cursor">▋</span>
          )}
          {introComplete && (
            <form onSubmit={handleSubmit} className="egg__prompt">
              <span className="egg__prompt-symbol">&gt;</span>
              <input
                ref={inputElRef}
                className="egg__input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
