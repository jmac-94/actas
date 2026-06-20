import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarDays } from "lucide-react";
import { MobileFrame } from "@/components/mobile-frame";
import { Card } from "@/components/ui/card";
import { EstadoBadge, SemaforoDot } from "@/components/status";
import { TODOS_ACUERDOS, semaforoDeEstado } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/movil/calendario")({
  component: MovilCalendario,
});

function MovilCalendario() {
  // Acuerdos asignados al usuario (ejemplo: Ana Torres / o el primero)
  const acuerdos = TODOS_ACUERDOS.slice(0, 5);

  return (
    <MobileFrame title="Calendario de seguimiento">
      <Card className="flex items-center gap-2 p-3 text-sm">
        <CalendarDays className="size-5 text-primary" />
        <span className="text-muted-foreground">Tus acuerdos y recordatorios</span>
      </Card>

      {acuerdos.map((a) => (
        <Card key={a.id} className="p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium leading-snug">{a.descripcion}</p>
            <SemaforoDot semaforo={semaforoDeEstado(a.estado)} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>Inicio: {a.fechaInicio}</span>
            <span>Fin: {a.fechaFin}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <EstadoBadge estado={a.estado} />
            <span className="flex items-center gap-1 text-xs text-alert">
              <Bell className="size-3.5" /> Recordatorio activo
            </span>
          </div>
        </Card>
      ))}
    </MobileFrame>
  );
}
