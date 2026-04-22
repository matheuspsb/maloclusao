import { Loader2 } from "lucide-react"

import type { Patient } from "@/types/patient"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { PatientRow } from "./patient-row"

interface PatientTableBodyProps {
  isLoading: boolean
  isError: boolean
  patients: Patient[]
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
}

export function PatientTableBody({ isLoading, isError, patients, onEdit, onDelete }: PatientTableBodyProps) {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
            <Loader2 size={20} className="mx-auto animate-spin" />
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (isError) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="py-12 text-center text-danger-500">
            Erro ao carregar pacientes.
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  if (patients.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
            Nenhum paciente encontrado
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {patients.map((patient) => (
        <PatientRow key={patient.id} patient={patient} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </TableBody>
  )
}
