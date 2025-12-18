const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export class ApiClient {
  private token: string | null = null
  private currentUser: any = null

  constructor() {
    this.token = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('current_user')
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser)
      } catch (e) {
        // Invalid stored user, ignore
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    // Merge with options.headers if provided
    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data.data
  }

  // Auth methods
  async register(email: string, password: string, name?: string) {
    const { user, token } = await this.request<{ user: any; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    )

    this.token = token
    this.currentUser = user
    localStorage.setItem('auth_token', token)
    localStorage.setItem('current_user', JSON.stringify(user))
    return user
  }

  async login(email: string, password: string) {
    const { user, token } = await this.request<{ user: any; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    )

    this.token = token
    this.currentUser = user
    localStorage.setItem('auth_token', token)
    localStorage.setItem('current_user', JSON.stringify(user))
    return user
  }

  async logout() {
    this.token = null
    this.currentUser = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me')
  }

  // Transcript methods
  async saveTranscript(transcriptData: any) {
    return this.request<{ transcriptId: string }>('/transcripts', {
      method: 'POST',
      body: JSON.stringify(transcriptData),
    })
  }

  async getTranscripts() {
    return this.request<{ transcripts: any[] }>('/transcripts')
  }

  async getTranscript(id: string) {
    return this.request<{ transcript: any }>(`/transcripts/${id}`)
  }

  async deleteTranscript(id: string) {
    return this.request<{ message: string }>(`/transcripts/${id}`, {
      method: 'DELETE',
    })
  }

  async searchTranscripts(query: string) {
    return this.request<{ results: any[] }>(
      `/search?q=${encodeURIComponent(query)}`
    )
  }

  isAuthenticated(): boolean {
    return this.token !== null
  }

  getCurrentUser(): any {
    return this.currentUser
  }
}

export const apiClient = new ApiClient()
