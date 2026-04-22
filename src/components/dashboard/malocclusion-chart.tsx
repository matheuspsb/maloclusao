import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const config: ChartConfig = {
  count: { label: "Pacientes", color: "var(--color-primary-500)" },
}

interface MalocclusionChartProps {
  data: { name: string; count: number }[]
}

export function MalocclusionChart({ data }: MalocclusionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Classificação de maloclusão</CardTitle>
        <CardDescription>Distribuição por tipo (Angle)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-4/3 w-full sm:aspect-video">
          <BarChart data={data} accessibilityLayer>
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="var(--color-primary-500)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
