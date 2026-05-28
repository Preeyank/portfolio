/**
 * POST /api/ask — Ask Preeyank chatbot proxy.
 *
 * Edge runtime. Receives a conversation history from the browser,
 * forwards it to Gemini 2.5 Flash with the resume-grounded system prompt,
 * and streams the response back as Server-Sent Events.
 *
 * The browser never sees the Gemini API key.
 */

import { buildSystemPrompt } from './_prompt'
import { checkRateLimit, getClientIp } from './_rateLimit'

export const config = {
  runtime: 'edge',
}

const GEMINI_MODEL = 'gemini-3.1-flash-lite'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`

const MAX_USER_MESSAGE_LEN = 1000
const MAX_MESSAGES_PER_REQUEST = 20

interface ClientMessage {
  role: 'user' | 'model'
  content: string
}

interface GeminiContent {
  role: 'user' | 'model'
  parts: { text: string }[]
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function isValidMessage(m: unknown): m is ClientMessage {
  if (typeof m !== 'object' || m === null) return false
  const obj = m as Record<string, unknown>
  return (
    (obj.role === 'user' || obj.role === 'model') &&
    typeof obj.content === 'string' &&
    obj.content.length > 0 &&
    obj.content.length <= MAX_USER_MESSAGE_LEN
  )
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: 'Server misconfigured: missing API key' }, 500)
  }

  // Rate limit before doing any work
  const ip = getClientIp(request)
  const limit = checkRateLimit(ip)
  if (!limit.ok) {
    return new Response(
      JSON.stringify({
        error: limit.reason === 'daily' ? 'Daily limit reached. Try tomorrow.' : 'Slow down — too many questions in a short time.',
        retryAfter: limit.retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(limit.retryAfterSeconds ?? 60),
        },
      }
    )
  }

  // Parse + validate the request body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  const messages = (body as { messages?: unknown })?.messages
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES_PER_REQUEST) {
    return jsonResponse({ error: 'Invalid messages array' }, 400)
  }
  if (!messages.every(isValidMessage)) {
    return jsonResponse({ error: 'Invalid message format' }, 400)
  }

  // Convert to Gemini's content shape
  const contents: GeminiContent[] = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }))

  // Call Gemini with streaming enabled
  const geminiResponse = await fetch(`${GEMINI_URL}&key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: buildSystemPrompt() }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
        topP: 0.95,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  })

  if (!geminiResponse.ok || !geminiResponse.body) {
    const errText = await geminiResponse.text().catch(() => '')
    return jsonResponse(
      { error: 'Upstream model error', detail: errText.slice(0, 300) },
      geminiResponse.status || 502
    )
  }

  // Transform Gemini's SSE stream → our own minimal SSE: `data: {"text":"..."}`
  // The browser only needs the text chunks, not Gemini's full envelope.
  const reader = geminiResponse.body.getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = ''

      const send = (payload: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Gemini SSE events are newline-delimited "data: {...}" lines
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (!data || data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data) as {
                candidates?: { content?: { parts?: { text?: string }[] } }[]
              }
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
              if (text) send({ text })
            } catch {
              // Ignore malformed chunks — Gemini occasionally sends partials
            }
          }
        }

        send({ done: true })
      } catch (err) {
        send({ error: err instanceof Error ? err.message : 'Stream error' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
