import { useState } from "react"
import { useParams, useNavigate, Navigate } from "react-router"
import { ArrowLeft, Pencil } from "lucide-react"

import { usePatientStore } from "@/store/patient-store"
import { STABILOMETRY_BADGE } from "@/constants/patient"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { PatientImageLightbox } from "@/components/patient-image-lightbox"
import { PatientEditSheet } from "@/components/patient-edit-sheet"
import Field from "@/components/shared/field"

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const patient = usePatientStore((s) => s.patients.find((p) => p.id === id))

  const [editOpen, setEditOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (!patient) return <Navigate to="/app/pacientes" replace />

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/app/pacientes")}
              className="gap-1.5"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
            <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
          </div>
          <Button size="sm" onClick={() => setEditOpen(true)} className="gap-1.5">
            <Pencil size={15} />
            Editar
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Dados pessoais */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-sm font-semibold text-foreground">Dados pessoais</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Idade" value={`${patient.age} anos`} />
                <Field label="Sexo" value={patient.gender === "M" ? "Masculino" : "Feminino"} />
                <Field label="Responsável" value={patient.guardian} />
                <Field
                  label="Cadastro"
                  value={new Date(patient.createdAt).toLocaleDateString("pt-BR")}
                />
              </div>
              <Separator />
              <Field label="Avaliado por" value={patient.evaluatedBy} />
            </CardContent>
          </Card>

          {/* Avaliação clínica */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-sm font-semibold text-foreground">Maloclusão</h2>
              <div className="flex items-center gap-2">
                <Badge variant={patient.malocclusion === "Nenhuma" ? "secondary" : "outline"}>
                  {patient.malocclusion}
                </Badge>
                {patient.malocclusion !== "Nenhuma" && (
                  <span className="text-xs text-muted-foreground">Classificação de Angle</span>
                )}
              </div>

              <Separator />

              <h2 className="text-sm font-semibold text-foreground">Estabilometria</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Desvio" value={`${patient.stabilometry}°`} />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Grau</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STABILOMETRY_BADGE[patient.stabilometryLevel]}`}
                  >
                    {patient.stabilometryLevel}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Imagens */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Imagens</h2>
            {patient.images.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma imagem registrada</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {patient.images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <img
                      src={src}
                      alt={`Imagem ${i + 1}`}
                      className="h-52 w-full object-cover transition-opacity hover:opacity-80"
                    />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PatientImageLightbox
        key={lightboxIndex}
        images={patient.images}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />

      <PatientEditSheet
        key={patient.id}
        patient={patient}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}
