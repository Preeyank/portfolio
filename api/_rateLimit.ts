/**
 * Per-IP and global rate limiting for /api/ask.
 *
 * Uses module-scoped Maps. On Vercel, serverless instances are reused
 * across warm invocations within the same region, so this works as a
 * best-effort throttle — not a hard guarantee. For a portfolio chatbot
 * with the cost ceiling we care about (1000 req/day on free tier), this
 * is plenty.
 */

const PER_IP_LIMIT = 5            // max requests
const PER_IP_WINDOW_MS = 60_000   // per minute, per IP
const DAILY_LIMIT = 1000          // global hard cap across all IPs

interface IpBucket {
  timestamps: number[]
}

const ipBuckets = new Map<string, IpBucket>()

let dailyCount = 0
let dailyResetAt = startOfNextDay()

function startOfNextDay(): number {
  const now = new Date()
  const next = new Date(now)
  next.setUTCHours(24, 0, 0, 0)
  return next.getTime()
}

export interface RateLimitResult {
  ok: boolean
  reason?: 'ip' | 'daily'
  retryAfterSeconds?: number
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now()

  // Roll over daily counter if we've crossed midnight UTC
  if (now >= dailyResetAt) {
    dailyCount = 0
    dailyResetAt = startOfNextDay()
  }

  // Global daily cap — protects the wallet, hard stop
  if (dailyCount >= DAILY_LIMIT) {
    return {
      ok: false,
      reason: 'daily',
      retryAfterSeconds: Math.ceil((dailyResetAt - now) / 1000),
    }
  }

  // Per-IP sliding window
  const bucket = ipBuckets.get(ip) ?? { timestamps: [] }
  const cutoff = now - PER_IP_WINDOW_MS
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff)

  if (bucket.timestamps.length >= PER_IP_LIMIT) {
    const oldest = bucket.timestamps[0]
    return {
      ok: false,
      reason: 'ip',
      retryAfterSeconds: Math.ceil((oldest + PER_IP_WINDOW_MS - now) / 1000),
    }
  }

  bucket.timestamps.push(now)
  ipBuckets.set(ip, bucket)
  dailyCount += 1

  return { ok: true }
}

export function getClientIp(request: Request): string {
  // Vercel forwards the real client IP in x-forwarded-for (first entry).
  // Fall back to a constant so local dev requests still hit the rate limiter.
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'local'
}
