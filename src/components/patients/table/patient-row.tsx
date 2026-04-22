import { useNavigate } from "react-router"
import { Eye, Pencil, Trash2 } from "lucide-react"

import type { Patient } from "@/types/patient"
import { STABILOMETRY_BADGE } from "@/constants/patient"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"

interface PatientRowProps {
  patient: Patient
  onEdit: (patient: Patient) => void
  onDelete: (patient: Patient) => void
}

export function PatientRow({ patient, onEdit, onDelete }: PatientRowProps) {
  const navigate = useNavigate()

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => navigate(`/app/pacientes/${patient.id}`)}
    >
      <TableCell className="font-medium">{patient.name}</TableCell>
      <TableCell>{patient.age}</TableCell>
      <TableCell className="hidden sm:table-cell">{patient.gender === "M" ? "M" : "F"}</TableCell>
      <TableCell>
        <Badge variant={patient.malocclusion === "Nenhuma" ? "secondary" : "outline"}>
          {patient.malocclusion}
        </Badge>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STABILOMETRY_BADGE[patient.stabilometryLevel]}`}>
          {patient.stabilometryLevel}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">{patient.evaluatedBy}</TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground">
        {new Date(patient.createdAt).toLocaleDateString("pt-BR")}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
          <button
            onClick={() => navigate(`/app/pacientes/${patient.id}`)}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Ver detalhes"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onEdit(patient)}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(patient)}
            className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-500"
            title="Remover"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}
