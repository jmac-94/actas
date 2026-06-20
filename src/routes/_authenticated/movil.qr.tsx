import { createFileRoute } from "@tanstack/react-router";
import { FileText, UserCheck } from "lucide-react";
import { MobileFrame } from "@/components/mobile-frame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FakeQR } from "@/components/fake-qr";
import { ACTAS } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/movil/qr")({
  component: MovilQR,
});

function MovilQR() {
  const acta = ACTAS[0];
  return (
    <MobileFrame title="QR del acta">
      <Card className="flex flex-col items-center p-5 text-center">
        <p className="mb-3 text-sm text-muted-foreground">
          Escanea el QR para ver el acta y registrar asistencia.
        </p>
        <FakeQR />
        <h3 className="mt-4 font-display text-base font-bold">{acta.titulo}</h3>
        <p className="text-xs text-muted-foreground">{acta.fecha} · {acta.area}</p>
      </Card>
      <Button variant="hero" className="w-full" onClick={() => toast.info("Abriendo acta…", { description: acta.titulo })}>
        <FileText className="size-4" /> Ver acta
      </Button>
      <Button variant="outline" className="w-full" onClick={() => toast.success("Redirigiendo a registro de asistencia")}>
        <UserCheck className="size-4" /> Registrar asistencia
      </Button>
    </MobileFrame>
  );
}
