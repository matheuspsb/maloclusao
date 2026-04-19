import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { authMe } from "@/services/auth.service"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(!useAuthStore.getState().user)

  useEffect(() => {
    if (!checking) return

    authMe()
      .then((user) => useAuthStore.getState().login(user))
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [checking])

  if (checking) return null

  return <>{children}</>
}
