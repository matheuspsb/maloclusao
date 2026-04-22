import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { STABILOMETRY_COLORS } from "@/constants/patient"

const config: ChartConfig = {
  value: { label: "Pacientes" },
  Normal: { label: "Normal", color: STABILOMETRY_COLORS.Normal },
  Leve: { label: "Leve", color: STABILOMETRY_COLORS.Leve },
  Moderado: { label: "Moderado", color: STABILOMETRY_COLORS.Moderado },
  Severo: { label: "Severo", color: STABILOMETRY_COLORS.Severo },
}

interface StabilometryChartProps {
  data: { name: string; value: number; fill: string }[]
}

export function StabilometryChart({ data }: StabilometryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estabilometria</CardTitle>
        <CardDescription>Distribuição por grau de desvio</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-square w-full sm:aspect-video">
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={data}
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
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} />
              <span className="text-muted-foreground">{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
