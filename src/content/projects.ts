import type { Project } from '../types'

export const PROJECTS: Project[] = [
  {
    name: 'API Sentinel',
    status: 'In Progress',
    description: 'AI-powered API uptime monitoring SaaS. Detects outages, triages incidents automatically, and notifies you before your users do.',
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'Better Auth', 'shadcn/ui', 'Vercel', 'Claude API'],
    live: 'https://apisentinelhq.vercel.app',
    github: 'https://github.com/Preeyank/api-sentinel',
  },
]
