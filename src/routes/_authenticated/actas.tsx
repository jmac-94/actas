import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  Upload,
  Eye,
  Paperclip,
  CalendarDays,
  FileText,
  FileSpreadsheet,
  FileType,
  Image as ImageIcon,
  Video,
  Link2,
  ScanLine,
  ExternalLink,
  UserX,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EstadoBadge, SemaforoDot, ProgressBar } from "@/components/status";
import {
  ACTAS,
  avanceActa,
  semaforoDeEstado,
  crearEvidenciaDemo,
  simularMatchIA,
} from "@/lib/mock-data";
import type { Acta, Evidencia } from "@/lib/mock-data";
import { useProfile } from "@/lib/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/actas")({
  component: Actas,
});

// Documento de referencia para la vista de "acta virtual" (compartido en la demo).
const ACTA_VIRTUAL_URL =
  "https://1drv.ms/w/c/d418b07a3fe22d7f/IQAcC77ynQewQrKZsxT3EX9PAX3ME2LSrP781DWiUg2Mdd0?e=Ac49Dc";

const ICONO: Record<
  Evidencia["tipo"],
  React.ComponentType<{ className?: string }>
> = {
  PDF: FileText,
  Word: FileType,
  Excel: FileSpreadsheet,
  Imagen: ImageIcon,
  Video: Video,
  URL: Link2,
  "Acta escaneada": ScanLine,
};

function Actas() {
  const { data: profile } = useProfile();
  const [actas, setActas] = useState<Acta[]>(ACTAS);
  const [evidenciasAbiertas, setEvidenciasAbiertas] = useState<{
    acuerdo: string;
    evidencias: Evidencia[];
  } | null>(null);
  const [actaVirtual, setActaVirtual] = useState<Acta | null>(null);
  const [inasistenciaAbiertaId, setInasistenciaAbiertaId] = useState<
    string | null
  >(null);
  const [calculandoId, setCalculandoId] = useState<string | null>(null);

  const subirEvidencia = (actaId: string, acuerdoId: string) => {
    const nueva = crearEvidenciaDemo(
      profile?.nombre ?? "Usuario demo",
      acuerdoId,
    );
    setActas((prev) =>
      prev.map((a) =>
        a.id !== actaId
          ? a
          : {
              ...a,
              acuerdos: a.acuerdos.map((ac) =>
                ac.id !== acuerdoId
                  ? ac
                  : { ...ac, evidencias: [nueva, ...ac.evidencias] },
              ),
            },
      ),
    );
    toast.success("Evidencia subida", { description: nueva.nombre });
  };

  const calcularInasistencia = (actaId: string) => {
    setCalculandoId(actaId);
    toast.info("Subiendo acta física y procesando con IA…", {
      description: "Comparando el acta virtual con la firmada en físico.",
    });
    setTimeout(() => {
      setActas((prev) =>
        prev.map((a) =>
          a.id !== actaId
            ? a
            : { ...a, participantes: simularMatchIA(a.participantes) },
        ),
      );
      setCalculandoId(null);
      toast.success("Match con IA completado", {
        description: "Se actualizó la asistencia según el acta física.",
      });
    }, 1600);
  };

  const inasistenciaAbierta = actas.find((a) => a.id === inasistenciaAbiertaId);

  return (
    <div>
      <PageHeader
        title="Actas y acuerdos"
        description="Visualiza las actas registradas y sus acuerdos."
      />

      <div className="space-y-4">
        {actas.map((acta) => {
          const avance = avanceActa(acta);
          return (
            <Card key={acta.id} className="overflow-hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value={acta.id} className="border-0">
                  <div className="flex flex-wrap items-center gap-4 p-5">
                    <div className="min-w-[220px] flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold">
                          {acta.titulo}
                        </h3>
                        <Badge variant="outline">{acta.id}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3.5" /> {acta.fecha}
                        </span>
                        <span>Área: {acta.area}</span>
                        <span>Convocador: {acta.convocador}</span>
                      </div>
                    </div>
                    <Badge variant="accent">{acta.estado}</Badge>
                    <div className="w-40">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>Avance</span>
                        <span className="font-semibold">{avance}%</span>
                      </div>
                      <ProgressBar value={avance} />
                    </div>
                    <AccordionTrigger className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-primary hover:no-underline [&>svg]:hidden">
                      <span className="flex items-center gap-1">
                        Ver detalle <ChevronDown className="size-4" />
                      </span>
                    </AccordionTrigger>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t bg-secondary/20 px-5 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActaVirtual(acta)}
                    >
                      <FileText className="size-3.5" /> Ver acta virtual
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInasistenciaAbiertaId(acta.id)}
                    >
                      <UserX className="size-3.5" /> Ver inasistencia
                    </Button>
                    <Button
                      size="sm"
                      variant="ai"
                      disabled={calculandoId === acta.id}
                      onClick={() => calcularInasistencia(acta.id)}
                    >
                      {calculandoId === acta.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="size-3.5" />
                      )}
                      {calculandoId === acta.id
                        ? "Calculando…"
                        : "Subir acta física y calcular inasistencia"}
                    </Button>
                  </div>

                  <AccordionContent className="border-t bg-secondary/30 px-5 pb-5 pt-4">
                    <p className="mb-3 text-sm font-semibold text-primary">
                      Acuerdos registrados
                    </p>
                    <div className="space-y-3">
                      {acta.acuerdos.map((ac) => (
                        <Card key={ac.id} className="p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-medium">{ac.descripcion}</p>
                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span>Responsable: {ac.responsable}</span>
                                <span>Inicio: {ac.fechaInicio}</span>
                                <span>Vence: {ac.fechaFin}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <EstadoBadge estado={ac.estado} />
                              <SemaforoDot
                                semaforo={semaforoDeEstado(ac.estado)}
                              />
                            </div>
                          </div>

                          <div className="mt-3 max-w-sm">
                            <div className="mb-1 flex justify-between text-xs">
                              <span>Avance</span>
                              <span className="font-semibold">
                                {ac.avance}%
                              </span>
                            </div>
                            <ProgressBar value={ac.avance} />
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              <Paperclip className="mr-1 inline size-3.5" />
                              {ac.evidencias.length} evidencia(s)
                            </span>
                            {ac.evidencias.map((e) => (
                              <Badge
                                key={e.id}
                                variant="secondary"
                                className="font-normal"
                              >
                                {e.nombre}
                              </Badge>
                            ))}
                            <div className="ml-auto flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => subirEvidencia(acta.id, ac.id)}
                              >
                                <Upload className="size-3.5" /> Subir evidencia
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={ac.evidencias.length === 0}
                                onClick={() =>
                                  setEvidenciasAbiertas({
                                    acuerdo: ac.descripcion,
                                    evidencias: ac.evidencias,
                                  })
                                }
                              >
                                <Eye className="size-3.5" /> Ver evidencia
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={!!evidenciasAbiertas}
        onOpenChange={(open) => !open && setEvidenciasAbiertas(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Evidencias del acuerdo</DialogTitle>
            <DialogDescription className="truncate">
              {evidenciasAbiertas?.acuerdo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {evidenciasAbiertas?.evidencias.map((e) => {
              const Icon = ICONO[e.tipo];
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.tipo} · {e.usuario} · {e.fecha}
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    <a
                      href={e.archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-3.5" /> Ver
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!actaVirtual}
        onOpenChange={(open) => !open && setActaVirtual(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Acta virtual</DialogTitle>
            <DialogDescription className="truncate">
              {actaVirtual?.titulo}
            </DialogDescription>
          </DialogHeader>
          {actaVirtual && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 rounded-lg border bg-card p-3 text-xs">
                <span className="text-muted-foreground">Área</span>
                <span className="text-right font-medium">
                  {actaVirtual.area}
                </span>
                <span className="text-muted-foreground">Convocador</span>
                <span className="text-right font-medium">
                  {actaVirtual.convocador}
                </span>
                <span className="text-muted-foreground">Tipo / proceso</span>
                <span className="text-right font-medium">
                  {actaVirtual.tipo} · {actaVirtual.proceso}
                </span>
                <span className="text-muted-foreground">Fecha</span>
                <span className="text-right font-medium">
                  {actaVirtual.fecha}
                </span>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-muted-foreground">
                  Acuerdos
                </p>
                <ul className="space-y-1">
                  {actaVirtual.acuerdos.map((ac) => (
                    <li
                      key={ac.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-secondary/40 px-3 py-1.5 text-xs"
                    >
                      <span className="truncate">{ac.descripcion}</span>
                      <EstadoBadge estado={ac.estado} />
                    </li>
                  ))}
                </ul>
              </div>
              <Button asChild variant="outline" className="w-full">
                <a
                  href={ACTA_VIRTUAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" /> Abrir documento original
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!inasistenciaAbiertaId}
        onOpenChange={(open) => !open && setInasistenciaAbiertaId(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inasistencia del acta</DialogTitle>
            <DialogDescription className="truncate">
              {inasistenciaAbierta?.titulo}
            </DialogDescription>
          </DialogHeader>
          {inasistenciaAbierta && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-success/10 p-3">
                  <p className="font-display text-xl font-bold text-success">
                    {
                      inasistenciaAbierta.participantes.filter((p) => p.asistio)
                        .length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Asistentes</p>
                </div>
                <div className="rounded-lg bg-destructive/10 p-3">
                  <p className="font-display text-xl font-bold text-destructive">
                    {
                      inasistenciaAbierta.participantes.filter(
                        (p) => !p.asistio,
                      ).length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Inasistentes</p>
                </div>
              </div>
              <div className="max-h-72 space-y-1.5 overflow-y-auto">
                {inasistenciaAbierta.participantes.map((p) => (
                  <div
                    key={p.nombre}
                    className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {p.asistio ? (
                        <CheckCircle2 className="size-4 shrink-0 text-success" />
                      ) : (
                        <XCircle className="size-4 shrink-0 text-destructive" />
                      )}
                      {p.nombre}
                    </span>
                    {!p.asistio && p.evidenciaNoAsistencia && (
                      <Badge variant="secondary" className="font-normal">
                        Evidencia registrada
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="ai"
                className="w-full"
                disabled={calculandoId === inasistenciaAbierta.id}
                onClick={() => calcularInasistencia(inasistenciaAbierta.id)}
              >
                {calculandoId === inasistenciaAbierta.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Subir acta física y calcular con IA
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
