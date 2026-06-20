import { createFileRoute } from "@tanstack/react-router";
import { Upload, Eye } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SemaforoDot } from "@/components/status";
import { resumenAsistenciaPorArea } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/inasistentes")({
  component: Inasistentes,
});

const estadoBadge: Record<string, "success" | "warning" | "destructive"> = {
  Asisten: "success",
  "Cumplen parcialmente": "warning",
  "No cumplen": "destructive",
};

function Inasistentes() {
  const ASISTENCIA_AREAS = resumenAsistenciaPorArea();
  const totalAsist = ASISTENCIA_AREAS.reduce((s, a) => s + a.asistentes, 0);
  const totalInasist = ASISTENCIA_AREAS.reduce((s, a) => s + a.inasistentes, 0);

  return (
    <div>
      <PageHeader
        title="Inasistentes por área"
        description="Asistencia e inasistencias por área institucional."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total asistentes</p>
          <p className="font-display text-2xl font-bold text-success">
            {totalAsist}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total inasistentes</p>
          <p className="font-display text-2xl font-bold text-destructive">
            {totalInasist}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Áreas monitoreadas</p>
          <p className="font-display text-2xl font-bold text-primary">
            {ASISTENCIA_AREAS.length}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Área</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Asistentes</TableHead>
                <TableHead className="text-center">Inasistentes</TableHead>
                <TableHead className="text-center">
                  Evidencia no asistencia
                </TableHead>
                <TableHead className="text-center">Semáforo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ASISTENCIA_AREAS.map((a) => (
                <TableRow key={a.area}>
                  <TableCell className="font-medium">{a.area}</TableCell>
                  <TableCell>
                    <Badge variant={estadoBadge[a.estado]}>{a.estado}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-success">
                    {a.asistentes}
                  </TableCell>
                  <TableCell className="text-center text-destructive">
                    {a.inasistentes}
                  </TableCell>
                  <TableCell className="text-center">
                    {a.evidenciaNoAsistencia ? (
                      <Badge variant="secondary">Registrada</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Sin evidencia
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <SemaforoDot semaforo={a.semaforo} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toast.success(
                            "Evidencia de no asistencia subida (simulado)",
                            { description: a.area },
                          )
                        }
                      >
                        <Upload className="size-3.5" /> Subir evidencia
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          toast.info(`Inasistentes de ${a.area}`, {
                            description: `${a.inasistentes} persona(s) no asistieron.`,
                          })
                        }
                      >
                        <Eye className="size-3.5" /> Ver inasistentes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Semáforo: <span className="text-success">Verde</span> Asisten ·
          <span className="text-warning"> Amarillo</span> Cumplen parcialmente ·
          <span className="text-destructive"> Rojo</span> No cumplen
        </p>
      </Card>
    </div>
  );
}
