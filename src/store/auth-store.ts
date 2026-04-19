import { create } from "zustand"
import type { AuthState } from "@/types/auth"

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,

  login: (user) => set({ user }),

  logout: () => set({ user: null }),

  isAuthenticated: () => get().user !== null,
}))
