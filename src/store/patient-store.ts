import { create } from "zustand"
import type { Patient } from "@/types/patient"
import { mockPatients } from "@/mocks/patients"

interface PatientState {
  patients: Patient[]
  insertPatient: (patient: Patient) => void
  addPatient: (patient: Omit<Patient, "id" | "createdAt" | "evaluatedBy">, evaluatedBy: string) => void
  updatePatient: (id: string, data: Omit<Patient, "id" | "createdAt" | "evaluatedBy">) => void
  removePatient: (id: string) => void
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: mockPatients,
  insertPatient: (patient) =>
    set((state) => ({ patients: [patient, ...state.patients] })),
  addPatient: (data, evaluatedBy) =>
    set((state) => ({
      patients: [
        {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString().split("T")[0],
          evaluatedBy,
        },
        ...state.patients,
      ],
    })),
  updatePatient: (id, data) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  removePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),
}))
