/**
 * HireSense AI - Project Interrogation / Viva API Client
 */
import { apiClient } from './api'

export interface VivaQuestionItem {
  question: string
  aspect: string
  probe_hint: string
}

export interface VivaSessionStart {
  viva_id: number
  project_name: string
  tech_stack: string
  questions: VivaQuestionItem[]
}

export interface VivaEvaluationResult {
  viva_id: number
  score: number
  feedback: string
  architecture: number
  ownership: number
  technical_depth: number
}

export const vivaApi = {
  /**
   * Start project interrogation session
   */
  startViva: async (
    projectName: string = 'Smart Crop Monitoring System'
  ): Promise<VivaSessionStart> => {
    return apiClient.post<VivaSessionStart>('/viva/start', {
      project_name: projectName,
    })
  },

  /**
   * Submit student's project defense response
   */
  submitAnswer: async (
    vivaId: number,
    question: string,
    answer: string
  ): Promise<VivaEvaluationResult> => {
    return apiClient.post<VivaEvaluationResult>('/viva/respond', {
      viva_id: vivaId,
      question,
      answer,
    })
  },

  /**
   * Complete and evaluate viva session
   */
  evaluateViva: async (vivaId: number): Promise<VivaEvaluationResult> => {
    return apiClient.post<VivaEvaluationResult>('/viva/evaluate', {
      viva_id: vivaId,
    })
  },
}
