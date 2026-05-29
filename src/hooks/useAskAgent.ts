/**
 * useAskAgent — conversation state machine for the Ask Preeyank chatbot.
 *
 * Owns the message list and drives the SSE stream from /api/ask. The hook is
 * intentionally headless — UI components subscribe to {messages, isStreaming,
 * error} and call send()/reset(). No drawer or transport concerns leak in.
 *
 * Streaming protocol matches the edge function: each SSE event is
 *   data: {"text": "..."}        // partial token
 *   data: {"done": true}         // terminal marker
 *   data: {"error": "..."}       // upstream/transport failure
 */

import { useCallback, useRef, useState } from 'react'
import type { AgentMessage } from '../types'

const ENDPOINT = '/api/ask'

// Sections the model is allowed to scroll to (must match the IDs in _prompt.ts
// and the actual DOM section ids).
const SCROLLABLE_IDS = new Set(['work', 'projects', 'about', 'now', 'contact'])

// Matches a complete [[scroll:section]] marker ANYWHERE in the text. The model
// is told to emit it at the start, but a small model sometimes drops it mid-
// reply, so we strip it wherever it lands rather than only at the start.
const SCROLL_MARKER = /\[\[scroll:([a-z]+)\]\]/i
const SCROLL_MARKER_GLOBAL = /\[\[scroll:[a-z]+\]\]/gi

// Matches a partial marker still arriving at the END of the stream (a prefix of
// "[[scroll:id]]" like "[[scro" or "[[scroll:wor"), so we can hold it back until
// it either completes or the stream ends — never flashing a half marker.
const TRAILING_PARTIAL = /\[(\[(s(c(r(o(l(l(:[a-z]*(\])?)?)?)?)?)?)?)?)?$/i

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function useAskAgent() {
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Abort the in-flight request when the user resets or unmounts.
  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setMessages([])
    setIsStreaming(false)
    setError(null)
  }, [])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    setError(null)

    const userMsg: AgentMessage = { id: makeId(), role: 'user', content: trimmed }
    const modelMsg: AgentMessage = { id: makeId(), role: 'model', content: '' }

    // Snapshot the history we'll send to the server BEFORE appending the
    // empty model placeholder — the API expects only fully-formed turns.
    const historyForServer = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    setMessages((prev) => [...prev, userMsg, modelMsg])
    setIsStreaming(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyForServer }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => ({}))
        if (payload.error) throw new Error(payload.error)
        if (res.status === 429) {
          throw new Error("You're sending messages too quickly — give it a moment and try again.")
        }
        if (res.status >= 500) {
          throw new Error('The server hit a snag. Please try again in a bit.')
        }
        throw new Error(`Request failed (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      // Accumulate the raw reply untouched; the visible text is always derived
      // from it. A [[scroll:id]] marker can appear anywhere and arrive split
      // across chunks, so we (a) fire the scroll once when a complete marker
      // first appears, and (b) strip every marker + hold back any trailing
      // partial before rendering.
      let rawReply = ''
      let scrollFired = false

      // Derive the visible text: strip complete markers (replacing with a space
      // so adjacent words don't fuse), optionally hold back a trailing partial
      // marker mid-arrival, then tidy whitespace so paragraph breaks survive.
      const toDisplay = (raw: string, final: boolean): string => {
        let out = raw.replace(SCROLL_MARKER_GLOBAL, ' ')
        if (!final) {
          const partial = out.match(TRAILING_PARTIAL)
          if (partial) out = out.slice(0, out.length - partial[0].length)
        }
        return out
          .replace(/[ \t]{2,}/g, ' ')
          .replace(/ *\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim()
      }

      const pushClean = (visibleSoFar: string) => {
        setMessages((prev) => {
          const next = prev.slice()
          const last = next[next.length - 1]
          if (last && last.id === modelMsg.id) {
            next[next.length - 1] = { ...last, content: visibleSoFar }
          }
          return next
        })
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // SSE events are separated by a blank line. Split on \n\n so we
        // never parse a half-received JSON payload.
        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''

        for (const evt of events) {
          const line = evt.split('\n').find((l) => l.startsWith('data:'))
          if (!line) continue
          const data = line.slice(5).trim()
          if (!data) continue

          let parsed: { text?: string; done?: boolean; error?: string }
          try {
            parsed = JSON.parse(data)
          } catch {
            continue
          }

          if (parsed.error) throw new Error(parsed.error)
          if (parsed.done) continue
          if (!parsed.text) continue

          rawReply += parsed.text

          // Fire the scroll once, as soon as a complete marker appears anywhere.
          if (!scrollFired) {
            const match = rawReply.match(SCROLL_MARKER)
            if (match) {
              const id = match[1].toLowerCase()
              if (SCROLLABLE_IDS.has(id)) {
                scrollToSection(id)
                scrollFired = true
              }
            }
          }

          pushClean(toDisplay(rawReply, false))
        }
      }

      // Final render: stream is done, so don't hold back any trailing partial —
      // whatever's left was never a real marker.
      pushClean(toDisplay(rawReply, true))
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      // A failed fetch (no network, server unreachable) rejects with a
      // TypeError rather than a thrown Error with our message.
      const isNetwork = err instanceof TypeError
      const msg = isNetwork
        ? "Couldn't reach the server — check your connection and try again."
        : err instanceof Error ? err.message : 'Something went wrong.'
      setError(msg)
      // Drop the empty model placeholder if no tokens streamed in.
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last && last.id === modelMsg.id && last.content === '') {
          return prev.slice(0, -1)
        }
        return prev
      })
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [isStreaming, messages])

  return { messages, isStreaming, error, send, reset }
}
