import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock, FileX, UserX } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EstadoBadge, SemaforoDot, ProgressBar } from "@/components/status";
import { TODOS_ACUERDOS, AREAS, RESPONSABLES, semaforoDeEstado } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/seguimiento")({
  component: Seguimiento,
});

function Seguimiento() {
  const [area, setArea] = useState("todas");
  const [responsable, setResponsable] = useState("todos");
  const [estado, setEstado] = useState("todos");

  const filtrados = useMemo(
    () =>
      TODOS_ACUERDOS.filter(
        (a) =>
          (area === "todas" || a.area === area) &&
          (responsable === "todos" || a.responsable === responsable) &&
          (estado === "todos" || a.estado === estado),
      ),
    [area, responsable, estado],
  );

  const proximos = filtrados.filter((a) => a.estado === "En proceso" || a.estado === "Pendiente").length;
  const vencidos = filtrados.filter((a) => a.estado === "Vencido").length;
  const sinEvidencia = filtrados.filter((a) => a.evidencias.length === 0).length;
  const sinResponsable = filtrados.filter((a) => !a.responsable).length;
  const avanceGeneral = Math.round(filtrados.reduce((s, a) => s + a.avance, 0) / (filtrados.length || 1));

  return (
    <div>
      <PageHeader
        title="Seguimiento de acuerdos"
        description="Monitorea el avance de los compromisos institucionales."
        action={
          <div className="flex flex-wrap gap-2">
            <F placeholder="Área" value={area} items={["todas", ...AREAS]} onChange={setArea} />
            <F placeholder="Responsable" value={responsable} items={["todos", ...RESPONSABLES]} onChange={setResponsable} />
            <F placeholder="Estado" value={estado} items={["todos", "Pendiente", "En proceso", "Cumplido", "Vencido"]} onChange={setEstado} />
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Alerta icon={Clock} color="warning" label="Próximos a vencer" value={proximos} />
        <Alerta icon={AlertTriangle} color="destructive" label="Acuerdos vencidos" value={vencidos} />
        <Alerta icon={FileX} color="alert" label="Sin evidencia" value={sinEvidencia} />
        <Alerta icon={UserX} color="muted" label="Sin responsable" value={sinResponsable} />
      </div>

      <Card className="mb-4 flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">Avance general (acuerdos filtrados)</p>
          <p className="font-display text-2xl font-bold text-primary">{avanceGeneral}%</p>
        </div>
        <div className="w-full max-w-md"><ProgressBar value={avanceGeneral} /></div>
      </Card>

      <div className="space-y-3">
        {filtrados.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium">{a.descripcion}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{a.actaTitulo}</span>
                  <span>Responsable: {a.responsable}</span>
                  <span>Inicio: {a.fechaInicio}</span>
                  <span>Fin: {a.fechaFin}</span>
                  <span>Área: {a.area}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <EstadoBadge estado={a.estado} />
                <SemaforoDot semaforo={semaforoDeEstado(a.estado)} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1"><ProgressBar value={a.avance} /></div>
              <span className="text-sm font-semibold">{a.avance}%</span>
            </div>
          </Card>
        ))}
        {filtrados.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground">No hay acuerdos con esos filtros.</Card>
        )}
      </div>
    </div>
  );
}

function Alerta({ icon: Icon, color, label, value }: {
  icon: React.ComponentType<{ className?: string }>; color: string; label: string; value: number;
}) {
  const colorMap: Record<string, string> = {
    warning: "bg-warning/15 text-warning-foreground", destructive: "bg-destructive/15 text-destructive",
    alert: "bg-alert/15 text-alert", muted: "bg-muted text-muted-foreground",
  };
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className={`flex size-11 items-center justify-center rounded-lg ${colorMap[color]}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

function F({ placeholder, value, items, onChange }: {
  placeholder: string; value: string; items: string[]; onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[150px] bg-card"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {items.map((i) => <SelectItem key={i} value={i}>{i === "todas" || i === "todos" ? `Todos: ${placeholder}` : i}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
