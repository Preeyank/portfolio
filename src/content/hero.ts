import type { StackItem } from '../types'
import pythonIcon from '../assets/python.svg'
import awsIcon from '../assets/aws.svg'
import dynamodbIcon from '../assets/dynamodb.svg'

export const NAME_UPRIGHT = 'Pri'
export const NAME_ITALIC = 'yank'

export const HERO_STACK: StackItem[] = [
  { label: 'Python',     icon: pythonIcon,                               color: '55,118,171'  },
  { label: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript', color: '49,120,198'  },
  { label: 'React',      icon: 'https://cdn.simpleicons.org/react',      color: '97,218,251'  },
  { label: 'Next.js',    icon: 'https://cdn.simpleicons.org/nextdotjs',  color: '255,255,255' },
  { label: 'FastAPI',    icon: 'https://cdn.simpleicons.org/fastapi',    color: '0,150,136'   },
  { label: 'Node.js',    icon: 'https://cdn.simpleicons.org/nodedotjs',  color: '95,160,78'   },
  { label: 'AWS',        icon: awsIcon,                                  color: '255,153,0'   },
  { label: 'DynamoDB',   icon: dynamodbIcon,                             color: '64,83,214'   },
  { label: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql', color: '65,105,225'  },
  { label: 'Docker',     icon: 'https://cdn.simpleicons.org/docker',     color: '36,150,237'  },
  { label: 'Go',         icon: 'https://cdn.simpleicons.org/go',         color: '0,172,215'   },
]
