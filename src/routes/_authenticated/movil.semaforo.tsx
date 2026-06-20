import { createFileRoute } from "@tanstack/react-router";
import { MobileFrame } from "@/components/mobile-frame";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SemaforoDot } from "@/components/status";
import { ASISTENCIA_AREAS } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/movil/semaforo")({
  component: MovilSemaforo,
});

const badge: Record<string, "success" | "warning" | "destructive"> = {
  Asisten: "success", "Cumplen parcialmente": "warning", "No cumplen": "destructive",
};

function MovilSemaforo() {
  return (
    <MobileFrame title="Semáforo de áreas">
      <Card className="p-3 text-xs text-muted-foreground">
        <p className="flex items-center gap-2"><SemaforoDot semaforo="verde" /> Verde: Asisten</p>
        <p className="mt-1 flex items-center gap-2"><SemaforoDot semaforo="amarillo" /> Amarillo: Cumplen</p>
        <p className="mt-1 flex items-center gap-2"><SemaforoDot semaforo="rojo" /> Rojo: No cumplen</p>
      </Card>

      {ASISTENCIA_AREAS.map((a) => (
        <Card key={a.area} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <SemaforoDot semaforo={a.semaforo} />
            <div>
              <p className="font-display font-semibold">{a.area}</p>
              <p className="text-xs text-muted-foreground">{a.asistentes} asisten · {a.inasistentes} faltan</p>
            </div>
          </div>
          <Badge variant={badge[a.estado]}>{a.estado}</Badge>
        </Card>
      ))}
    </MobileFrame>
  );
}
