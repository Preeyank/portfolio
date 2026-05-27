import type { Project } from '../types'

export const PROJECTS: Project[] = [
  {
    name: 'API Sentinel',
    status: 'In Progress',
    description: 'AI-powered API uptime monitoring SaaS. Detects outages, triages incidents automatically, and notifies you before your users do.',
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'Better Auth', 'shadcn/ui', 'Vercel', 'Claude API'],
    live: 'https://apisentinelhq.vercel.app',
    github: 'https://github.com/Preeyank/api-sentinel',

    problem: 'Most uptime monitors tell you that an endpoint is down, but not why. Engineers still have to dig through logs, recent deploys, and dependency status to figure out whether it is their code, a third-party outage, or an infra issue. That triage step is where minutes (and customer trust) get burned during incidents.',

    motivation: 'I wanted to build something that closes the loop between detection and diagnosis. Traditional monitoring stops at "your endpoint returned 500"; I wanted the system to take the next step — reason about the failure, correlate it with recent changes, and hand the on-call engineer a head start instead of a pager.',

    highlights: [
      'Automated health checks run every minute against any HTTP endpoint a user adds — tracking status code, response time, and a snippet of the response.',
      'Smart incident detection that distinguishes between two kinds of issues: outright failures (wrong status code, network errors) and latency spikes (the API works, but is slow). Both can happen at the same time and are tracked separately.',
      'A clean dashboard showing uptime percentage, a latency chart over time, and a history of recent checks for each monitor.',
      'Email + password sign-up plus GitHub and Google login, with users only ever seeing their own monitors.',
      'AI-powered incident triage (in progress) — when an incident opens, the system will generate a short note suggesting likely causes and next debugging steps.',
    ],

    challenges: [
      "Making sure two checks running at the same time don't accidentally create duplicate incidents for the same monitor — required careful coordination at the database layer.",
      "Keeping the check engine reliable: if one monitor's check fails unexpectedly, it shouldn't break the rest of the batch running alongside it.",
      'Designing the data model so that "down" and "slow" are treated as separate issues — a slow-but-working API and a totally-down API need different responses, and both states can coexist.',
    ],

    learnings: [
      'Reliability work is mostly about edge cases. The happy path is easy; the interesting engineering happens when you start asking "what if this runs twice?" or "what if this one task fails?"',
      'Small, focused constants (timeouts, thresholds, retry counts) in one place make a system much easier to reason about and tune later.',
      'Shipping a focused product end-to-end teaches more than building any single piece in isolation — the trade-offs only show up when everything is connected.',
    ],

    notes: "Solo project, ongoing. The core monitoring system is done; the AI-powered triage layer is the next milestone, and it's the part I'm most excited about — it's where the project stops being \"another uptime monitor\" and starts being something genuinely useful.",
  },
]
