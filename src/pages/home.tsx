import { Link } from "react-router"

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
        Maloclusão
      </h1>
      <p className="text-muted-fg">Sistema de cadastro de pacientes</p>

      <div className="flex gap-3">
        <Link
          to="/login"
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Entrar
        </Link>
        <Link
          to="/theme"
          className="rounded-lg border border-surface-border bg-card px-6 py-2.5 text-sm font-medium text-card-fg transition-colors hover:bg-muted"
        >
          Tema
        </Link>
      </div>
    </div>
  )
}
