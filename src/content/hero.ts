import type { StackItem } from '../types'
import pythonIcon from '../assets/python.svg'
import awsIcon from '../assets/aws.svg'
import ragIcon from '../assets/rag.svg'
import llmIcon from '../assets/llm.svg'
import agentsIcon from '../assets/agents.svg'

export const NAME_UPRIGHT = 'Pri'
export const NAME_ITALIC = 'yank'

// Example questions cycled under the Hero prompt bar. Clicking one opens the
// Ask Preeyank drawer and auto-sends it. Keep these answerable from the
// résumé-grounded system prompt — vague questions produce vague answers.
export const HERO_ASK_SUGGESTIONS: string[] = [
  'What did you build at GE Healthcare?',
  'Tell me about your projects',
  'What is your strongest tech stack?',
  'How many years of experience do you have?',
  'What kind of roles are you looking for?',
  'Walk me through your most challenging project',
  'What did you work on at Scale AI?',
  'Are you open to relocating?',
]

// First 4 are reused as the Ask drawer's empty-state starter chips.
export const ASK_STARTER_CHIPS: string[] = HERO_ASK_SUGGESTIONS.slice(0, 4)

export const HERO_STACK: StackItem[] = [
  { label: 'TypeScript',      icon: 'https://cdn.simpleicons.org/typescript', color: '49,120,198'  },
  { label: 'React',           icon: 'https://cdn.simpleicons.org/react',      color: '97,218,251'  },
  { label: 'Next.js',         icon: 'https://cdn.simpleicons.org/nextdotjs',  color: '255,255,255' },
  { label: 'Python',          icon: pythonIcon,                               color: '55,118,171'  },
  { label: 'Node.js',         icon: 'https://cdn.simpleicons.org/nodedotjs',  color: '95,160,78'   },
  { label: 'PostgreSQL',      icon: 'https://cdn.simpleicons.org/postgresql', color: '65,105,225'  },
  { label: 'AWS',             icon: awsIcon,                                  color: '255,153,0'   },
  { label: 'FastAPI',         icon: 'https://cdn.simpleicons.org/fastapi',    color: '0,150,136'   },
  { label: 'Docker',          icon: 'https://cdn.simpleicons.org/docker',     color: '36,150,237'  },
  { label: 'RAG',             icon: ragIcon,                                  color: '124,158,247' },
  { label: 'LLMs',            icon: llmIcon,                                  color: '167,139,250' },
  { label: 'AI Agents',       icon: agentsIcon,                               color: '52,211,153'  },
]
