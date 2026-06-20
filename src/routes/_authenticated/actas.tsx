import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Upload, Eye, Paperclip, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { EstadoBadge, SemaforoDot, ProgressBar } from "@/components/status";
import { ACTAS, avanceActa, semaforoDeEstado } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/actas")({
  component: Actas,
});

function Actas() {
  return (
    <div>
      <PageHeader title="Actas y acuerdos" description="Visualiza las actas registradas y sus acuerdos." />

      <div className="space-y-4">
        {ACTAS.map((acta) => {
          const avance = avanceActa(acta);
          return (
            <Card key={acta.id} className="overflow-hidden">
              <Accordion type="single" collapsible>
                <AccordionItem value={acta.id} className="border-0">
                  <div className="flex flex-wrap items-center gap-4 p-5">
                    <div className="min-w-[220px] flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold">{acta.titulo}</h3>
                        <Badge variant="outline">{acta.id}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><CalendarDays className="size-3.5" /> {acta.fecha}</span>
                        <span>Área: {acta.area}</span>
                        <span>Convocador: {acta.convocador}</span>
                      </div>
                    </div>
                    <Badge variant="accent">{acta.estado}</Badge>
                    <div className="w-40">
                      <div className="mb-1 flex justify-between text-xs"><span>Avance</span><span className="font-semibold">{avance}%</span></div>
                      <ProgressBar value={avance} />
                    </div>
                    <AccordionTrigger className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-primary hover:no-underline [&>svg]:hidden">
                      <span className="flex items-center gap-1">Ver detalle <ChevronDown className="size-4" /></span>
                    </AccordionTrigger>
                  </div>

                  <AccordionContent className="border-t bg-secondary/30 px-5 pb-5 pt-4">
                    <p className="mb-3 text-sm font-semibold text-primary">Acuerdos registrados</p>
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
                              <SemaforoDot semaforo={semaforoDeEstado(ac.estado)} />
                            </div>
                          </div>

                          <div className="mt-3 max-w-sm">
                            <div className="mb-1 flex justify-between text-xs"><span>Avance</span><span className="font-semibold">{ac.avance}%</span></div>
                            <ProgressBar value={ac.avance} />
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              <Paperclip className="mr-1 inline size-3.5" />
                              {ac.evidencias.length} evidencia(s)
                            </span>
                            {ac.evidencias.map((e) => (
                              <Badge key={e.id} variant="secondary" className="font-normal">{e.nombre}</Badge>
                            ))}
                            <div className="ml-auto flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => toast.success("Evidencia subida (simulado)")}>
                                <Upload className="size-3.5" /> Subir evidencia
                              </Button>
                              <Button size="sm" variant="ghost" disabled={ac.evidencias.length === 0}
                                onClick={() => toast.info("Abriendo evidencia…", { description: ac.evidencias[0]?.nombre })}>
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
    </div>
  );
}
