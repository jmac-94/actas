import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Upload, FilePlus2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/crear-acta")({
  component: CrearActa,
});

function CrearActa() {
  const [iaLoading, setIaLoading] = useState(false);

  const generarIA = () => {
    setIaLoading(true);
    toast.info("Generando formato con IA…", { description: "La IA está ordenando el acta en el formato estándar." });
    setTimeout(() => {
      setIaLoading(false);
      toast.success("Formato generado con IA", { description: "El acta fue ordenada según el formato institucional (simulado)." });
    }, 1800);
  };

  const crear = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Acta creada correctamente", { description: "El acta fue registrada y está disponible en Actas y acuerdos." });
  };

  return (
    <div>
      <PageHeader
        title="Crear acta"
        description="Registra una nueva acta institucional con formato estándar."
        action={
          <Button variant="ai" onClick={generarIA} disabled={iaLoading}>
            <Sparkles className="size-4" /> {iaLoading ? "Generando…" : "Generar formato con IA"}
          </Button>
        }
      />

      <form onSubmit={crear} className="space-y-6">
        <Card className="p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Datos generales</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SelectField label="Tipo de acta" placeholder="Interna o Externa" items={["Interna", "Externa"]} />
            <SelectField label="Tipo de proceso" placeholder="Selecciona" items={["Estratégico", "Operativo", "Soporte"]} />
            <Field label="Fecha" type="date" />
            <Field label="Unidad orgánica" placeholder="Ej. Dirección de Calidad" />
            <Field label="Lugar físico o virtual" placeholder="Ej. Sala 201 / Zoom" />
            <Field label="Asunto de la reunión" placeholder="Asunto" />
            <Field label="Hora de inicio" type="time" />
            <Field label="Hora final" type="time" />
            <Field label="Nombre del convocador" placeholder="Ej. Ana Torres" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Contenido del acta</h3>
          <div className="grid gap-4">
            <AreaField label="Objetivo de la reunión" placeholder="Describe el objetivo principal…" />
            <AreaField label="Agenda de la reunión" placeholder="Lista los puntos de la agenda…" />
            <AreaField label="Desarrollo de la reunión" placeholder="Describe el desarrollo y acuerdos tomados…" />
            <AreaField label="Anexos" placeholder="Indica los anexos asociados…" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-2 font-display text-lg font-semibold">Archivo adjunto del acta (opcional)</h3>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-colors hover:border-accent">
            <Upload className="size-7 text-accent-foreground" />
            <span className="text-sm font-medium">Arrastra o haz clic para subir el acta</span>
            <span className="text-xs text-muted-foreground">PDF, Word o imagen escaneada</span>
            <input type="file" className="hidden" />
          </label>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="hero" size="lg">
            <FilePlus2 className="size-4" /> Crear acta
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} className="bg-card" />
    </div>
  );
}
function AreaField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea placeholder={placeholder} className="min-h-24 bg-card" />
    </div>
  );
}
function SelectField({ label, placeholder, items }: { label: string; placeholder: string; items: string[] }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select>
        <SelectTrigger className="bg-card"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>{items.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
