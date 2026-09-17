/**
 * HireSense AI - GitHub Portfolio Audit API Client
 */
import { apiClient } from './api'

export interface GitHubMetric {
  label: string
  value: string
  good: boolean
  desc: string
}

export interface AuditedRepository {
  name: string
  stars: number
  forks: number
  lang: string
  health: string
  badge: string
  highlights: string
  aiFeedback: string
}

export interface GitHubUpgradeAction {
  action: string
  impact: string
  repo: string
}

export interface GitHubAuditProfile {
  username: string
  portfolio_health: number
  metrics: GitHubMetric[]
  audited_repositories: AuditedRepository[]
  upgrades: GitHubUpgradeAction[]
}

export const githubApi = {
  /**
   * Fetch current GitHub profile audit and metrics
   */
  getProfileAudit: async (): Promise<GitHubAuditProfile> => {
    return apiClient.get<GitHubAuditProfile>('/github/profile')
  },

  /**
   * Fetch audited repositories list
   */
  getRepositories: async (): Promise<AuditedRepository[]> => {
    return apiClient.get<AuditedRepository[]>('/github/repositories')
  },

  /**
   * Run real-time audit on a specific GitHub username
   */
  analyzeProfile: async (username: string): Promise<GitHubAuditProfile> => {
    return apiClient.post<GitHubAuditProfile>('/github/analyze', { username })
  },
}
