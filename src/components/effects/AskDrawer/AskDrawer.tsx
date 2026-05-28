import { useEffect, useRef, useState } from 'react'
import { useAskAgent } from '../../../hooks'
import { ASK_STARTER_CHIPS } from '../../../content'
import { linkify } from './linkify'
import './AskDrawer.css'

const EXIT_MS = 360

interface AskDrawerProps {
  open: boolean
  onClose: () => void
  // A question to auto-send when the drawer opens (e.g. a Hero suggestion chip).
  initialQuestion?: string | null
  // Called once the initialQuestion has been consumed, so the parent can clear it.
  onConsumeQuestion?: () => void
}

export default function AskDrawer({
  open,
  onClose,
  initialQuestion,
  onConsumeQuestion,
}: AskDrawerProps) {
  const { messages, isStreaming, error, send, reset } = useAskAgent()
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the panel mounted through its exit animation. `open` drives the
  // intent; `rendered` drives whether the DOM exists. `closing` is derived —
  // it's simply "still rendered but no longer open" — so no setState needed.
  const [rendered, setRendered] = useState(open)
  const closing = rendered && !open

  // Opening is derivable during render (React's "adjust state while rendering"
  // pattern) — no effect needed, avoids a cascading-render lint error.
  if (open && !rendered) {
    setRendered(true)
  }

  // Closing needs a timer: once `open` flips false, wait for the slide-out
  // animation, then unmount. The exit class is driven by the derived `closing`.
  useEffect(() => {
    if (open || !rendered) return
    const t = setTimeout(() => setRendered(false), EXIT_MS)
    return () => clearTimeout(t)
  }, [open, rendered])

  // Focus the input when the drawer opens.
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [open])

  // Auto-send a question handed in via initialQuestion (Hero chip click).
  // Runs once per opened question; onConsumeQuestion clears it in the parent
  // so re-renders don't re-fire it.
  useEffect(() => {
    if (!open || !initialQuestion) return
    send(initialQuestion)
    onConsumeQuestion?.()
  }, [open, initialQuestion, send, onConsumeQuestion])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Auto-scroll to bottom as new tokens stream in.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  const submit = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    send(trimmed)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(input)
    }
  }

  if (!rendered) return null

  const hasMessages = messages.length > 0

  return (
    <div
      className={`ask ${closing ? 'ask--closing' : 'ask--open'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Ask Preeyank"
    >
      <div className="ask__backdrop" onClick={onClose} />
      <aside className="ask__panel">
        <header className="ask__header">
          <div className="ask__title">
            <span
              className={`ask__dot ${isStreaming ? 'ask__dot--thinking' : ''}`}
              aria-hidden="true"
            />
            <span className="ask__title-text">Ask Preeyank</span>
            <span className="ask__status">{isStreaming ? 'THINKING…' : 'READY'}</span>
          </div>
          <div className="ask__header-actions">
            {hasMessages && (
              <button
                type="button"
                className="ask__reset"
                onClick={reset}
                disabled={isStreaming}
              >
                clear
              </button>
            )}
            <button
              type="button"
              className="ask__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </header>

        <div className="ask__messages" ref={scrollRef}>
          {!hasMessages && !error && (
            <div className="ask__empty">
              <p className="ask__empty-prompt">Ask me anything about my work.</p>
              <div className="ask__chips">
                {ASK_STARTER_CHIPS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="ask__chip"
                    onClick={() => submit(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const isLast = m === messages[messages.length - 1]
            const isModelStreaming = m.role === 'model' && isStreaming && isLast
            // Before the first token arrives the model bubble is empty — show a
            // bouncing typing indicator instead of an empty bubble + caret.
            const showTyping = isModelStreaming && m.content === ''
            return (
              <div key={m.id} className={`ask__msg ask__msg--${m.role}`}>
                <div className="ask__bubble">
                  {showTyping ? (
                    <span className="ask__typing" aria-label="Thinking">
                      <span /><span /><span />
                    </span>
                  ) : (
                    <>
                      {m.role === 'model' ? linkify(m.content) : m.content}
                      {isModelStreaming && <span className="ask__caret" aria-hidden="true" />}
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {error && <div className="ask__error">{error}</div>}
        </div>

        <form className="ask__form" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="ask__input"
            placeholder="Ask me anything…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              // Auto-grow: reset then match content, capped by max-height in CSS.
              const el = e.target
              el.style.height = 'auto'
              el.style.height = `${el.scrollHeight}px`
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isStreaming}
            spellCheck={false}
          />
          <button
            type="submit"
            className="ask__send"
            disabled={!input.trim() || isStreaming}
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2 .4 6.4Z" fill="currentColor" />
            </svg>
          </button>
        </form>

        <footer className="ask__footer">
          Powered by Gemini · Grounded in my real CV
        </footer>
      </aside>
    </div>
  )
}
