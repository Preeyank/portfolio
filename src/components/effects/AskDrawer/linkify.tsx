/**
 * Turn plain answer text into React nodes with clickable emails and URLs.
 *
 * Emails render as a click-to-copy button (copies to clipboard, shows a brief
 * "copied" state) rather than a mailto link, since copying is the common intent
 * in a chat. URLs render as real anchors that open in a new tab.
 */

import { useState } from 'react'

// One pass matches either a URL or a bare email.
const TOKEN = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?])|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi

function EmailChip({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }).catch(() => {})
  }
  return (
    <button type="button" className="ask__link ask__link--email" onClick={copy} title="Copy email">
      {copied ? 'copied ✓' : email}
    </button>
  )
}

export function linkify(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  TOKEN.lastIndex = 0

  let key = 0
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))

    const [, url, email] = m
    if (url) {
      out.push(
        <a
          key={`l${key++}`}
          className="ask__link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </a>
      )
    } else if (email) {
      out.push(<EmailChip key={`e${key++}`} email={email} />)
    }

    last = m.index + m[0].length
  }

  if (last < text.length) out.push(text.slice(last))
  return out
}
