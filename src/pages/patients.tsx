import { useState, useMemo } from "react"
import { Search, UserPlus, X, Eye, Trash2, SlidersHorizontal } from "lucide-react"

import { usePatientStore } from "@/store/patient-store"
import { usePatientFilters } from "@/hooks/use-patient-filters"
import { useDebouncedInput } from "@/hooks/use-debounced-input"
import type { Patient, MalocclusionClass, StabilometryLevel } from "@/types/patient"
import { STABILOMETRY_BADGE } from "@/constants/patient"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

import { PatientFormDialog } from "@/components/patient-form-dialog"
import { PatientDetailSheet } from "@/components/patient-detail-sheet"
import { SortIndicator } from "@/components/shared/sort-indicator"


const ALL = "__all__"

export default function PatientsPage() {
  const { patients, removePatient } = usePatientStore()

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

  const [formOpen, setFormOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...patients]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.guardian.toLowerCase().includes(q) ||
          p.evaluatedBy.toLowerCase().includes(q)
      )
    }

    if (filterMalocclusion) {
      result = result.filter((p) => p.malocclusion === filterMalocclusion)
    }
    if (filterStabilometry) {
      result = result.filter((p) => p.stabilometryLevel === filterStabilometry)
    }
    if (filterGender) {
      result = result.filter((p) => p.gender === filterGender)
    }

    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name)
          break
        case "age":
          cmp = a.age - b.age
          break
        case "stabilometry":
          cmp = a.stabilometry - b.stabilometry
          break
        case "createdAt":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [patients, search, filterMalocclusion, filterStabilometry, filterGender, sortKey, sortDir])

  function openDetail(patient: Patient) {
    setSelectedPatient(patient)
    setDetailOpen(true)
  }

  function confirmDelete() {
    if (deleteTarget) {
      removePatient(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

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
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Buscar por nome, responsável ou avaliador..."
            value={searchInput.value}
            onChange={(e) => searchInput.onChange(e.target.value)}
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
          onClick={() => setFiltersOpen((o) => !o)}
          className={hasActiveFilters ? "border-primary-500 text-primary-600" : ""}
        >
          <SlidersHorizontal size={14} />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary-600 px-1.5 text-[10px] text-white">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Filter bar */}
      {filtersOpen && (
        <Card className="py-3">
          <CardContent className="flex flex-col gap-3 pt-0 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Maloclusão</p>
              <Select value={filterMalocclusion ?? ALL} onValueChange={(v) => setFilterMalocclusion(v === ALL ? null : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas</SelectItem>
                  {(["Nenhuma", "Classe I", "Classe II", "Classe III"] as MalocclusionClass[]).map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Estabilometria</p>
              <Select value={filterStabilometry ?? ALL} onValueChange={(v) => setFilterStabilometry(v === ALL ? null : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos</SelectItem>
                  {(["Normal", "Leve", "Moderado", "Severo"] as StabilometryLevel[]).map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Sexo</p>
              <Select value={filterGender ?? ALL} onValueChange={(v) => setFilterGender(v === ALL ? null : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos</SelectItem>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar
              </Button>
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
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => toggleSort("name")}
                >
                  Nome <SortIndicator column="name" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => toggleSort("age")}
                >
                  Idade <SortIndicator column="age" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead className="hidden sm:table-cell">Sexo</TableHead>
                <TableHead>Maloclusão</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => toggleSort("stabilometry")}
                >
                  Estabilometria <SortIndicator column="stabilometry" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead className="hidden md:table-cell">Avaliador</TableHead>
                <TableHead
                  className="hidden lg:table-cell cursor-pointer select-none"
                  onClick={() => toggleSort("createdAt")}
                >
                  Data <SortIndicator column="createdAt" sortKey={sortKey} sortDir={sortDir} />
                </TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    Nenhum paciente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openDetail(patient)}
                  >
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {patient.gender === "M" ? "M" : "F"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={patient.malocclusion === "Nenhuma" ? "secondary" : "outline"}
                      >
                        {patient.malocclusion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STABILOMETRY_BADGE[patient.stabilometryLevel]}`}
                      >
                        {patient.stabilometryLevel}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {patient.evaluatedBy}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {new Date(patient.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openDetail(patient)}
                          className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Ver detalhes"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(patient)}
                          className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-500"
                          title="Remover"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New patient dialog */}
      <PatientFormDialog open={formOpen} onOpenChange={setFormOpen} />

      {/* Detail sheet */}
      <PatientDetailSheet
        patient={selectedPatient}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover paciente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{deleteTarget?.name}</strong>?
              Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
