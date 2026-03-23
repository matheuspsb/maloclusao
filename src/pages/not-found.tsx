import { Link } from "react-router"

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-6xl font-bold text-muted-fg">404</h1>
      <p className="text-muted-fg">Página não encontrada</p>
      <Link
        to="/"
        className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
