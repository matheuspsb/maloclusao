import { useState } from "react"
import { Link } from "react-router"
import { Users, AlertTriangle, Activity, UserPlus } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { usePatients } from "@/hooks/use-patients"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { STABILOMETRY_BADGE, STABILOMETRY_COLORS } from "@/constants/patient"
import { PatientFormDialog } from "@/components/patients/patient-form-dialog"

const malocclusionConfig: ChartConfig = {
  count: { label: "Pacientes", color: "var(--color-primary-500)" },
}

const stabilometryConfig: ChartConfig = {
  value: { label: "Pacientes" },
  Normal: { label: "Normal", color: STABILOMETRY_COLORS.Normal },
  Leve: { label: "Leve", color: STABILOMETRY_COLORS.Leve },
  Moderado: { label: "Moderado", color: STABILOMETRY_COLORS.Moderado },
  Severo: { label: "Severo", color: STABILOMETRY_COLORS.Severo },
}

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardDescription>Total de pacientes</CardDescription>
            <Users size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardDescription>Com maloclusão</CardDescription>
            <AlertTriangle size={18} className="text-warning-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.withMalocclusion}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? ((stats.withMalocclusion / stats.total) * 100).toFixed(0) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardDescription>Desvio severo</CardDescription>
            <Activity size={18} className="text-danger-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.severeCount}</div>
            <p className="text-xs text-muted-foreground">necessitam atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardDescription>Últimos 7 dias</CardDescription>
            <UserPlus size={18} className="text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.recentWeek}</div>
            <p className="text-xs text-muted-foreground">novos cadastros</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Classificação de maloclusão</CardTitle>
            <CardDescription>Distribuição por tipo (Angle)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={malocclusionConfig} className="aspect-4/3 w-full sm:aspect-video">
              <BarChart data={stats.malocclusionData} accessibilityLayer>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="var(--color-primary-500)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estabilometria</CardTitle>
            <CardDescription>Distribuição por grau de desvio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={stabilometryConfig} className="aspect-square w-full sm:aspect-video">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={stats.stabilometryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="65%"
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {stats.stabilometryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} />
                  <span className="text-muted-foreground">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Pacientes recentes</CardTitle>
            <CardDescription>Últimos cadastros realizados</CardDescription>
          </div>
          <Link to="/app/pacientes">
            <Button variant="outline" size="sm">Ver todos</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Maloclusão</TableHead>
                <TableHead>Estabilometria</TableHead>
                <TableHead>Avaliado por</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age} anos</TableCell>
                  <TableCell>
                    <Badge variant={patient.malocclusion === "Nenhuma" ? "secondary" : "outline"}>
                      {patient.malocclusion}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STABILOMETRY_BADGE[patient.stabilometryLevel]}`}>
                      {patient.stabilometryLevel} ({patient.stabilometry}°)
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{patient.evaluatedBy}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(patient.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PatientFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
