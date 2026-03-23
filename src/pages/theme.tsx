import { ThemeToggle } from "@/components/theme-toggle"

const primarySwatches = [
  "bg-primary-50", "bg-primary-100", "bg-primary-200", "bg-primary-300",
  "bg-primary-400", "bg-primary-500", "bg-primary-600", "bg-primary-700",
  "bg-primary-800", "bg-primary-900", "bg-primary-950",
]

const accentSwatches = [
  "bg-accent-50", "bg-accent-100", "bg-accent-200", "bg-accent-300",
  "bg-accent-400", "bg-accent-500", "bg-accent-600", "bg-accent-700",
  "bg-accent-800", "bg-accent-900",
]

export default function ThemePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Tema</h1>
        <ThemeToggle />
      </div>

      <div className="grid w-full gap-4">
        <div className="rounded-xl bg-card p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-card-fg">
            Paleta de cores
          </h2>

          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-sm text-muted-fg">Primary (Teal)</p>
              <div className="grid grid-cols-6 gap-1 sm:grid-cols-11">
                {primarySwatches.map((cls) => (
                  <div key={cls} className={`h-8 rounded-md ${cls}`} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-sm text-muted-fg">Accent (Amber)</p>
              <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
                {accentSwatches.map((cls) => (
                  <div key={cls} className={`h-8 rounded-md ${cls}`} />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-sm text-muted-fg">Semânticas</p>
              <div className="flex gap-2">
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="h-8 w-full rounded-md bg-success-500" />
                  <span className="text-xs text-muted-fg">Sucesso</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="h-8 w-full rounded-md bg-warning-500" />
                  <span className="text-xs text-muted-fg">Alerta</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="h-8 w-full rounded-md bg-danger-500" />
                  <span className="text-xs text-muted-fg">Erro</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-4 shadow-sm sm:p-6">
          <h2 className="mb-2 text-lg font-semibold text-card-fg">
            Exemplo de card
          </h2>
          <p className="mb-4 text-sm text-muted-fg">
            Preview de como os elementos vão ficar no sistema.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
              Primário
            </button>
            <button className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-600">
              Secundário
            </button>
            <button className="rounded-lg border border-surface-border bg-card px-4 py-2 text-sm font-medium text-card-fg transition-colors hover:bg-muted">
              Outline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
