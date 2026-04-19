export interface User {
  id: string
  name: string
  email: string
  role: "professor" | "student"
}

export interface AuthState {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}
