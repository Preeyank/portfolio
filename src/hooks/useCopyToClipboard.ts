import { useState } from 'react'

export function useCopyToClipboard(resetMs: number = 1500) {
  const [copied, setCopied] = useState(false)

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), resetMs)
    }).catch(() => {})
  }

  return { copied, copy }
}
