/**
 * HireSense AI - Placement Readiness API Client
 */
import { apiClient } from './api'

export interface ReadinessPillar {
  label: string
  value: number
  status: string
  good: boolean
}

export interface CompanyBenchmark {
  company: string
  readiness: number
  status: string
  gap: string
}

export interface PriorityChecklistItem {
  id: number
  title: string
  sub: string
  completed: boolean
}

export interface ReadinessOverview {
  overall_score: number
  label: string
  change: string
  pillars: ReadinessPillar[]
  benchmarks: CompanyBenchmark[]
  priority_checklist: PriorityChecklistItem[]
}

export interface VerifiedSkillItem {
  skill: string
  claimed: string
  demonstrated: string
  score: number
  status: string
  verified: boolean
}

export interface ReadinessHistoryPoint {
  week: string
  score: number
  label: string
}

export const readinessApi = {
  /**
   * Get 5-pillar placement readiness breakdown and company benchmarks
   */
  getReadiness: async (): Promise<ReadinessOverview> => {
    return apiClient.get<ReadinessOverview>('/readiness/')
  },

  /**
   * Get claimed vs demonstrated skill verification matrix
   */
  getSkillVerification: async (): Promise<VerifiedSkillItem[]> => {
    return apiClient.get<VerifiedSkillItem[]>('/readiness/skills')
  },

  /**
   * Get 4-week historical trajectory
   */
  getHistory: async (): Promise<ReadinessHistoryPoint[]> => {
    return apiClient.get<ReadinessHistoryPoint[]>('/readiness/history')
  },
}
