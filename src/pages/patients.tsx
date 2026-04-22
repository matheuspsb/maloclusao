import { useState, useMemo } from "react"
import { Search, UserPlus, X, SlidersHorizontal } from "lucide-react"

import { usePatients } from "@/hooks/use-patients"
import { usePatientFilters } from "@/hooks/use-patient-filters"
import { useDebouncedInput } from "@/hooks/use-debounced-input"
import type { Patient, MalocclusionClass, StabilometryLevel } from "@/types/patient"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

import { PatientFormDialog } from "@/components/patients/patient-form-dialog"
import { PatientEditSheet } from "@/components/patients/patient-edit-sheet"
import { PatientDeleteDialog } from "@/components/patients/patient-delete-dialog"
import { PatientTableBody } from "@/components/patients/patient-table-body"
import { SortIndicator } from "@/components/shared/sort-indicator"

const ALL = "__all__"

export default function PatientsPage() {
  const { data: patients = [], isLoading, isError } = usePatients()

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Patient | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const {
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
  } = usePatientFilters()

  const searchInput = useDebouncedInput(search, setSearch)

  const filtered = useMemo(() => {
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

    if (filterMalocclusion) result = result.filter((patient) => patient.malocclusion === filterMalocclusion)
    if (filterStabilometry) result = result.filter((patient) => patient.stabilometryLevel === filterStabilometry)
    if (filterGender) result = result.filter((patient) => patient.gender === filterGender)

    result.sort((patientA, patientB) => {
      let comparison = 0
      switch (sortKey) {
        case "name": comparison = patientA.name.localeCompare(patientB.name); break
        case "age": comparison = patientA.age - patientB.age; break
        case "stabilometry": comparison = patientA.stabilometry - patientB.stabilometry; break
        case "createdAt": comparison = new Date(patientA.createdAt).getTime() - new Date(patientB.createdAt).getTime(); break
      }
      return sortDir === "asc" ? comparison : -comparison
    })

    return result
  }, [patients, search, filterMalocclusion, filterStabilometry, filterGender, sortKey, sortDir])

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} de {patients.length} paciente{patients.length !== 1 && "s"}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <UserPlus size={16} />
          Novo paciente
        </Button>
      </div>

      {/* Search + filter toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, responsável ou avaliador..."
            value={searchInput.value}
            onChange={(event) => searchInput.onChange(event.target.value)}
            className="pl-9"
          />
          {searchInput.value && (
            <button
              onClick={searchInput.clear}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersOpen((prev) => !prev)}
          className={hasActiveFilters ? "border-primary-500 text-primary-600" : ""}
        >
          <SlidersHorizontal size={14} />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary-600 px-1.5 text-[10px] text-white">!</span>
          )}
        </Button>
      </div>

      {/* Filter bar */}
      {filtersOpen && (
        <Card className="py-3">
          <CardContent className="flex flex-col gap-3 pt-0 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Maloclusão</p>
              <Select
                value={filterMalocclusion ?? ALL}
                onValueChange={(value) => setFilterMalocclusion(value === ALL ? null : value)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas</SelectItem>
                  {(["Nenhuma", "Classe I", "Classe II", "Classe III"] as MalocclusionClass[]).map((malocclusionClass) => (
                    <SelectItem key={malocclusionClass} value={malocclusionClass}>{malocclusionClass}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Estabilometria</p>
              <Select
                value={filterStabilometry ?? ALL}
                onValueChange={(value) => setFilterStabilometry(value === ALL ? null : value)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos</SelectItem>
                  {(["Normal", "Leve", "Moderado", "Severo"] as StabilometryLevel[]).map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Sexo</p>
              <Select
                value={filterGender ?? ALL}
                onValueChange={(value) => setFilterGender(value === ALL ? null : value)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos</SelectItem>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>Limpar</Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  Nome <SortIndicator column="name" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("age")}>
                  Idade <SortIndicator column="age" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead className="hidden sm:table-cell">Sexo</TableHead>
                <TableHead>Maloclusão</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("stabilometry")}>
                  Estabilometria <SortIndicator column="stabilometry" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead className="hidden md:table-cell">Avaliador</TableHead>
                <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("createdAt")}>
                  Data <SortIndicator column="createdAt" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <PatientTableBody
              isLoading={isLoading}
              isError={isError}
              patients={filtered}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          </Table>
        </CardContent>
      </Card>

      <PatientFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <PatientEditSheet
        key={editTarget?.id}
        patient={editTarget}
        open={!!editTarget}
        onOpenChange={(isOpen) => { if (!isOpen) setEditTarget(null) }}
      />

      <PatientDeleteDialog
        patient={deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      />
    </div>
  )
}
