const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

interface UserWithPassword extends User {
  passwordHash: string
}

export class ApiClient {
  private token: string | null = null
  private currentUser: User | null = null

  constructor() {
    this.token = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('current_user')
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser)
      } catch {
        // Invalid stored user, ignore
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    // Only set Content-Type if not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || error.message || 'API request failed')
    }

    return response.json()
  }

  // Auth methods - Using localStorage for demo (frontend-only PWA)
  async register(email: string, password: string, name?: string): Promise<User> {
    // Check if user already exists
    const users: UserWithPassword[] = JSON.parse(localStorage.getItem('app_users') || '[]')
    if (users.find((u) => u.email === email)) {
      throw new Error('User with this email already exists')
    }

    // Create new user
    const user = {
      id: Date.now(),
      email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
    }

    // Store password hash (in production, this would be done on backend)
    const passwordHash = btoa(password) // Simple base64 encoding for demo

    // Save user
    users.push({ ...user, passwordHash })
    localStorage.setItem('app_users', JSON.stringify(users))

    // Generate token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 }))

    this.token = token
    this.currentUser = user
    localStorage.setItem('auth_token', token)
    localStorage.setItem('current_user', JSON.stringify(user))

    console.log('✅ User registered:', user.email)
    return user
  }

  async login(email: string, password: string): Promise<User> {
    // Get users from localStorage
    const users: UserWithPassword[] = JSON.parse(localStorage.getItem('app_users') || '[]')
    const userWithPassword = users.find((u) => u.email === email)

    if (!userWithPassword) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const inputPasswordHash = btoa(password)
    if (userWithPassword.passwordHash !== inputPasswordHash) {
      throw new Error('Invalid email or password')
    }

    // Create user object without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...user } = userWithPassword

    // Generate token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 }))

    this.token = token
    this.currentUser = user
    localStorage.setItem('auth_token', token)
    localStorage.setItem('current_user', JSON.stringify(user))

    console.log('✅ User logged in:', user.email)
    return user
  }

  async logout() {
    this.token = null
    this.currentUser = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
  }

  async getMe() {
    return this.request<any>('/auth/me')
  }

  // Transcript methods
  async uploadVideo(file: File, title: string) {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('title', title)

    return this.request<{ transcriptId: number; status: string; message: string }>(
      '/transcripts/upload',
      {
        method: 'POST',
        body: formData,
      }
    )
  }

  async saveTranscript(transcriptData: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    return this.request<{ transcriptId: string }>('/transcripts', {
      method: 'POST',
      body: JSON.stringify(transcriptData),
    })
  }

  async getTranscripts() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any[]>('/transcripts')
  }

  async getTranscript(id: string | number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any>(`/transcripts/${id}`)
  }

  async deleteTranscript(id: string | number) {
    return this.request<{ message: string }>(`/transcripts/${id}`, {
      method: 'DELETE',
    })
  }

  async updateTranscriptEntry(transcriptId: number, entryId: number, updates: { text?: string; speaker?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any>(`/transcripts/${transcriptId}/entry/${entryId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async searchTranscripts(query: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<{ results: any[] }>(
      `/search?q=${encodeURIComponent(query)}`
    )
  }

  isAuthenticated(): boolean {
    return this.token !== null
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }
}

export const apiClient = new ApiClient()
