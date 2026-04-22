import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { yupResolver } from "@hookform/resolvers/yup"
import { patientSchema, type PatientForm } from "@/schemas/patient-schema"
import { queryClient } from "@/lib/query-client"
import { updatePatient } from "@/services/patient.service"
import { uploadImage } from "@/services/upload.service"
import type { Patient } from "@/types/patient"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientEditSheet({ patient, open, onOpenChange }: Props) {
  const [existingUrls, setExistingUrls] = useState<string[]>(patient?.images ?? [])
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientForm>({
    resolver: yupResolver(patientSchema),
    defaultValues: {
      name: patient?.name ?? "",
      age: patient?.age ?? 0,
      gender: patient?.gender ?? "M",
      guardian: patient?.guardian ?? "",
      malocclusion: patient?.malocclusion ?? "Nenhuma",
      stabilometry: patient?.stabilometry ?? 0,
      stabilometryLevel: patient?.stabilometryLevel ?? "Normal",
      images: patient?.images ?? [],
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: PatientForm) => {
      const uploadedUrls = await Promise.all(newFiles.map(({ file }) => uploadImage(file)))
      const allImages = [...existingUrls, ...uploadedUrls]
      return updatePatient(patient!.id, {
        ...(data as Omit<Patient, "id" | "createdAt" | "evaluatedBy">),
        images: allImages,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patient", patient?.id] })
      onOpenChange(false)
    },
  })

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setNewFiles((prev) => [...prev, { file, preview }])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeImage(index: number) {
    if (index < existingUrls.length) {
      setExistingUrls((prev) => prev.filter((_, i) => i !== index))
    } else {
      setNewFiles((prev) => prev.filter((_, i) => i !== index - existingUrls.length))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar paciente</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4 p-4">
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
              <Input type="number" placeholder="Ex: 8" {...register("age")} />
              {errors.age && (
                <p className="text-xs text-danger-500">{errors.age.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select
                defaultValue={patient?.gender}
                onValueChange={(v) => setValue("gender", v as "M" | "F", { shouldValidate: true })}
              >
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
            <Select
              defaultValue={patient?.malocclusion}
              onValueChange={(v) =>
                setValue("malocclusion", v as PatientForm["malocclusion"], { shouldValidate: true })
              }
            >
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
              <Input type="number" step="0.1" placeholder="Ex: 12.4" {...register("stabilometry")} />
              {errors.stabilometry && (
                <p className="text-xs text-danger-500">{errors.stabilometry.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Grau</Label>
              <Select
                defaultValue={patient?.stabilometryLevel}
                onValueChange={(v) =>
                  setValue("stabilometryLevel", v as PatientForm["stabilometryLevel"], {
                    shouldValidate: true,
                  })
                }
              >
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
            {(existingUrls.length > 0 || newFiles.length > 0) && (
              <div className="grid grid-cols-4 gap-2 pt-1">
                {existingUrls.map((src, i) => (
                  <div key={`existing-${i}`} className="relative">
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
                {newFiles.map(({ preview }, i) => (
                  <div key={`new-${i}`} className="relative">
                    <img
                      src={preview}
                      alt={`Nova imagem ${i + 1}`}
                      className="h-20 w-full rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(existingUrls.length + i)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-white text-xs leading-none hover:bg-danger-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {mutation.isError && (
            <p className="text-xs text-danger-500">Erro ao salvar paciente. Tente novamente.</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
