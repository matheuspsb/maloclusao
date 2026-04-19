import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuthStore } from "@/store/auth-store"
import { loginSchema, type LoginForm } from "@/schemas/login-schema"
import { authLogin } from "@/services/auth.service"

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [authError, setAuthError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setAuthError("")
    try {
      const result = await authLogin(data.email, data.password)
      login(result.user)
      navigate("/app")
    } catch {
      setAuthError("Email ou senha inválidos")
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Entrar</h1>
          <p className="mt-1 text-sm text-muted-fg">
            Acesse o sistema de cadastro
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {authError && (
            <div className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {authError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              className="w-full rounded-lg border border-surface-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-fg focus:ring-2 focus:ring-ring focus:outline-none"
            />
            {errors.email && (
              <p className="text-xs text-danger-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full rounded-lg border border-surface-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-fg focus:ring-2 focus:ring-ring focus:outline-none"
            />
            {errors.password && (
              <p className="text-xs text-danger-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors cursor-pointer hover:bg-primary-700 disabled:opacity-50"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-muted-fg">
          <Link to="/" className="text-primary-600 hover:underline dark:text-primary-400">
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  )
}
