/**
 * HireSense AI - Authentication API Client
 */
import { apiClient, tokenStorage } from './api'

export interface User {
  id: number
  email: string
  full_name: string
  target_role?: string
  created_at?: string
  profile?: {
    college?: string
    degree?: string
    graduation_year?: number
    cgpa?: number
    phone?: string
    github_handle?: string
    linkedin_url?: string
    target_role?: string
  }
}

export interface AuthResponse {
  user: User
  access_token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
  target_role?: string
  college?: string
  degree?: string
  graduation_year?: number
  cgpa?: number
}

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const data = await apiClient.post<AuthResponse>('/auth/login', payload, {
      requiresAuth: false,
    })
    if (data.access_token) {
      tokenStorage.set(data.access_token)
      tokenStorage.setUser(data.user)
    }
    return data
  },

  /**
   * Register a new student account
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const data = await apiClient.post<AuthResponse>('/auth/register', payload, {
      requiresAuth: false,
    })
    if (data.access_token) {
      tokenStorage.set(data.access_token)
      tokenStorage.setUser(data.user)
    }
    return data
  },

  /**
   * Fetch current authenticated user info
   */
  getMe: async (): Promise<User> => {
    const user = await apiClient.get<User>('/auth/me')
    tokenStorage.setUser(user)
    return user
  },

  /**
   * Logout user and clear tokens
   */
  logout: (): void => {
    tokenStorage.remove()
  },

  /**
   * Check if a valid session token exists
   */
  isAuthenticated: (): boolean => {
    return Boolean(tokenStorage.get())
  },

  /**
   * Get cached user profile from local storage
   */
  getCurrentUser: (): User | null => {
    return tokenStorage.getUser<User>()
  },
}
