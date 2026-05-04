import { useEffect, useRef, useState, useCallback } from 'react'
import type { TerminalLine } from '../../../types'
import {
  TERMINAL_INTRO,
  COMMANDS,
  HIRE_ALIASES,
  unknownCommand,
  EMAIL,
  RESUME_URL,
  RESUME_FILENAME,
} from '../../../content'

interface TerminalProps {
  onClose: () => void
}

export default function Terminal({ onClose }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [introComplete, setIntroComplete] = useState(false)
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputElRef = useRef<HTMLInputElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    TERMINAL_INTRO.forEach((text, i) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, { text, type: 'output' }])
      }, i * 400)
      timersRef.current.push(t)
    })

    const finalTimer = setTimeout(() => setIntroComplete(true), TERMINAL_INTRO.length * 400 + 200)
    timersRef.current.push(finalTimer)

    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
  }, [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    if (introComplete) inputElRef.current?.focus()
  }, [introComplete])

  const runCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const inputLine: TerminalLine = { text: `> ${cmd}`, type: 'input' }

    if (trimmed === 'clear') { setLines([]); return }
    if (trimmed === 'exit') { onClose(); return }

    if ((HIRE_ALIASES as readonly string[]).includes(trimmed)) {
      navigator.clipboard.writeText(EMAIL).catch(() => {})
    }

    if (trimmed === 'resume') {
      const a = document.createElement('a')
      a.href = RESUME_URL
      a.download = RESUME_FILENAME
      a.click()
    }

    const response = COMMANDS[trimmed] ?? unknownCommand(trimmed)
    const outputLines: TerminalLine[] = response.map(text => ({ text, type: 'output' }))

    setLines(prev => [...prev, inputLine, ...outputLines])
  }, [onClose])

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    runCommand(input)
    setInput('')
  }

  return (
    <div className="egg__terminal" onClick={(e) => { e.stopPropagation(); inputElRef.current?.focus() }}>
      <div className="egg__header">
        <span className="egg__dots">
          <span className="egg__dot egg__dot--red" onClick={onClose} />
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
        {!introComplete && <span className="egg__cursor">▋</span>}
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
  )
}
