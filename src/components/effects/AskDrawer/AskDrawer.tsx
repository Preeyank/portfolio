import { useEffect, useRef, useState } from 'react'
import { useAskAgent } from '../../../hooks'
import './AskDrawer.css'

interface AskDrawerProps {
  open: boolean
  onClose: () => void
}

export default function AskDrawer({ open, onClose }: AskDrawerProps) {
  const { messages, isStreaming, error, send, reset } = useAskAgent()
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Focus the input when the drawer opens.
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [open])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isStreaming) return
    setInput('')
    send(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  if (!open) return null

  return (
    <div className="ask" role="dialog" aria-modal="true" aria-label="Ask Preeyank">
      <div className="ask__backdrop" onClick={onClose} />
      <aside className="ask__panel">
        <header className="ask__header">
          <div className="ask__title">
            <span className="ask__dot" aria-hidden="true" />
            <span className="ask__title-text">Ask Preeyank</span>
          </div>
          <div className="ask__header-actions">
            {messages.length > 0 && (
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
          {messages.length === 0 && !error && (
            <div className="ask__empty">
              Ask about my work, projects, or experience.
            </div>
          )}

          {messages.map((m) => {
            const isModelStreaming =
              m.role === 'model' && isStreaming && m === messages[messages.length - 1]
            return (
              <div key={m.id} className={`ask__msg ask__msg--${m.role}`}>
                <div className="ask__bubble">
                  {m.content}
                  {isModelStreaming && <span className="ask__caret" aria-hidden="true" />}
                </div>
              </div>
            )
          })}

          {error && (
            <div className="ask__error">{error}</div>
          )}
        </div>

        <form className="ask__form" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="ask__input"
            placeholder="Ask me anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
            ↵
          </button>
        </form>
      </aside>
    </div>
  )
}
