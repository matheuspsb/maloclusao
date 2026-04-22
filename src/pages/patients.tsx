import { useState } from "react"
import { UserPlus } from "lucide-react"

import { usePatients } from "@/hooks/use-patients"
import { usePatientFilters } from "@/hooks/use-patient-filters"
import { useFilteredPatients } from "@/hooks/use-filtered-patients"
import { useDebouncedInput } from "@/hooks/use-debounced-input"
import type { Patient } from "@/types/patient"

import { Button } from "@/components/ui/button"

import { PatientFormDialog } from "@/components/patients/dialogs/patient-form-dialog"
import { PatientEditSheet } from "@/components/patients/dialogs/patient-edit-sheet"
import { PatientDeleteDialog } from "@/components/patients/dialogs/patient-delete-dialog"
import { PatientSearchBar } from "@/components/patients/filters/patient-search-bar"
import { PatientFilterBar } from "@/components/patients/filters/patient-filter-bar"
import { PatientTable } from "@/components/patients/table/patient-table"

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
  const filtered = useFilteredPatients({ patients, search, filterMalocclusion, filterStabilometry, filterGender, sortKey, sortDir })

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

      <PatientSearchBar
        searchInput={searchInput}
        hasActiveFilters={hasActiveFilters}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((prev) => !prev)}
      />

      {filtersOpen && (
        <PatientFilterBar
          filterMalocclusion={filterMalocclusion}
          filterStabilometry={filterStabilometry}
          filterGender={filterGender}
          hasActiveFilters={hasActiveFilters}
          onFilterMalocclusion={setFilterMalocclusion}
          onFilterStabilometry={setFilterStabilometry}
          onFilterGender={setFilterGender}
          onClear={clearFilters}
        />
      )}

      <PatientTable
        patients={filtered}
        isLoading={isLoading}
        isError={isError}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
      />

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
