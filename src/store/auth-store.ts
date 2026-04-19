import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState } from "@/types/auth"

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login: (user) => set({ user }),

      logout: () => set({ user: null }),

      isAuthenticated: () => get().user !== null,
    }),
    { name: "maloclusao-auth", version: 1 }
  )
)
