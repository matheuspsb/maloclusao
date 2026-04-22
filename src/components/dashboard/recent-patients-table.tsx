import { Link } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { STABILOMETRY_BADGE } from "@/constants/patient"
import type { Patient } from "@/types/patient"

interface RecentPatientsTableProps {
  patients: Patient[]
}

export function RecentPatientsTable({ patients }: RecentPatientsTableProps) {
  return (
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
            {patients.map((patient) => (
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
  )
}
