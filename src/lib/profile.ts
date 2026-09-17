/**
 * HireSense AI - User Profile API Client
 */
import { apiClient } from './api'

export interface UserProfileData {
  id: number
  email: string
  full_name: string
  college: string
  degree: string
  branch: string
  graduation_year: number
  cgpa: number
  target_role: string
  bio?: string
  github_handle?: string
  linkedin_url?: string
  phone?: string
  avatar_initials?: string
}

export interface UpdateProfilePayload {
  full_name?: string
  college?: string
  degree?: string
  branch?: string
  graduation_year?: number
  cgpa?: number
  target_role?: string
  bio?: string
  github_handle?: string
  linkedin_url?: string
  phone?: string
}

export const profileApi = {
  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<UserProfileData> => {
    return apiClient.get<UserProfileData>('/profile')
  },

  /**
   * Update current user's profile
   */
  updateProfile: async (data: UpdateProfilePayload): Promise<UserProfileData> => {
    return apiClient.put<UserProfileData>('/profile', data)
  },
}
