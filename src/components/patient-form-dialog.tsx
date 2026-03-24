import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { patientSchema, type PatientForm } from "@/schemas/patient-schema"
import { usePatientStore } from "@/store/patient-store"
import { useAuthStore } from "@/store/auth-store"
import type { Patient } from "@/types/patient"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientFormDialog({ open, onOpenChange }: Props) {
  const addPatient = usePatientStore((s) => s.addPatient)
  const user = useAuthStore((s) => s.user)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PatientForm>({
    resolver: yupResolver(patientSchema),
  })

  function onSubmit(data: PatientForm) {
    addPatient(
      data as Omit<Patient, "id" | "createdAt" | "evaluatedBy">,
      user?.name ? `Prof. ${user.name}` : "Desconhecido"
    )
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo paciente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da criança</Label>
            <Input placeholder="Nome completo" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-danger-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input
                type="number"
                placeholder="Ex: 8"
                {...register("age")}
              />
              {errors.age && (
                <p className="text-xs text-danger-500">{errors.age.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select onValueChange={(v) => setValue("gender", v as "M" | "F", { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-danger-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Responsável</Label>
            <Input placeholder="Nome do responsável" {...register("guardian")} />
            {errors.guardian && (
              <p className="text-xs text-danger-500">{errors.guardian.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Classificação de maloclusão</Label>
            <Select onValueChange={(v) => setValue("malocclusion", v as PatientForm["malocclusion"], { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nenhuma">Nenhuma</SelectItem>
                <SelectItem value="Classe I">Classe I</SelectItem>
                <SelectItem value="Classe II">Classe II</SelectItem>
                <SelectItem value="Classe III">Classe III</SelectItem>
              </SelectContent>
            </Select>
            {errors.malocclusion && (
              <p className="text-xs text-danger-500">{errors.malocclusion.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Desvio (°)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="Ex: 12.4"
                {...register("stabilometry")}
              />
              {errors.stabilometry && (
                <p className="text-xs text-danger-500">{errors.stabilometry.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Grau</Label>
              <Select onValueChange={(v) => setValue("stabilometryLevel", v as PatientForm["stabilometryLevel"], { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Leve">Leve</SelectItem>
                  <SelectItem value="Moderado">Moderado</SelectItem>
                  <SelectItem value="Severo">Severo</SelectItem>
                </SelectContent>
              </Select>
              {errors.stabilometryLevel && (
                <p className="text-xs text-danger-500">{errors.stabilometryLevel.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
