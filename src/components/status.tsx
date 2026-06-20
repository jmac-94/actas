import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EstadoAcuerdo, Semaforo } from "@/lib/mock-data";

export function EstadoBadge({ estado }: { estado: EstadoAcuerdo }) {
  const map: Record<EstadoAcuerdo, "success" | "warning" | "accent" | "destructive"> = {
    Cumplido: "success",
    "En proceso": "accent",
    Pendiente: "warning",
    Vencido: "destructive",
  };
  return <Badge variant={map[estado]}>{estado}</Badge>;
}

export function SemaforoDot({ semaforo, label }: { semaforo: Semaforo; label?: string }) {
  const color =
    semaforo === "verde" ? "bg-success" : semaforo === "amarillo" ? "bg-warning" : "bg-destructive";
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-3 rounded-full shadow-sm ring-2 ring-background", color)} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const color = value >= 70 ? "bg-success" : value >= 40 ? "bg-accent" : "bg-warning";
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
    </div>
  );
}
