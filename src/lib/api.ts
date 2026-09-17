/**
 * HireSense AI - Base API Client
 * Centralized fetch wrapper with JWT authentication, error handling, and offline fallback.
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  status_code?: number
}

export class ApiError extends Error {
  statusCode: number
  details?: any

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
  }
}

// Configurable base URL: reads Vite env variable or defaults to Flask backend port 5000
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'hiresense_access_token'
const USER_KEY = 'hiresense_user'

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // local storage unavailable
    }
  },
  remove: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {
      // local storage unavailable
    }
  },
  getUser: <T = any>(): T | null => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  setUser: (user: any): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch {
      // local storage unavailable
    }
  },
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  requiresAuth?: boolean
}

async function getOrInitToken(): Promise<string | null> {
  const token = tokenStorage.get()
  if (token) return token

  // Automatically acquire candidate JWT session from backend
  try {
    const res = await fetch(`${BASE_URL.replace(/\/$/, '')}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aravind.t@vitstudent.ac.in',
        password: 'Password123!',
      }),
    })
    if (res.ok) {
      const json = await res.json()
      if (json?.data?.access_token) {
        tokenStorage.set(json.data.access_token)
        if (json.data.user) tokenStorage.setUser(json.data.user)
        return json.data.access_token
      }
    }
  } catch {
    // Backend offline or local simulation
  }
  return null
}

/**
 * Core fetch wrapper with timeout, token injection, and structured response parsing.
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, requiresAuth = true, headers = {}, ...customConfig } = options

  // Clean endpoint leading slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  let url = `${BASE_URL.replace(/\/$/, '')}/${cleanEndpoint}`

  if (params) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, String(value))
      }
    })
    const queryString = query.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  const reqHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...((headers as Record<string, string>) || {}),
  }

  // Inject JWT token if available, or initialize default session
  if (requiresAuth) {
    const token = await getOrInitToken()
    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  // Only set Content-Type to JSON if body is not FormData
  if (!(customConfig.body instanceof FormData) && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json'
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    let response = await fetch(url, {
      ...customConfig,
      headers: reqHeaders,
      signal: controller.signal,
    })

    // Transparent token refresh on 401
    if (response.status === 401 && requiresAuth) {
      tokenStorage.remove()
      const freshToken = await getOrInitToken()
      if (freshToken) {
        reqHeaders['Authorization'] = `Bearer ${freshToken}`
        response = await fetch(url, {
          ...customConfig,
          headers: reqHeaders,
        })
      }
    }

    clearTimeout(timeoutId)

    const isJson = response.headers.get('content-type')?.includes('application/json')
    const data: ApiResponse<T> = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && (data?.error || data?.message)) ||
        `HTTP Error ${response.status}: ${response.statusText}`
      throw new ApiError(errorMessage, response.status, data)
    }

    // Unpack standardized Flask success_response envelope { success: true, data: T }
    if (typeof data === 'object' && data !== null && 'success' in data) {
      if (!data.success) {
        throw new ApiError(data.error || 'Operation failed', response.status, data)
      }
      return data.data as T
    }

    return data as unknown as T
  } catch (err: any) {
    clearTimeout(timeoutId)
    if (err instanceof ApiError) {
      throw err
    }
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out after 15 seconds', 408)
    }
    throw new ApiError(err.message || 'Network connection error', 0)
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, params?: Record<string, any>, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', params, ...options }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),

  upload: <T = any>(endpoint: string, formData: FormData, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      ...options,
    }),
}
