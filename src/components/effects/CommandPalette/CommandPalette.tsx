import { useEffect, useMemo, useRef, useState } from 'react'
import {
  NAV_LINKS,
  CONTACT_LINKS,
  EMAIL,
  RESUME_URL,
  RESUME_FILENAME,
} from '../../../content'
import './CommandPalette.css'

type Command = {
  id: string
  label: string
  hint?: string
  group: 'Navigate' | 'Actions' | 'Links'
  keywords?: string
  icon: string
  href?: string
  run?: () => void
}

const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function highlight(text: string, query: string): React.ReactNode {
  const q = query.trim()
  if (!q) return text

  const tokens = q.split(/\s+/).map((t) => t.toLowerCase()).filter(Boolean)
  if (tokens.length === 0) return text

  const lower = text.toLowerCase()
  const ranges: Array<[number, number]> = []
  for (const t of tokens) {
    let i = lower.indexOf(t)
    while (i !== -1) {
      ranges.push([i, i + t.length])
      i = lower.indexOf(t, i + t.length)
    }
  }
  if (ranges.length === 0) return text

  ranges.sort((a, b) => a[0] - b[0])
  const merged: Array<[number, number]> = []
  for (const [s, e] of ranges) {
    const last = merged[merged.length - 1]
    if (last && s <= last[1]) {
      last[1] = Math.max(last[1], e)
    } else {
      merged.push([s, e])
    }
  }

  const out: React.ReactNode[] = []
  let pos = 0
  merged.forEach(([s, e], idx) => {
    if (s > pos) out.push(<span key={`p${idx}`}>{text.slice(pos, s)}</span>)
    out.push(<mark key={`m${idx}`} className="cmdk__match">{text.slice(s, e)}</mark>)
    pos = e
  })
  if (pos < text.length) out.push(<span key="end">{text.slice(pos)}</span>)
  return out
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  const commands = useMemo<Command[]>(() => {
    const navCmds: Command[] = NAV_LINKS.map((l) => ({
      id: `nav-${l.id}`,
      label: `Go to ${l.label}`,
      hint: `#${l.id}`,
      group: 'Navigate',
      keywords: `${l.label} ${l.id} jump section`,
      icon: '#',
      run: () => { scrollToId(l.id); onClose() },
    }))

    navCmds.unshift({
      id: 'nav-top',
      label: 'Go to Top',
      hint: 'hero',
      group: 'Navigate',
      keywords: 'hero home top start',
      icon: '↑',
      run: () => {
        const hero = document.querySelector('.hero') as HTMLElement | null
        if (hero) {
          hero.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        onClose()
      },
    })

    const actions: Command[] = [
      {
        id: 'copy-email',
        label: 'Copy Email',
        hint: EMAIL,
        group: 'Actions',
        keywords: 'mail contact reach',
        icon: '@',
        run: () => {
          navigator.clipboard.writeText(EMAIL).then(() => {
            setCopied(true)
            setTimeout(() => { setCopied(false); onClose() }, 800)
          }).catch(() => onClose())
        },
      },
      {
        id: 'download-resume',
        label: 'Download Resume',
        hint: RESUME_FILENAME,
        group: 'Actions',
        keywords: 'cv pdf download',
        icon: '↓',
        href: RESUME_URL,
      },
    ]

    const links: Command[] = CONTACT_LINKS
      .filter((l) => l.label !== 'Email')
      .map((l) => ({
        id: `link-${l.label.toLowerCase()}`,
        label: `Open ${l.label}`,
        hint: l.value,
        group: 'Links' as const,
        keywords: `${l.label} ${l.value} external profile`,
        icon: '↗',
        href: l.href,
      }))

    return [...navCmds, ...actions, ...links]
  }, [onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => {
      const haystack = `${c.label} ${c.hint ?? ''} ${c.keywords ?? ''} ${c.group}`.toLowerCase()
      return q.split(/\s+/).every((token) => haystack.includes(token))
    })
  }, [commands, query])

  const grouped = useMemo(() => {
    const order: Command['group'][] = ['Navigate', 'Actions', 'Links']
    return order
      .map((group) => ({ group, items: filtered.filter((c) => c.group === group) }))
      .filter((g) => g.items.length > 0)
  }, [filtered])

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    setActive(0)
    if (!open) setQuery('')
  }

  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setActive(0)
  }

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    return () => {
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => Math.min(filtered.length - 1, i + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => Math.max(0, i - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        itemRefs.current[active]?.click()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, active, onClose])

  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector<HTMLElement>(`[data-active="true"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  if (!open) return null

  let renderIndex = -1

  return (
    <div className="cmdk" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmdk__panel" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk__search">
          <span className="cmdk__search-symbol">/</span>
          <input
            ref={inputRef}
            className="cmdk__input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="type a command or search…"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Search commands"
          />
          <kbd className="cmdk__kbd">esc</kbd>
        </div>

        <div className="cmdk__list" ref={listRef}>
          {grouped.length === 0 && (
            <div className="cmdk__empty">no matches for "{query}"</div>
          )}
          {grouped.map(({ group, items }) => (
            <div key={group} className="cmdk__group">
              <div className="cmdk__group-label">{group}</div>
              {items.map((cmd) => {
                renderIndex += 1
                const isActive = renderIndex === active
                const myIndex = renderIndex
                const itemClass = `cmdk__item ${isActive ? 'cmdk__item--active' : ''}`
                const showCopied = cmd.id === 'copy-email' && copied
                const inner = (
                  <>
                    <span className="cmdk__item-icon" aria-hidden="true">{cmd.icon}</span>
                    <span className="cmdk__item-label">
                      {showCopied ? 'Copied ✓' : highlight(cmd.label, query)}
                    </span>
                    {cmd.hint && (
                      <span className="cmdk__item-hint">{highlight(cmd.hint, query)}</span>
                    )}
                  </>
                )

                if (cmd.href) {
                  const isDownload = cmd.id === 'download-resume'
                  const isMailto = cmd.href.startsWith('mailto:')
                  const opensNewTab = !isDownload && !isMailto
                  return (
                    <a
                      key={cmd.id}
                      ref={(el) => { itemRefs.current[myIndex] = el }}
                      href={cmd.href}
                      target={opensNewTab ? '_blank' : undefined}
                      rel={opensNewTab ? 'noopener noreferrer' : undefined}
                      download={isDownload ? RESUME_FILENAME : undefined}
                      className={itemClass}
                      data-active={isActive}
                      onMouseEnter={() => setActive(myIndex)}
                      onClick={() => { setTimeout(onClose, 0) }}
                    >
                      {inner}
                    </a>
                  )
                }

                return (
                  <button
                    key={cmd.id}
                    ref={(el) => { itemRefs.current[myIndex] = el }}
                    type="button"
                    className={itemClass}
                    data-active={isActive}
                    onMouseEnter={() => setActive(myIndex)}
                    onClick={cmd.run}
                  >
                    {inner}
                  </button>
                )
              })}
            </div>
          ))}

          {!query && (
            <div className="cmdk__group cmdk__group--secrets">
              <div className="cmdk__group-label">Secrets</div>
              <div className="cmdk__hint-row">
                <span className="cmdk__hint-label">Konami</span>
                <span className="cmdk__hint-keys" aria-label="Up Up Down Down Left Right Left Right B A">
                  <kbd className="cmdk__kbd">↑</kbd>
                  <kbd className="cmdk__kbd">↑</kbd>
                  <kbd className="cmdk__kbd">↓</kbd>
                  <kbd className="cmdk__kbd">↓</kbd>
                  <kbd className="cmdk__kbd">←</kbd>
                  <kbd className="cmdk__kbd">→</kbd>
                  <kbd className="cmdk__kbd">←</kbd>
                  <kbd className="cmdk__kbd">→</kbd>
                  <kbd className="cmdk__kbd">B</kbd>
                  <kbd className="cmdk__kbd">A</kbd>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="cmdk__footer">
          <span className="cmdk__footer-item"><kbd className="cmdk__kbd">↑↓</kbd> navigate</span>
          <span className="cmdk__footer-item"><kbd className="cmdk__kbd">↵</kbd> select</span>
          <span className="cmdk__footer-item"><kbd className="cmdk__kbd">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
