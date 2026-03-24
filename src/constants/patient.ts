import type { MalocclusionClass, StabilometryLevel } from "@/types/patient"

export const MALOCCLUSION_VALUES: MalocclusionClass[] = [
  "Nenhuma",
  "Classe I",
  "Classe II",
  "Classe III",
]

export const STABILOMETRY_VALUES: StabilometryLevel[] = [
  "Normal",
  "Leve",
  "Moderado",
  "Severo",
]

export const GENDER_VALUES = ["M", "F"] as const

export const STABILOMETRY_BADGE: Record<StabilometryLevel, string> = {
  Normal: "bg-success-50 text-success-700",
  Leve: "bg-accent-100 text-accent-800",
  Moderado: "bg-warning-50 text-warning-700",
  Severo: "bg-danger-50 text-danger-700",
}

export const STABILOMETRY_COLORS: Record<StabilometryLevel, string> = {
  Normal: "var(--color-success-500)",
  Leve: "var(--color-accent-400)",
  Moderado: "var(--color-warning-500)",
  Severo: "var(--color-danger-500)",
}
