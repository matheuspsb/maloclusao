import type { MalocclusionClass, StabilometryLevel } from "@/types/patient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ALL = "__all__"

interface PatientFilterBarProps {
  filterMalocclusion: string | null
  filterStabilometry: string | null
  filterGender: string | null
  hasActiveFilters: boolean
  onFilterMalocclusion: (value: string | null) => void
  onFilterStabilometry: (value: string | null) => void
  onFilterGender: (value: string | null) => void
  onClear: () => void
}

export function PatientFilterBar({
  filterMalocclusion,
  filterStabilometry,
  filterGender,
  hasActiveFilters,
  onFilterMalocclusion,
  onFilterStabilometry,
  onFilterGender,
  onClear,
}: PatientFilterBarProps) {
  return (
    <Card className="py-3">
      <CardContent className="flex flex-col gap-3 pt-0 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Maloclusão</p>
          <Select
            value={filterMalocclusion ?? ALL}
            onValueChange={(value) => onFilterMalocclusion(value === ALL ? null : value)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas</SelectItem>
              {(["Nenhuma", "Classe I", "Classe II", "Classe III"] as MalocclusionClass[]).map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Estabilometria</p>
          <Select
            value={filterStabilometry ?? ALL}
            onValueChange={(value) => onFilterStabilometry(value === ALL ? null : value)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              {(["Normal", "Leve", "Moderado", "Severo"] as StabilometryLevel[]).map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Sexo</p>
          <Select
            value={filterGender ?? ALL}
            onValueChange={(value) => onFilterGender(value === ALL ? null : value)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Feminino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>Limpar</Button>
        )}
      </CardContent>
    </Card>
  )
}
