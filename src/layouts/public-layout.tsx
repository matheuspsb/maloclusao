import { Outlet } from "react-router"

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Outlet />
    </div>
  )
}
