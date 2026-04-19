import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { patientSchema, type PatientForm } from "@/schemas/patient-schema"
import { usePatientStore } from "@/store/patient-store"
import { createPatient } from "@/services/patient.service"

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
  const insertPatient = usePatientStore((s) => s.insertPatient)

  const [images, setImages] = useState<string[]>([])
  const [submitError, setSubmitError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientForm>({
    resolver: yupResolver(patientSchema),
  })

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImages((prev) => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(data: PatientForm) {
    setSubmitError("")
    try {
      const patient = await createPatient({ ...data, images: [] })
      insertPatient(patient)
      reset()
      setImages([])
      onOpenChange(false)
    } catch {
      setSubmitError("Erro ao cadastrar paciente. Tente novamente.")
    }
  }

  function handleCancel() {
    reset()
    setImages([])
    setSubmitError("")
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

          <div className="space-y-2">
            <Label>Imagens</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              Adicionar imagens
            </Button>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {images.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      alt={`Imagem ${i + 1}`}
                      className="h-20 w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-white text-xs leading-none hover:bg-danger-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {submitError && (
            <p className="text-xs text-danger-500">{submitError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
