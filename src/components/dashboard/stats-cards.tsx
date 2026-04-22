import { Users, AlertTriangle, Activity, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import type { useDashboardStats } from "@/hooks/use-dashboard-stats"

type Stats = ReturnType<typeof useDashboardStats>

interface StatsCardsProps {
  stats: Stats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
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
  )
}
