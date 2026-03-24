import { create } from "zustand"
import type { Patient } from "@/types/patient"
import { mockPatients } from "@/mocks/patients"

interface PatientState {
  patients: Patient[]
  addPatient: (patient: Omit<Patient, "id" | "createdAt" | "evaluatedBy">, evaluatedBy: string) => void
  removePatient: (id: string) => void
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: mockPatients,
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
  removePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),
}))
