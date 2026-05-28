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

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
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
        throw new Error(payload.error ?? `Request failed (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

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

          if (parsed.text) {
            const chunk = parsed.text
            setMessages((prev) => {
              const next = prev.slice()
              const last = next[next.length - 1]
              if (last && last.id === modelMsg.id) {
                next[next.length - 1] = { ...last, content: last.content + chunk }
              }
              return next
            })
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
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
