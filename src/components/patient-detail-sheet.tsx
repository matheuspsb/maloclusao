import type { Patient, StabilometryLevel } from "@/types/patient"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Props {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const stabilometryBadge: Record<StabilometryLevel, string> = {
  Normal: "bg-success-50 text-success-700",
  Leve: "bg-accent-100 text-accent-800",
  Moderado: "bg-warning-50 text-warning-700",
  Severo: "bg-danger-50 text-danger-700",
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}

function AnimatedSection({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
      style={{ animationDelay: `${delay}ms`, animationDuration: "350ms" }}
    >
      {children}
    </div>
  )
}

export function PatientDetailSheet({ patient, open, onOpenChange }: Props) {
  if (!patient) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="animate-in fade-in slide-in-from-left-3 duration-300">
            {patient.name}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 p-4">
          <AnimatedSection delay={100}>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Dados pessoais
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Idade" value={`${patient.age} anos`} />
              <Field
                label="Sexo"
                value={patient.gender === "M" ? "Masculino" : "Feminino"}
              />
              <Field label="Responsável" value={patient.guardian} />
              <Field
                label="Cadastro"
                value={new Date(patient.createdAt).toLocaleDateString("pt-BR")}
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <Separator />
          </AnimatedSection>

          <AnimatedSection delay={250}>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Maloclusão
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={patient.malocclusion === "Nenhuma" ? "secondary" : "outline"}
              >
                {patient.malocclusion}
              </Badge>
              {patient.malocclusion !== "Nenhuma" && (
                <span className="text-xs text-muted-foreground">
                  Classificação de Angle
                </span>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={350}>
            <Separator />
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Estabilometria
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Desvio" value={`${patient.stabilometry}°`} />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Grau</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stabilometryBadge[patient.stabilometryLevel]}`}
                >
                  {patient.stabilometryLevel}
                </span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <Separator />
          </AnimatedSection>

          <AnimatedSection delay={550}>
            <Field label="Avaliado por" value={patient.evaluatedBy} />
          </AnimatedSection>
        </div>
      </SheetContent>
    </Sheet>
  )
}
