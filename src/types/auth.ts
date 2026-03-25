export interface User {
  id: string
  name: string
  email: string
  role: "professor" | "student"
}

export interface Session {
  token: string
  expiresAt: number
}

export interface AuthState {
  user: User | null
  session: Session | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}
