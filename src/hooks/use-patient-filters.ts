import { useSearchParams } from "react-router"
import { useCallback, useMemo } from "react"
import type { SortKey, SortDir } from "@/types/sortkey.types"
import type { MalocclusionClass, StabilometryLevel } from "@/types/patient"
import { MALOCCLUSION_VALUES, STABILOMETRY_VALUES, GENDER_VALUES } from "@/constants/patient"

const SORT_KEYS: SortKey[] = ["name", "age", "createdAt", "stabilometry"]
const SORT_DIRS: SortDir[] = ["asc", "desc"]

function isValidSort(v: string | null): v is SortKey {
  return SORT_KEYS.includes(v as SortKey)
}

function isValidDir(v: string | null): v is SortDir {
  return SORT_DIRS.includes(v as SortDir)
}

export function usePatientFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get("q") ?? ""
  const sortKey: SortKey = isValidSort(searchParams.get("sort")) ? searchParams.get("sort") as SortKey : "createdAt"
  const sortDir: SortDir = isValidDir(searchParams.get("dir")) ? searchParams.get("dir") as SortDir : "desc"

  const rawMalocclusion = searchParams.get("malocclusion")
  const filterMalocclusion = MALOCCLUSION_VALUES.includes(rawMalocclusion as MalocclusionClass)
    ? (rawMalocclusion as MalocclusionClass)
    : null

  const rawStabilometry = searchParams.get("stabilometry")
  const filterStabilometry = STABILOMETRY_VALUES.includes(rawStabilometry as StabilometryLevel)
    ? (rawStabilometry as StabilometryLevel)
    : null

  const rawGender = searchParams.get("gender")
  const filterGender = (GENDER_VALUES as readonly string[]).includes(rawGender ?? "")
    ? (rawGender as "M" | "F")
    : null

  const hasActiveFilters = filterMalocclusion !== null || filterStabilometry !== null || filterGender !== null

  const setParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value === null || value === "") {
          next.delete(key)
        } else {
          next.set(key, value)
        }
        return next
      }, { replace: true })
    },
    [setSearchParams]
  )

  const setSearch = useCallback(
    (q: string) => setParam("q", q || null),
    [setParam]
  )

  const setFilterMalocclusion = useCallback(
    (v: string | null) => setParam("malocclusion", v),
    [setParam]
  )

  const setFilterStabilometry = useCallback(
    (v: string | null) => setParam("stabilometry", v),
    [setParam]
  )

  const setFilterGender = useCallback(
    (v: string | null) => setParam("gender", v),
    [setParam]
  )

  const toggleSort = useCallback(
    (key: SortKey) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        const currentKey = isValidSort(prev.get("sort")) ? prev.get("sort") : "createdAt"
        if (currentKey === key) {
          const currentDir = isValidDir(prev.get("dir")) ? prev.get("dir") : "desc"
          next.set("dir", currentDir === "asc" ? "desc" : "asc")
        } else {
          next.set("sort", key)
          next.set("dir", "asc")
        }
        return next
      }, { replace: true })
    },
    [setSearchParams]
  )

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete("q")
      next.delete("malocclusion")
      next.delete("stabilometry")
      next.delete("gender")
      return next
    }, { replace: true })
  }, [setSearchParams])

  return useMemo(() => ({
    search,
    sortKey,
    sortDir,
    filterMalocclusion,
    filterStabilometry,
    filterGender,
    hasActiveFilters,
    setSearch,
    setFilterMalocclusion,
    setFilterStabilometry,
    setFilterGender,
    toggleSort,
    clearFilters,
  }), [
    search, sortKey, sortDir,
    filterMalocclusion, filterStabilometry, filterGender,
    hasActiveFilters,
    setSearch, setFilterMalocclusion, setFilterStabilometry, setFilterGender,
    toggleSort, clearFilters,
  ])
}
