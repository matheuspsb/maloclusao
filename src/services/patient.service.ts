import { api } from "./api"
import type { Patient, MalocclusionClass, StabilometryLevel } from "@/types/patient"

// --- type mappings (frontend ↔ backend) ---

const malocclusionToApi: Record<MalocclusionClass, string> = {
  "Classe I": "CLASSE_I",
  "Classe II": "CLASSE_II",
  "Classe III": "CLASSE_III",
  Nenhuma: "NENHUMA",
}

const malocclusionFromApi: Record<string, MalocclusionClass> = {
  CLASSE_I: "Classe I",
  CLASSE_II: "Classe II",
  CLASSE_III: "Classe III",
  NENHUMA: "Nenhuma",
}

const stabilometryToApi: Record<StabilometryLevel, string> = {
  Normal: "NORMAL",
  Leve: "LEVE",
  Moderado: "MODERADO",
  Severo: "SEVERO",
}

const stabilometryFromApi: Record<string, StabilometryLevel> = {
  NORMAL: "Normal",
  LEVE: "Leve",
  MODERADO: "Moderado",
  SEVERO: "Severo",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPatient(raw: any): Patient {
  return {
    id: raw.id,
    name: raw.name,
    age: raw.age,
    gender: raw.gender,
    guardian: raw.guardian,
    malocclusion: malocclusionFromApi[raw.malocclusion] ?? raw.malocclusion,
    stabilometry: raw.stabilometry,
    stabilometryLevel: stabilometryFromApi[raw.stabilometryLevel] ?? raw.stabilometryLevel,
    createdAt: raw.createdAt,
    evaluatedBy: raw.evaluatedBy?.name ?? raw.evaluatedById ?? "",
    images: raw.images ?? [],
  }
}

// --- request/response types ---

export type CreatePatientPayload = Omit<Patient, "id" | "createdAt" | "evaluatedBy">
export type UpdatePatientPayload = Partial<CreatePatientPayload>

export interface PatientListParams {
  page?: number
  limit?: number
  search?: string
}

export interface PatientListResponse {
  data: Patient[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

// --- service functions ---

export async function listPatients(params?: PatientListParams): Promise<PatientListResponse> {
  const { data } = await api.get<{ data: unknown[]; meta: PatientListResponse["meta"] }>(
    "/patients",
    { params }
  )
  return { data: data.data.map(mapPatient), meta: data.meta }
}

export async function getPatientById(id: string): Promise<Patient> {
  const { data } = await api.get<{ data: unknown }>(`/patients/${id}`)
  return mapPatient(data.data)
}

export async function createPatient(payload: CreatePatientPayload): Promise<Patient> {
  const body = {
    ...payload,
    malocclusion: malocclusionToApi[payload.malocclusion],
    stabilometryLevel: stabilometryToApi[payload.stabilometryLevel],
  }
  const { data } = await api.post<{ data: unknown }>("/patients", body)
  return mapPatient(data.data)
}

export async function updatePatient(id: string, payload: UpdatePatientPayload): Promise<Patient> {
  const body = {
    ...payload,
    ...(payload.malocclusion && { malocclusion: malocclusionToApi[payload.malocclusion] }),
    ...(payload.stabilometryLevel && {
      stabilometryLevel: stabilometryToApi[payload.stabilometryLevel],
    }),
  }
  const { data } = await api.patch<{ data: unknown }>(`/patients/${id}`, body)
  return mapPatient(data.data)
}

export async function deletePatient(id: string): Promise<void> {
  await api.delete(`/patients/${id}`)
}
