import { Outlet, NavLink, Navigate, useLocation } from "react-router"
import { useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, Menu, X } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useSidebarStore } from "@/store/sidebar-store"
import { navigationItems } from "@/router/navigation-items"

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const { open, toggle, close } = useSidebarStore()
  const location = useLocation()

  useEffect(() => {
    close()
  }, [location.pathname, close])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-background">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            Maloclusão
          </span>
          <button
            onClick={close}
            className="cursor-pointer rounded-md p-1 text-sidebar-fg hover:bg-sidebar-active lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navigationItems.map(({ to, icon: Icon, label, end }) => (
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
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-fg transition-colors hover:bg-sidebar-active"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-auto">
        <header className="flex items-center gap-3 border-b border-sidebar-border px-4 py-3 lg:hidden">
          <button
            onClick={toggle}
            className="cursor-pointer rounded-md p-1.5 text-foreground hover:bg-muted"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            Maloclusão
          </span>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
