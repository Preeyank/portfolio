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

// Matches a leading [[scroll:section]] marker. The model is instructed to emit
// it only at the very start of a reply.
const SCROLL_MARKER = /^\s*\[\[scroll:([a-z]+)\]\]/i

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

      // The model may emit a leading [[scroll:id]] marker. It can arrive split
      // across chunks, so we accumulate the raw reply and only strip + fire the
      // scroll once the marker is fully resolved. `markerResolved` flips true
      // after we've either consumed a marker or confirmed there isn't one, so
      // we stop re-checking and pass text straight through afterward.
      let rawReply = ''
      let markerResolved = false

      // True while the accumulated text is still a prefix of "[[scroll:id]]"
      // that hasn't closed yet (e.g. "[[scro", "[[scroll:wor"). We hold back
      // rendering until the marker either completes or is ruled out.
      const PARTIAL_MARKER = /^\s*(\[(\[(s(c(r(o(l(l(:[a-z]*)?)?)?)?)?)?)?)?)?$/i
      const couldBePartialMarker = (s: string) => PARTIAL_MARKER.test(s)

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

          if (!markerResolved) {
            const match = rawReply.match(SCROLL_MARKER)
            if (match) {
              // Full marker found — fire the scroll (if valid) and strip it.
              const id = match[1].toLowerCase()
              if (SCROLLABLE_IDS.has(id)) scrollToSection(id)
              rawReply = rawReply.slice(match[0].length).replace(/^\s+/, '')
              markerResolved = true
            } else if (couldBePartialMarker(rawReply)) {
              // Still might be a marker mid-arrival — hold back, render nothing yet.
              continue
            } else {
              // No marker present; nothing to strip from here on.
              markerResolved = true
            }
          }

          pushClean(rawReply)
        }
      }

      // Stream ended while still holding back a partial-looking marker that
      // never completed (e.g. the whole reply was literally "[[scroll" garbage).
      // Flush it so the visitor isn't left with an empty bubble.
      if (!markerResolved) pushClean(rawReply)
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
