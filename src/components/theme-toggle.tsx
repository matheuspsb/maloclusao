import { useEffect } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useThemeStore, applyTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    applyTheme(theme)

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = () => applyTheme("system")
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    }
  }, [theme])

  const options = [
    { value: "light" as const, icon: Sun, label: "Claro" },
    { value: "dark" as const, icon: Moon, label: "Escuro" },
    { value: "system" as const, icon: Monitor, label: "Sistema" },
  ]

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`cursor-pointer rounded-md p-2 transition-colors ${
            theme === value
              ? "bg-card text-primary-600 shadow-sm dark:text-primary-400"
              : "text-muted-fg hover:text-foreground"
          }`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  )
}
