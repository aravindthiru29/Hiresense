/**
 * HireSense AI - Dashboard API Client
 */
import { apiClient } from './api'

export interface DashboardUser {
  id: number
  name: string
  email: string
  college: string
  branch: string
  graduation_year: number
  target_role: string
  initials: string
}

export interface DashboardStat {
  label: string
  value: string
  delta: string
  good: boolean
  to: string
}

export interface DashboardCapabilities {
  technical: number
  problem_solving: number
  communication: number
  project: number
}

export interface NextBestAction {
  title: string
  reason: string
  action: string
  target: string
}

export interface UpcomingInterview {
  company: string
  role: string
  badge: string
  badge_color: string
}

export interface FocusLaneItem {
  title: string
  desc: string
  status: string
  color: string
}

export interface ProgressItem {
  week: string
  score: number
  label: string
}

export interface DashboardData {
  user: DashboardUser
  readiness: {
    score: number
    label: string
    change: string
  }
  stats: DashboardStat[]
  capability: DashboardCapabilities
  skill_gaps: string[]
  next_best_action: NextBestAction
  upcoming_interviews: UpcomingInterview[]
  focus_lane: FocusLaneItem[]
  progress: ProgressItem[]
}

export const dashboardApi = {
  /**
   * Fetch consolidated dashboard payload for the current user
   */
  getDashboardData: async (): Promise<DashboardData> => {
    return apiClient.get<DashboardData>('/dashboard/')
  },
}
