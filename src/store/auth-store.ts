import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  role: "professor" | "student"
}

interface AuthState {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "maloclusao-auth" }
  )
)
