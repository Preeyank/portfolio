export interface Job {
  company: string
  role: string
  period: string
  location: string
  badge: string | null
  bullets: string[]
  stack: string[]
}

export interface Project {
  name: string
  status: string
  description: string
  stack: string[]
  live: string
  github: string
}

export interface Fact {
  value: string
  label: string
}

export interface ContactLink {
  label: string
  value: string
  href: string
}

export interface NavLink {
  label: string
  id: string
}

export interface StackItem {
  label: string
  icon: string
  color: string
}

export type TerminalLine = { text: string; type: 'output' | 'input' }

export type CommandRegistry = Record<string, string[]>
