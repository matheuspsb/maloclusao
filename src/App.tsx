import { RouterProvider } from "react-router"
import { useEffect } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { useThemeStore, applyTheme } from "@/hooks/use-theme"
import { router } from "@/router/router"
import { AuthProvider } from "@/components/auth-provider"
import { queryClient } from "@/lib/query-client"

export default function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    applyTheme(theme)

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = () => applyTheme("system")
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    }
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
