/**
 * HireSense AI - Reports & Placement Dossier API Client
 */
import { apiClient } from './api'

export interface CandidateInfo {
  name: string
  college: string
  degree: string
  branch: string
  graduation_year: number
  target_role: string
}

export interface AgentScoreSummary {
  agent: string
  score: string
  delta: string
  status: string
  to: string
}

export interface CompetencyAuditItem {
  area: string
  method: string
  score: string
  status: 'verified' | 'developing' | 'unverified'
}

export interface FullReportDossier {
  candidate: CandidateInfo
  readiness_score: number
  ats_score: number
  interviews_completed: number
  history: Array<{ week: string; score: number; label: string }>
  agent_scores: AgentScoreSummary[]
  competencies: CompetencyAuditItem[]
  summary: string
}

export const reportsApi = {
  /**
   * Fetch comprehensive placement readiness report dossier
   */
  getFullReport: async (): Promise<FullReportDossier> => {
    return apiClient.get<FullReportDossier>('/reports/full')
  },
}
