import type { CommandRegistry } from '../types'
import { EMAIL, RESUME_FILENAME } from './contact'

export const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
] as const

export const TERMINAL_INTRO: string[] = [
  '> SYSTEM ACCESS GRANTED',
  '> Loading profile: priyank.bardolia ...',
  '',
  '  Welcome to the other side.',
  '  Type "help" to see what\'s here.',
  '',
]

export const COMMANDS: CommandRegistry = {
  help: [
    '',
    '  Available commands:',
    '',
    '  help          you\'re looking at it',
    '  whoami        the short version',
    '  skills        what I work with',
    '  story         how it started',
    '  resume        download my resume',
    '  hire          you know you want to',
    '  secret        if you dare',
    '  clear         wipe the terminal',
    '  exit          close this window',
    '',
  ],
  whoami: [
    '',
    '  Full-stack engineer. Seattle.',
    '  Founding engineer energy — zero-to-one is where I live.',
    '  I care about systems that scale and interfaces that don\'t suck.',
    '',
  ],
  skills: [
    '',
    '  Languages    Python ████████████░░  TypeScript ██████████░░░░',
    '               Go ██████░░░░░░░░  C# ████████░░░░░░',
    '',
    '  Frontend     React ██████████████  Next.js ████████████░░',
    '',
    '  Backend      FastAPI ████████████░░  Node.js ██████████░░░░',
    '',
    '  Infra        AWS ██████████████  Docker ██████████░░░░',
    '               DynamoDB ████████████░░  PostgreSQL ██████████░░░░',
    '',
    '  Also:        Kinesis, Lambda, CDK, SES, S3, API Gateway,',
    '               Prisma, Better Auth, CI/CD, BDD testing',
    '',
  ],
  story: [
    '',
    '  Age 16: wrote a Python script that scraped cricket scores.',
    '  It broke every other week. I loved it.',
    '',
    '  Built my first real app at Cepheid — C# .NET, 10K users.',
    '  Then Scale AI — teaching LLMs to code better than me.',
    '  Now GE Healthcare — processing billions of events.',
    '',
    '  The pattern: find a hard problem, build the ugly v1,',
    '  then polish it until it feels inevitable.',
    '',
    '  This portfolio? Lost count of the versions.',
    '',
  ],
  resume: [
    '',
    '  > Preparing download...',
    `  ✓ ${RESUME_FILENAME} — done.`,
    '',
  ],
  hire: [
    '',
    '  > sudo hire priyank --force',
    '',
    '  ✓ Email copied to clipboard.',
    '  ✓ Your future just got better.',
    '',
    `  ${EMAIL}`,
    '',
  ],
  secret: [
    '',
    '  Runs on: chai, lo-fi, and the fear of stale PRs.',
    '',
    '  Believes every great product starts as an ugly',
    '  prototype in someone\'s terminal at 2 AM.',
    '',
    '  Has mass-produced bugs before shipping features.',
    '  Still does sometimes. But now with 94% test coverage.',
    '',
    '  If you found this, you\'re the kind of person',
    '  I want to work with.',
    '',
  ],
}

export const HIRE_ALIASES = ['hire', 'sudo hire priyank', 'sudo hire priyank --force'] as const

export const unknownCommand = (cmd: string): string[] => [
  '',
  `  command not found: ${cmd}`,
  '  Type "help" for available commands.',
  '',
]
