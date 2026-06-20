import { createFileRoute } from "@tanstack/react-router";
import {
  FileText, FileSpreadsheet, FileType, Image as ImageIcon, Video, Link2, ScanLine, Eye, Upload, Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TODAS_EVIDENCIAS } from "@/lib/mock-data";
import type { Evidencia } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/evidencias")({
  component: Evidencias,
});

const ICONO: Record<Evidencia["tipo"], React.ComponentType<{ className?: string }>> = {
  PDF: FileText, Word: FileType, Excel: FileSpreadsheet, Imagen: ImageIcon,
  Video: Video, URL: Link2, "Acta escaneada": ScanLine,
};

const TIPOS_SUBIDA = [
  "URL de grabación de reunión virtual", "Fotos de la reunión", "Videos de la reunión",
  "Documentos PDF", "Documentos Word", "Archivos Excel", "Imágenes", "Acta física escaneada",
];

function Evidencias() {
  return (
    <div>
      <PageHeader title="Evidencias de la reunión" description="Sube y visualiza evidencias de la reunión y los acuerdos." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h3 className="mb-3 font-display text-lg font-semibold">Registrar evidencia</h3>
          <div className="space-y-2">
            {TIPOS_SUBIDA.map((t) => (
              <button
                key={t}
                onClick={() => toast.success("Evidencia registrada (simulado)", { description: t })}
                className="flex w-full items-center justify-between rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-accent hover:bg-accent/10"
              >
                {t} <Upload className="size-4 text-accent-foreground" />
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 p-4">
            <p className="flex items-center gap-2 font-semibold text-primary">
              <ScanLine className="size-5" /> Subir acta física
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-accent-foreground">
              <Sparkles className="size-3.5" /> Match con IA para calcular inasistentes
            </p>
            <Button variant="ai" size="sm" className="mt-3 w-full"
              onClick={() => toast.info("Procesando con IA…", { description: "Detectando asistentes e inasistentes (simulado)." })}>
              <Upload className="size-4" /> Subir y analizar
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <h3 className="mb-3 font-display text-lg font-semibold">Evidencias registradas</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {TODAS_EVIDENCIAS.map((e) => {
              const Icon = ICONO[e.tipo];
              return (
                <Card key={e.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{e.nombre}</p>
                      <Badge variant="secondary" className="mt-1 font-normal">{e.tipo}</Badge>
                    </div>
                  </div>
                  <div className="mt-3 space-y-0.5 text-xs text-muted-foreground">
                    <p>Subido: {e.fecha}</p>
                    <p>Por: {e.usuario}</p>
                    <p>Acuerdo: {e.acuerdo} · {e.area}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full"
                    onClick={() => toast.info("Abriendo evidencia…", { description: e.nombre })}>
                    <Eye className="size-4" /> Ver evidencia
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
