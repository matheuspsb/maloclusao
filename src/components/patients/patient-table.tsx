import type { Patient } from "@/types/patient"
import type { SortKey, SortDir } from "@/types/sortkey.types"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PatientTableBody } from "@/components/patients/patient-table-body"
import { SortIndicator } from "@/components/shared/sort-indicator"

interface PatientTableProps {
  patients: Patient[]
  isLoading: boolean
  isError: boolean
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
}

export function PatientTable({
  patients,
  isLoading,
  isError,
  sortKey,
  sortDir,
  onSort,
  onEdit,
  onDelete,
}: PatientTableProps) {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => onSort("name")}>
                Nome <SortIndicator column="name" sortKey={sortKey} sortDir={sortDir} />
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => onSort("age")}>
                Idade <SortIndicator column="age" sortKey={sortKey} sortDir={sortDir} />
              </TableHead>
              <TableHead className="hidden sm:table-cell">Sexo</TableHead>
              <TableHead>Maloclusão</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => onSort("stabilometry")}>
                Estabilometria <SortIndicator column="stabilometry" sortKey={sortKey} sortDir={sortDir} />
              </TableHead>
              <TableHead className="hidden md:table-cell">Avaliador</TableHead>
              <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={() => onSort("createdAt")}>
                Data <SortIndicator column="createdAt" sortKey={sortKey} sortDir={sortDir} />
              </TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <PatientTableBody
            isLoading={isLoading}
            isError={isError}
            patients={patients}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Table>
      </CardContent>
    </Card>
  )
}
