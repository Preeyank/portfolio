import type { Fact } from '../types'

export const FACTS: Fact[] = [
  { value: '3+',   label: 'years in production' },
  { value: '94%',  label: 'test coverage at GEHC' },
  { value: '95%',  label: 'onboarding time cut' },
  { value: '10B+', label: 'events processed' },
]

export const BIO: string[] = [
  "I'm a full-stack software engineer based in Seattle, WA — currently building cloud-native platforms at GE Healthcare. I was the founding engineer on a metering system that went from zero to processing billions of events in production, onboarding 6 enterprise customers in its first year.",
  "My work sits at the intersection of backend infrastructure and product-facing interfaces — I care as much about the system architecture as I do about the experience using it. I've built SDKs, streaming pipelines, billing systems, and the UIs that make them usable.",
  "Outside of work, I'm building API Sentinel — an AI-powered monitoring tool. I'm drawn to problems where reliability and developer experience meet.",
]
