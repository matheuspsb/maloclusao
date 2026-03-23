import { Outlet, NavLink, Navigate } from "react-router"
import { ThemeToggle } from "@/components/theme-toggle"
import { LayoutDashboard, Users, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"

const navItems = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/app/pacientes", icon: Users, label: "Pacientes" },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            Maloclusão
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-primary-600 dark:text-primary-400"
                    : "text-sidebar-fg hover:bg-sidebar-active"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border p-3">
          <ThemeToggle />
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-fg transition-colors hover:bg-sidebar-active"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
