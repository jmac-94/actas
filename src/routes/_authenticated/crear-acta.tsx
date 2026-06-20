import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Upload, FilePlus2, Plus, Trash2 } from "lucide-react";
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

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

// ── tipos ──────────────────────────────────────────────────────────────────

interface Acuerdo {
  descripcion: string;
  responsable: string;
  fechaMaxima: string;
  seCumplio: "Si" | "No" | "";
}

interface Asistente {
  nombre: string;
  cargo: string;
  firma: string;
  firmo: boolean;
}

interface CamposActa {
  tipoActa: string;
  tipoProceso: string;
  fecha: string;
  unidadOrganica: string;
  lugar: string;
  asunto: string;
  horaInicio: string;
  horaFinal: string;
  convocador: string;
  objetivo: string;
  agenda: string;
  desarrollo: string;
  anexos: string;
  acuerdos: Acuerdo[];
  asistentes: Asistente[];
}

const acuerdoVacio = (): Acuerdo => ({ descripcion: "", responsable: "", fechaMaxima: "", seCumplio: "" });
const asistenteVacio = (): Asistente => ({ nombre: "", cargo: "", firma: "", firmo: false });

const estadoInicial: CamposActa = {
  tipoActa: "", tipoProceso: "", fecha: "", unidadOrganica: "",
  lugar: "", asunto: "", horaInicio: "", horaFinal: "", convocador: "",
  objetivo: "", agenda: "", desarrollo: "", anexos: "",
  acuerdos: [acuerdoVacio()],
  asistentes: [asistenteVacio()],
};

// ── extracción PDF ─────────────────────────────────────────────────────────

async function extraerTextoPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  console.log(`[PDF] "${file.name}" — ${pdf.numPages} página(s)`);
  const paginas: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const texto = content.items.map((item: any) => item.str).join(" ");
    console.log(`[PDF] Página ${i}:\n${texto}`);
    paginas.push(texto);
  }
  return paginas.join("\n");
}

// ── Gemini ─────────────────────────────────────────────────────────────────

async function analizarConGemini(texto: string): Promise<Partial<CamposActa>> {
  const prompt = `Eres un asistente que extrae información estructurada de actas institucionales en texto plano.

REGLAS IMPORTANTES:
- Para "seCumplio" en acuerdos: busca patrones como "Si (X)", "Si(X)", "SI X", "X Si", "Si [X]" para "Si"; y "No (X)", "No(X)", "NO X", "X No" para "No". Si no hay marca clara, deja "".
- Para "firma" de asistentes: si hay cualquier texto, símbolo, nombre o cadena en la columna de firma de esa persona, cópialo textualmente. Si está vacío o en blanco, deja "".
- Para "firmo": true si la columna de firma tiene contenido, false si está vacía.
- Devuelve SOLO JSON válido sin markdown ni explicaciones.

Estructura esperada:
{
  "tipoActa": "Interna | Externa | ''",
  "tipoProceso": "Estratégico | Operativo | Soporte | ''",
  "fecha": "YYYY-MM-DD o ''",
  "unidadOrganica": "",
  "lugar": "",
  "asunto": "",
  "horaInicio": "HH:MM o ''",
  "horaFinal": "HH:MM o ''",
  "convocador": "",
  "objetivo": "",
  "agenda": "",
  "desarrollo": "",
  "anexos": "",
  "acuerdos": [
    {
      "descripcion": "",
      "responsable": "",
      "fechaMaxima": "YYYY-MM-DD o texto encontrado",
      "seCumplio": "Si | No | ''"
    }
  ],
  "asistentes": [
    {
      "nombre": "",
      "cargo": "",
      "firma": "texto de la firma o ''",
      "firmo": true
    }
  ]
}

Texto del documento:
${texto.slice(0, 10000)}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  console.log("[Gemini] Respuesta:", raw);
  const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  if (!parsed.acuerdos?.length) parsed.acuerdos = [acuerdoVacio()];
  if (!parsed.asistentes?.length) parsed.asistentes = [asistenteVacio()];
  return parsed;
}

// ── componente principal ───────────────────────────────────────────────────

function CrearActa() {
  const [iaLoading, setIaLoading] = useState(false);
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);
  const [campos, setCampos] = useState<CamposActa>(estadoInicial);

  const set = (key: keyof CamposActa) => (val: string) =>
    setCampos((prev) => ({ ...prev, [key]: val }));

  // acuerdos
  const setAcuerdo = (i: number, key: keyof Acuerdo, val: string) =>
    setCampos((prev) => {
      const acuerdos = [...prev.acuerdos];
      acuerdos[i] = { ...acuerdos[i], [key]: val };
      return { ...prev, acuerdos };
    });
  const addAcuerdo = () =>
    setCampos((prev) => ({ ...prev, acuerdos: [...prev.acuerdos, acuerdoVacio()] }));
  const removeAcuerdo = (i: number) =>
    setCampos((prev) => ({ ...prev, acuerdos: prev.acuerdos.filter((_, idx) => idx !== i) }));

  // asistentes
  const setAsistente = (i: number, key: keyof Asistente, val: string | boolean) =>
    setCampos((prev) => {
      const asistentes = [...prev.asistentes];
      asistentes[i] = { ...asistentes[i], [key]: val };
      return { ...prev, asistentes };
    });
  const addAsistente = () =>
    setCampos((prev) => ({ ...prev, asistentes: [...prev.asistentes, asistenteVacio()] }));
  const removeAsistente = (i: number) =>
    setCampos((prev) => ({ ...prev, asistentes: prev.asistentes.filter((_, idx) => idx !== i) }));

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivoNombre(file.name);
    if (file.type !== "application/pdf") return;
    toast.info("Leyendo PDF…", { description: file.name });
    const texto = await extraerTextoPDF(file);
    toast.info("Analizando con Gemini…", { description: "Extrayendo campos del acta." });
    try {
      const resultado = await analizarConGemini(texto);
      setCampos((prev) => ({ ...prev, ...resultado }));
      toast.success("Formulario completado con IA", {
        description: "Revisa los campos y corrige si es necesario.",
      });
    } catch (err) {
      console.error("[Gemini]", err);
      toast.error("Error al analizar con IA");
    }
  };

  const generarIA = () => {
    setIaLoading(true);
    toast.info("Generando formato con IA…");
    setTimeout(() => {
      setIaLoading(false);
      toast.success("Formato generado con IA");
    }, 1800);
  };

  const crear = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Acta creada correctamente");
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

        {/* ── Datos generales ── */}
        <Card className="p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Datos generales</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SelectField label="Tipo de acta" placeholder="Interna o Externa" items={["Interna", "Externa"]} value={campos.tipoActa} onChange={set("tipoActa")} />
            <SelectField label="Tipo de proceso" placeholder="Selecciona" items={["Estratégico", "Operativo", "Soporte"]} value={campos.tipoProceso} onChange={set("tipoProceso")} />
            <Field label="Fecha" type="date" value={campos.fecha} onChange={set("fecha")} />
            <Field label="Unidad orgánica" placeholder="Ej. Dirección de Calidad" value={campos.unidadOrganica} onChange={set("unidadOrganica")} />
            <Field label="Lugar físico o virtual" placeholder="Ej. Sala 201 / Zoom" value={campos.lugar} onChange={set("lugar")} />
            <Field label="Asunto de la reunión" placeholder="Asunto" value={campos.asunto} onChange={set("asunto")} />
            <Field label="Hora de inicio" type="time" value={campos.horaInicio} onChange={set("horaInicio")} />
            <Field label="Hora final" type="time" value={campos.horaFinal} onChange={set("horaFinal")} />
            <Field label="Nombre del convocador" placeholder="Ej. Ana Torres" value={campos.convocador} onChange={set("convocador")} />
          </div>
        </Card>

        {/* ── Contenido ── */}
        <Card className="p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Contenido del acta</h3>
          <div className="grid gap-4">
            <AreaField label="Objetivo de la reunión" placeholder="Describe el objetivo principal…" value={campos.objetivo} onChange={set("objetivo")} />
            <AreaField label="Agenda de la reunión" placeholder="Lista los puntos de la agenda…" value={campos.agenda} onChange={set("agenda")} />
            <AreaField label="Desarrollo de la reunión" placeholder="Describe el desarrollo y acuerdos tomados…" value={campos.desarrollo} onChange={set("desarrollo")} />
            <AreaField label="Anexos" placeholder="Indica los anexos asociados…" value={campos.anexos} onChange={set("anexos")} />
          </div>
        </Card>

        {/* ── Acuerdos y Compromisos ── */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Acuerdos y Compromisos</h3>
            <Button type="button" variant="outline" size="sm" onClick={addAcuerdo}>
              <Plus className="size-3.5" /> Agregar acuerdo
            </Button>
          </div>
          <div className="space-y-3">
            {campos.acuerdos.map((ac, i) => (
              <div key={i} className="grid gap-3 rounded-lg border bg-secondary/20 p-4 md:grid-cols-[1fr_auto_auto_auto]">
                <div className="space-y-1.5 md:col-span-4">
                  <Label>Acuerdo / Compromiso {i + 1}</Label>
                  <Input
                    placeholder="Describe el acuerdo o compromiso…"
                    className="bg-card"
                    value={ac.descripcion}
                    onChange={(e) => setAcuerdo(i, "descripcion", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Responsable</Label>
                  <Input placeholder="Nombre" className="bg-card" value={ac.responsable} onChange={(e) => setAcuerdo(i, "responsable", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Fecha máx. cumplimiento</Label>
                  <Input type="date" className="bg-card" value={ac.fechaMaxima} onChange={(e) => setAcuerdo(i, "fechaMaxima", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>¿Se cumplió?</Label>
                  <Select value={ac.seCumplio} onValueChange={(v) => setAcuerdo(i, "seCumplio", v)}>
                    <SelectTrigger className="bg-card w-28">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Si">Sí</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeAcuerdo(i)}
                    disabled={campos.acuerdos.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Asistentes ── */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Asistentes</h3>
            <Button type="button" variant="outline" size="sm" onClick={addAsistente}>
              <Plus className="size-3.5" /> Agregar asistente
            </Button>
          </div>

          <div className="mb-2 hidden grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 px-1 md:grid">
            <span className="text-xs font-medium text-muted-foreground">Nombres y Apellidos</span>
            <span className="text-xs font-medium text-muted-foreground">Cargo</span>
            <span className="text-xs font-medium text-muted-foreground">Firma física o digital</span>
            <span className="text-xs font-medium text-muted-foreground">¿Firmó?</span>
            <span />
          </div>

          <div className="space-y-2">
            {campos.asistentes.map((as, i) => (
              <div key={i} className="grid gap-2 rounded-lg border bg-secondary/20 p-3 md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-center md:rounded-none md:border-0 md:border-b md:bg-transparent md:p-1">
                <Input
                  placeholder="Nombre completo"
                  className="bg-card"
                  value={as.nombre}
                  onChange={(e) => setAsistente(i, "nombre", e.target.value)}
                />
                <Input
                  placeholder="Cargo"
                  className="bg-card"
                  value={as.cargo}
                  onChange={(e) => setAsistente(i, "cargo", e.target.value)}
                />
                <Input
                  placeholder="Firma o código"
                  className="bg-card"
                  value={as.firma}
                  onChange={(e) => setAsistente(i, "firma", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setAsistente(i, "firmo", !as.firmo)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    as.firmo
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {as.firmo ? "Firmó ✓" : "Sin firma"}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeAsistente(i)}
                  disabled={campos.asistentes.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Archivo ── */}
        <Card className="p-6">
          <h3 className="mb-2 font-display text-lg font-semibold">Archivo adjunto del acta (opcional)</h3>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 px-6 py-10 text-center transition-colors hover:border-accent">
            <Upload className="size-7 text-accent-foreground" />
            <span className="text-sm font-medium">Arrastra o haz clic para subir el acta</span>
            <span className="text-xs text-muted-foreground">Sube un PDF y Gemini completará el formulario automáticamente</span>
            {archivoNombre && (
              <span className="mt-1 rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {archivoNombre}
              </span>
            )}
            <input type="file" className="hidden" accept=".pdf" onChange={handleArchivo} />
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

// ── helpers de campo ───────────────────────────────────────────────────────

function Field({ label, type = "text", placeholder, value, onChange }: {
  label: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} className="bg-card" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function AreaField({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea placeholder={placeholder} className="min-h-24 bg-card" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SelectField({ label, placeholder, items, value, onChange }: {
  label: string; placeholder: string; items: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-card"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>{items.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
