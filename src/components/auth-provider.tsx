import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { authMe } from "@/services/auth.service"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    authMe()
      .then((user) => useAuthStore.getState().login(user))
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  if (checking) return null

  return <>{children}</>
}
