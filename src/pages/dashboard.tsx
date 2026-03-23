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

import { mockPatients } from "@/mocks/patients"
import type { MalocclusionClass, StabilometryLevel } from "@/types/patient"

const totalPatients = mockPatients.length
const withMalocclusion = mockPatients.filter((p) => p.malocclusion !== "Nenhuma").length
const severeCount = mockPatients.filter((p) => p.stabilometryLevel === "Severo").length
const recentWeek = mockPatients.filter((p) => {
  const diff = Date.now() - new Date(p.createdAt).getTime()
  return diff <= 7 * 24 * 60 * 60 * 1000
}).length

const malocclusionCounts = mockPatients.reduce(
  (acc, p) => {
    acc[p.malocclusion] = (acc[p.malocclusion] || 0) + 1
    return acc
  },
  {} as Record<MalocclusionClass, number>
)

const malocclusionData = Object.entries(malocclusionCounts).map(([name, count]) => ({
  name,
  count,
}))

const malocclusionConfig: ChartConfig = {
  count: { label: "Pacientes", color: "var(--color-primary-500)" },
}

const stabilometryCounts = mockPatients.reduce(
  (acc, p) => {
    acc[p.stabilometryLevel] = (acc[p.stabilometryLevel] || 0) + 1
    return acc
  },
  {} as Record<StabilometryLevel, number>
)

const stabilometryColors: Record<StabilometryLevel, string> = {
  Normal: "var(--color-success-500)",
  Leve: "var(--color-accent-400)",
  Moderado: "var(--color-warning-500)",
  Severo: "var(--color-danger-500)",
}

const stabilometryData = (["Normal", "Leve", "Moderado", "Severo"] as StabilometryLevel[]).map(
  (level) => ({
    name: level,
    value: stabilometryCounts[level] || 0,
    fill: stabilometryColors[level],
  })
)

const stabilometryConfig: ChartConfig = {
  value: { label: "Pacientes" },
  Normal: { label: "Normal", color: stabilometryColors.Normal },
  Leve: { label: "Leve", color: stabilometryColors.Leve },
  Moderado: { label: "Moderado", color: stabilometryColors.Moderado },
  Severo: { label: "Severo", color: stabilometryColors.Severo },
}

// ─── Helpers ───

const stabilometryBadgeVariant: Record<StabilometryLevel, string> = {
  Normal: "bg-success-50 text-success-700",
  Leve: "bg-accent-100 text-accent-800",
  Moderado: "bg-warning-50 text-warning-700",
  Severo: "bg-danger-50 text-danger-700",
}

const recentPatients = [...mockPatients]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5)

// ─── Component ───

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral dos pacientes e avaliações
          </p>
        </div>
        <Button>
          <UserPlus size={16} />
          Novo paciente
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardDescription>Total de pacientes</CardDescription>
            <Users size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardDescription>Com maloclusão</CardDescription>
            <AlertTriangle size={18} className="text-warning-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{withMalocclusion}</div>
            <p className="text-xs text-muted-foreground">
              {((withMalocclusion / totalPatients) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardDescription>Desvio severo</CardDescription>
            <Activity size={18} className="text-danger-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{severeCount}</div>
            <p className="text-xs text-muted-foreground">necessitam atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardDescription>Últimos 7 dias</CardDescription>
            <UserPlus size={18} className="text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recentWeek}</div>
            <p className="text-xs text-muted-foreground">novos cadastros</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Classificação de maloclusão</CardTitle>
            <CardDescription>Distribuição por tipo (Angle)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={malocclusionConfig} className="h-64 w-full">
              <BarChart data={malocclusionData} accessibilityLayer>
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
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
            <ChartContainer config={stabilometryConfig} className="h-64 w-full">
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={stabilometryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>
            <div className="mt-2 flex justify-center gap-4">
              {stabilometryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-muted-foreground">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent patients table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Pacientes recentes</CardTitle>
            <CardDescription>Últimos cadastros realizados</CardDescription>
          </div>
          <Link to="/app/pacientes">
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
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
              {recentPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age} anos</TableCell>
                  <TableCell>
                    <Badge variant={patient.malocclusion === "Nenhuma" ? "secondary" : "outline"}>
                      {patient.malocclusion}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stabilometryBadgeVariant[patient.stabilometryLevel]}`}
                    >
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
    </div>
  )
}
