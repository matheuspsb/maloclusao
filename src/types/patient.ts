export type MalocclusionClass = "Classe I" | "Classe II" | "Classe III" | "Nenhuma"

export type StabilometryLevel = "Normal" | "Leve" | "Moderado" | "Severo"

export interface Patient {
  id: string
  name: string
  age: number
  gender: "M" | "F"
  guardian: string
  malocclusion: MalocclusionClass
  stabilometry: number
  stabilometryLevel: StabilometryLevel
  createdAt: string
  evaluatedBy: string
  images: string[]
}
