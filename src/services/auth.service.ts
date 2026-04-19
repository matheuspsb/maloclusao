import { api } from "./api"
import type { User } from "@/types/auth"

interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: "PROFESSOR" | "STUDENT"
}

interface LoginResult {
  token: string
  user: User
}

interface RawUser {
  id: string
  name: string
  email: string
  role: string
}

function mapRole(role: string): User["role"] {
  return role === "PROFESSOR" ? "professor" : "student"
}

export async function authRegister(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<{ data: RawUser }>("/auth/register", payload)
  const raw = data.data
  return { id: raw.id, name: raw.name, email: raw.email, role: mapRole(raw.role) }
}

export async function authLogin(email: string, password: string): Promise<LoginResult> {
  const { data } = await api.post<{ data: { token: string; user: RawUser } }>("/auth/login", {
    email,
    password,
  })
  const raw = data.data
  return {
    token: raw.token,
    user: { id: raw.user.id, name: raw.user.name, email: raw.user.email, role: mapRole(raw.user.role) },
  }
}
