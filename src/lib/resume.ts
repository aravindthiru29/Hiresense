/**
 * HireSense AI - Resume API Client
 */
import { apiClient } from './api'

export interface SubScores {
  impact: number
  skills: number
  brevity: number
  style: number
}

export interface BulletOptimization {
  id: number
  project: string
  stack: string
  original: string
  improved: string
  impact: string
  category: string
}

export interface ResumeAnalysis {
  ats_score: number
  role: string
  filename: string
  file_size_formatted: string
  sub_scores: SubScores
  summary: string
  strengths: string[]
  improvements: string[]
  missing_skills: string[]
}

export interface SkillCategoryMap {
  [category: string]: Array<{
    name: string
    category: string
    years_of_experience?: number
    proficiency?: string
  }>
}

export const resumeApi = {
  /**
   * Get latest active ATS resume analysis
   */
  getAnalysis: async (): Promise<ResumeAnalysis> => {
    return apiClient.get<ResumeAnalysis>('/resume/analysis')
  },

  /**
   * Upload and process a new PDF or DOCX resume
   */
  uploadResume: async (file: File): Promise<ResumeAnalysis> => {
    const formData = new FormData()
    formData.append('resume', file)
    return apiClient.upload<ResumeAnalysis>('/resume/upload', formData)
  },

  /**
   * Get parsed taxonomy skills categorized for the current user
   */
  getSkills: async (): Promise<SkillCategoryMap> => {
    return apiClient.get<SkillCategoryMap>('/resume/skills')
  },
}
