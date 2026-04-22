import { useState } from "react"
import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { usePatients } from "@/hooks/use-patients"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { PatientFormDialog } from "@/components/patients/dialogs/patient-form-dialog"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MalocclusionChart } from "@/components/dashboard/malocclusion-chart"
import { StabilometryChart } from "@/components/dashboard/stabilometry-chart"
import { RecentPatientsTable } from "@/components/dashboard/recent-patients-table"

export default function DashboardPage() {
  const [formOpen, setFormOpen] = useState(false)

  const { data: patients = [] } = usePatients()
  const [referenceDate] = useState(() => new Date())
  const stats = useDashboardStats(patients, referenceDate)

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral dos pacientes e avaliações
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <UserPlus size={16} />
          Novo paciente
        </Button>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <MalocclusionChart data={stats.malocclusionData} />
        <StabilometryChart data={stats.stabilometryData} />
      </div>

      <RecentPatientsTable patients={stats.recentPatients} />

      <PatientFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
