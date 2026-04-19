import { Outlet, Navigate } from "react-router"
import { useAuthStore } from "@/store/auth-store"

export default function PublicLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated()) return <Navigate to="/app" replace />

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Outlet />
    </div>
  )
}
