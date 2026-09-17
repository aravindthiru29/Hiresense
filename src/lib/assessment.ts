/**
 * HireSense AI - Assessment API Client
 */
import { apiClient } from './api'

export interface AssessmentQuestion {
  id: number
  question_index: number
  question_text: string
  category: string
  difficulty: string
  expected_concept?: string
  associated_skill?: string
}

export interface AssessmentAnswerResult {
  score: number
  technical_accuracy: number
  problem_solving: number
  reasoning: number
  communication: number
  feedback: string
  mistake_type?: string
}

export interface AssessmentSummary {
  assessment_id: number
  total_questions: number
  categories?: Record<string, number>
  status?: string
  questions: AssessmentQuestion[]
}

export interface CompletedAssessmentResult {
  assessment_id: number
  final_score: number
  technical_accuracy: number
  problem_solving: number
  communication: number
  status: string
  total_answered: number
  answers: Array<{
    question_id: number
    score: number
    feedback: string
    mistake_type?: string
  }>
}

export const assessmentApi = {
  /**
   * Start a new assessment or get active in-progress assessment
   */
  startOrGetActive: async (): Promise<AssessmentSummary> => {
    return apiClient.post<AssessmentSummary>('/assessment/start', {})
  },

  /**
   * Submit an answer for a specific question
   */
  submitAnswer: async (
    assessmentId: number,
    questionId: number,
    answerText: string
  ): Promise<AssessmentAnswerResult> => {
    return apiClient.post<AssessmentAnswerResult>('/assessment/submit-answer', {
      assessment_id: assessmentId,
      question_id: questionId,
      answer_text: answerText,
    })
  },

  /**
   * Complete assessment and compute aggregate readiness & capability scores
   */
  completeAssessment: async (assessmentId: number): Promise<CompletedAssessmentResult> => {
    return apiClient.post<CompletedAssessmentResult>('/assessment/complete', {
      assessment_id: assessmentId,
    })
  },

  /**
   * Get historical assessment details
   */
  getAssessment: async (assessmentId: number): Promise<AssessmentSummary> => {
    return apiClient.get<AssessmentSummary>(`/assessment/${assessmentId}`)
  },
}
