import { useMemo } from "react"
import type { Patient, MalocclusionClass, StabilometryLevel } from "@/types/patient"
import { STABILOMETRY_VALUES, STABILOMETRY_COLORS } from "@/constants/patient"

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function useDashboardStats(patients: Patient[], referenceDate: Date) {
  return useMemo(() => {
    const total = patients.length

    const withMalocclusion = patients.filter(
      (patient) => patient.malocclusion !== "Nenhuma"
    ).length

    const severeCount = patients.filter(
      (patient) => patient.stabilometryLevel === "Severo"
    ).length

    const recentWeek = patients.filter(
      (patient) => referenceDate.getTime() - new Date(patient.createdAt).getTime() <= SEVEN_DAYS_MS
    ).length

    const malocclusionCounts = patients.reduce(
      (counts, patient) => {
        counts[patient.malocclusion] = (counts[patient.malocclusion] || 0) + 1
        return counts
      },
      {} as Record<MalocclusionClass, number>
    )
    const malocclusionData = Object.entries(malocclusionCounts).map(([name, count]) => ({ name, count }))

    const stabilometryCounts = patients.reduce(
      (counts, patient) => {
        counts[patient.stabilometryLevel] = (counts[patient.stabilometryLevel] || 0) + 1
        return counts
      },
      {} as Record<StabilometryLevel, number>
    )
    const stabilometryData = STABILOMETRY_VALUES.map((level) => ({
      name: level,
      value: stabilometryCounts[level] || 0,
      fill: STABILOMETRY_COLORS[level],
    }))

    const recentPatients = [...patients]
      .sort((patientA, patientB) => new Date(patientB.createdAt).getTime() - new Date(patientA.createdAt).getTime())
      .slice(0, 5)

    return { total, withMalocclusion, severeCount, recentWeek, malocclusionData, stabilometryData, recentPatients }
  }, [patients, referenceDate])
}
