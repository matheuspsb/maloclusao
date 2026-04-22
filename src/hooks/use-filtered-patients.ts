import { useMemo } from "react"
import type { Patient } from "@/types/patient"
import type { SortKey, SortDir } from "@/types/sortkey.types"

interface UseFilteredPatientsOptions {
  patients: Patient[]
  search: string
  filterMalocclusion: string | null
  filterStabilometry: string | null
  filterGender: string | null
  sortKey: SortKey
  sortDir: SortDir
}

export function useFilteredPatients({
  patients,
  search,
  filterMalocclusion,
  filterStabilometry,
  filterGender,
  sortKey,
  sortDir,
}: UseFilteredPatientsOptions) {
  return useMemo(() => {
    let result = [...patients]

    if (search) {
      const lowerQuery = search.toLowerCase()
      result = result.filter(
        (patient) =>
          patient.name.toLowerCase().includes(lowerQuery) ||
          patient.guardian.toLowerCase().includes(lowerQuery) ||
          patient.evaluatedBy.toLowerCase().includes(lowerQuery)
      )
    }

    if (filterMalocclusion) result = result.filter((p) => p.malocclusion === filterMalocclusion)
    if (filterStabilometry) result = result.filter((p) => p.stabilometryLevel === filterStabilometry)
    if (filterGender) result = result.filter((p) => p.gender === filterGender)

    result.sort((a, b) => {
      let comparison = 0
      switch (sortKey) {
        case "name": comparison = a.name.localeCompare(b.name); break
        case "age": comparison = a.age - b.age; break
        case "stabilometry": comparison = a.stabilometry - b.stabilometry; break
        case "createdAt": comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break
      }
      return sortDir === "asc" ? comparison : -comparison
    })

    return result
  }, [patients, search, filterMalocclusion, filterStabilometry, filterGender, sortKey, sortDir])
}
