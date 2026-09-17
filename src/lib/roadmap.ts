/**
 * HireSense AI - Dynamic Roadmap API Client
 */
import { apiClient } from './api'

export interface RoadmapTaskItem {
  id: number
  task_code: string
  title: string
  is_completed: boolean
}

export interface RoadmapSprintItem {
  id: number
  week_number: number
  title: string
  status: 'completed' | 'in_progress' | 'upcoming'
  deliverable: string
  tasks: RoadmapTaskItem[]
}

export interface RoadmapData {
  total_tasks: number
  completed_tasks: number
  progress_pct: number
  drive_days_remaining: number
  sprints: RoadmapSprintItem[]
}

export const roadmapApi = {
  /**
   * Fetch current 4-week placement prep roadmap
   */
  getRoadmap: async (): Promise<RoadmapData> => {
    return apiClient.get<RoadmapData>('/roadmap/')
  },

  /**
   * Toggle task completion status
   */
  toggleTask: async (taskId: number, isCompleted: boolean): Promise<RoadmapData> => {
    return apiClient.post<RoadmapData>(`/roadmap/tasks/${taskId}/toggle`, {
      is_completed: isCompleted,
    })
  },

  /**
   * Generate an adaptive roadmap based on student's current skill gaps
   */
  generateRoadmap: async (focusArea?: string): Promise<RoadmapData> => {
    return apiClient.post<RoadmapData>('/roadmap/generate', {
      focus_area: focusArea,
    })
  },
}
