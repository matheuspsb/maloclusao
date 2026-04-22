import { create } from "zustand"
import type { Patient } from "@/types/patient"

interface PatientState {
  patients: Patient[]
  isLoading: boolean
  error: string | null
  setPatients: (patients: Patient[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  insertPatient: (patient: Patient) => void
  updatePatient: (id: string, data: Patient) => void
  removePatient: (id: string) => void
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  isLoading: false,
  error: null,
  setPatients: (patients) => set({ patients }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  insertPatient: (patient) =>
    set((state) => ({ patients: [patient, ...state.patients] })),
  updatePatient: (id, data) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? data : p)),
    })),
  removePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),
}))
