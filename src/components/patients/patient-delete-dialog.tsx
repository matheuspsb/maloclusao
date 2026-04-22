import type { Patient } from "@/types/patient"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useDeletePatient } from "@/hooks/use-patients"

interface PatientDeleteDialogProps {
  patient: Patient | null
  onOpenChange: (open: boolean) => void
}

export function PatientDeleteDialog({ patient, onOpenChange }: PatientDeleteDialogProps) {
  const deletePatient = useDeletePatient({ onSuccess: () => onOpenChange(false) })

  return (
    <Dialog open={!!patient} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Remover paciente</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover <strong>{patient?.name}</strong>?
            Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deletePatient.isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={deletePatient.isPending}
            onClick={() => patient && deletePatient.mutate(patient.id)}
          >
            {deletePatient.isPending ? "Removendo..." : "Remover"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
