/**
 * HireSense AI - Interview Prep API Client
 */
import { apiClient } from './api'

export interface InterviewSessionStart {
  session_id: number
  round_type: string
  company: string
  question: string
  focus_hint: string
  speech_target_wpm: number
}

export interface InterviewRubricItem {
  criterion: string
  score: number
  max_score: number
  comment: string
}

export interface InterviewEvaluationResult {
  session_id: number
  score: number
  feedback: string
  rubric: InterviewRubricItem[]
  passed: boolean
}

export interface InterviewHistoryItem {
  company: string
  role: string
  score: string
  date: string
  notes: string
}

export const interviewApi = {
  /**
   * Start a new mock interview session for a given round type and company
   */
  startSession: async (
    roundType: 'behavioral' | 'dsa' | 'system' | 'project' = 'behavioral',
    company: string = 'Google'
  ): Promise<InterviewSessionStart> => {
    return apiClient.post<InterviewSessionStart>('/interview/start', {
      round_type: roundType,
      company,
    })
  },

  /**
   * Submit student's interview response for AI scoring and feedback
   */
  respond: async (
    sessionId: number,
    question: string,
    answer: string,
    roundType: string = 'behavioral'
  ): Promise<InterviewEvaluationResult> => {
    return apiClient.post<InterviewEvaluationResult>('/interview/respond', {
      session_id: sessionId,
      question,
      answer,
      round_type: roundType,
    })
  },

  /**
   * Complete interview and retrieve overall evaluation
   */
  evaluate: async (sessionId: number): Promise<InterviewEvaluationResult> => {
    return apiClient.post<InterviewEvaluationResult>('/interview/evaluate', {
      session_id: sessionId,
    })
  },

  /**
   * Get past interview sessions and score history
   */
  getHistory: async (): Promise<InterviewHistoryItem[]> => {
    return apiClient.get<InterviewHistoryItem[]>('/interview/history')
  },
}
