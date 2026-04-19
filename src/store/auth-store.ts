import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState } from "@/types/auth"
import { SESSION_DURATION_MS } from "@/lib/token"

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,

      login: (user, token) =>
        set({
          user,
          session: {
            token,
            expiresAt: Date.now() + SESSION_DURATION_MS,
          },
        }),

      logout: () => set({ user: null, session: null }),

      isAuthenticated: () => {
        const { user, session } = get()
        if (!user || !session) return false
        if (Date.now() > session.expiresAt) {
          set({ user: null, session: null })
          return false
        }
        return true
      },
    }),
    { name: "maloclusao-auth" }
  )
)
