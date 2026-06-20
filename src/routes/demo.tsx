import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  CalendarClock,
  Sparkles,
  FileText,
  ClipboardList,
  Brain,
  UploadCloud,
  QrCode,
  Fingerprint,
  Image as ImageIcon,
  FileSpreadsheet,
  Link2,
  ScanLine,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  FolderCheck,
  ClipboardCheck,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo, LogoIso } from "@/components/logo";
import { SemaforoDot, ProgressBar } from "@/components/status";

export const Route = createFileRoute("/demo")({
  ssr: false,
  component: DemoPage,
});

const TOTAL = 6;

function DemoPage() {
  const [step, setStep] = useState(0);
  const progress = ((step + 1) / TOTAL) * 100;

  const next = () => setStep((s) => Math.min(s + 1, TOTAL - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 via-background to-background text-foreground">
      {/* Encabezado */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <LogoIso size="md" />
            <div className="leading-tight">
              <span className="block font-display text-sm font-extrabold">
                <span className="text-accent">Compromet</span>
                <span className="text-primary">IA</span>
              </span>
              <span className="block text-[11px] text-muted-foreground">Demo para jurado</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="size-4" /> Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/login" search={{ demo: true }}>
                Saltar demo e ingresar
              </Link>
            </Button>
          </div>
        </div>
        {/* Barra de progreso */}
        <div className="h-1.5 w-full bg-secondary">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
            Demo guiada de ComprometIA
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Una institución educativa realiza una reunión de calidad académica. ComprometIA convierte
            esa acta en un flujo vivo de seguimiento hasta el cumplimiento.
          </p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card px-3.5 py-1.5 text-xs font-semibold text-primary shadow-soft">
            <Sparkles className="size-4 text-accent" /> Paso {step + 1} de {TOTAL}
          </span>
        </div>

        {/* Pasos */}
        <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {step === 0 && <Step1 />}
          {step === 1 && <Step2 />}
          {step === 2 && <Step3 />}
          {step === 3 && <Step4 />}
          {step === 4 && <Step5 />}
          {step === 5 && <Step6 />}
        </div>

        {/* Indicadores + navegación */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Anterior
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Ir al paso ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : "w-2 bg-border hover:bg-accent/60"
                }`}
              />
            ))}
          </div>

          {step < TOTAL - 1 ? (
            <Button variant="hero" onClick={next}>
              Siguiente <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button asChild variant="hero">
              <Link to="/login">
                <LogIn className="size-4" /> Iniciar sesión
              </Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------- Estructura compartida ---------- */

function StepShell({
  n,
  title,
  text,
  children,
}: {
  n: number;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="lg:sticky lg:top-28">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent font-display text-lg font-bold text-primary-foreground shadow-soft">
          {n}
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-primary sm:text-2xl">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Tag({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-primary">
      <Icon className="size-3.5 text-accent" /> {children}
    </span>
  );
}

/* ---------- Paso 1 ---------- */

function Step1() {
  return (
    <StepShell
      n={1}
      title="Se realiza una reunión de calidad académica"
      text="El área de calidad convoca una reunión para revisar compromisos de acreditación, asistencia y entrega de evidencias."
    >
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between bg-gradient-to-r from-primary to-accent px-5 py-3 text-primary-foreground">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Users className="size-4" /> Reunión virtual
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs">
            <span className="size-2 animate-pulse rounded-full bg-success" /> En vivo
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-secondary/40 p-4">
          {["Mariana Soto", "Ana Torres", "Luis Ramírez", "Camila Flores", "Jorge Díaz", "Sofía León"].map((p) => (
            <div key={p} className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-2.5 shadow-soft">
              <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
                {p.split(" ").map((w) => w[0]).join("")}
              </span>
              <span className="text-center text-[10px] leading-tight text-muted-foreground">{p}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 p-5 text-sm">
          <Row label="Acta" value="Reunión de Calidad Académica" />
          <Row label="Área" value="Calidad" />
          <Row label="Convocador" value="Mariana Soto" />
          <Row label="Fecha" value="20/06/2026" icon={CalendarClock} />
        </div>
      </Card>
    </StepShell>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon?: LucideIcon }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
        {Icon && <Icon className="size-3.5 text-accent" />} {value}
      </span>
    </div>
  );
}

/* ---------- Paso 2 ---------- */

function Step2() {
  return (
    <StepShell
      n={2}
      title="El convocador crea el acta en formato estándar"
      text="ComprometIA permite registrar el acta con agenda, desarrollo, participantes, anexos y acuerdos. La IA puede ayudar a ordenar el contenido en un formato institucional."
    >
      <Card className="p-5">
        <div className="space-y-3.5">
          {[
            { l: "Tipo de acta", v: "Reunión interna" },
            { l: "Unidad orgánica", v: "Área de Calidad" },
            { l: "Asunto", v: "Compromisos de acreditación" },
          ].map((f) => (
            <FormField key={f.l} label={f.l} value={f.v} />
          ))}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Agenda</label>
            <div className="rounded-lg border border-input bg-secondary/30 px-3 py-2 text-sm text-foreground">
              1. Revisión de acuerdos previos · 2. Evidencias de acreditación · 3. Asistencia
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Desarrollo</label>
            <div className="h-16 rounded-lg border border-input bg-secondary/30 px-3 py-2 text-sm text-muted-foreground">
              Se acuerda actualizar la matriz de seguimiento y validar evidencias antes del cierre...
            </div>
          </div>
          <FormField label="Anexos" value="2 archivos adjuntos" />
          <Button variant="ai" className="w-full">
            <Brain className="size-4" /> Generar formato con IA
          </Button>
        </div>
        <Tag icon={Sparkles}>IA simulada para estructurar el acta</Tag>
      </Card>
    </StepShell>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}

/* ---------- Paso 3 ---------- */

function Step3() {
  const acuerdos = [
    { t: "Actualizar matriz de seguimiento", r: "Ana Torres", estado: "En proceso", avance: 60, s: "amarillo" as const },
    { t: "Subir evidencia del informe de acreditación", r: "Luis Ramírez", estado: "Pendiente", avance: 20, s: "amarillo" as const },
    { t: "Validar asistencia de participantes", r: "Camila Flores", estado: "Vencido", avance: 40, s: "rojo" as const },
  ];
  return (
    <StepShell
      n={3}
      title="Cada acuerdo queda asignado a un responsable"
      text="Los compromisos ya no quedan escritos sin seguimiento. Cada acuerdo tiene responsable, fecha de inicio, fecha fin, estado y porcentaje de avance."
    >
      <div className="space-y-3">
        {acuerdos.map((a) => (
          <Card key={a.t} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <SemaforoDot semaforo={a.s} />
                <div>
                  <p className="text-sm font-semibold text-primary">{a.t}</p>
                  <p className="text-xs text-muted-foreground">Responsable: {a.r}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">
                {a.estado}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <ProgressBar value={a.avance} />
              <span className="w-10 shrink-0 text-right text-xs font-bold text-primary">{a.avance}%</span>
            </div>
          </Card>
        ))}
        <div className="flex flex-wrap gap-3 rounded-xl bg-secondary/40 p-3 text-xs">
          <Legend color="bg-success" label="Verde: cumplido" />
          <Legend color="bg-warning" label="Amarillo: en proceso" />
          <Legend color="bg-destructive" label="Rojo: vencido" />
        </div>
      </div>
    </StepShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`size-2.5 rounded-full ${color}`} /> {label}
    </span>
  );
}

/* ---------- Paso 4 ---------- */

function Step4() {
  return (
    <StepShell
      n={4}
      title="Se validan evidencias y asistencia"
      text="Cada acuerdo puede tener evidencias vinculadas, como documentos, fotos, videos, grabaciones o actas físicas. La asistencia puede registrarse con QR y firma virtual."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-primary">
            <UploadCloud className="size-4 text-accent" /> Evidencias
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { icon: FileText, t: "PDF" },
              { icon: FileText, t: "Word" },
              { icon: FileSpreadsheet, t: "Excel" },
              { icon: ImageIcon, t: "Imagen" },
              { icon: Link2, t: "URL de grabación" },
              { icon: ScanLine, t: "Acta física escaneada" },
            ].map((e) => (
              <li key={e.t} className="flex items-center gap-2.5 rounded-lg bg-secondary/40 px-3 py-2">
                <e.icon className="size-4 text-accent" />
                <span className="text-foreground">{e.t}</span>
                <CheckCircle2 className="ml-auto size-4 text-success" />
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-primary">
            <QrCode className="size-4 text-accent" /> Asistencia
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { icon: QrCode, t: "QR del acta" },
              { icon: Fingerprint, t: "Firma virtual" },
              { icon: ScanLine, t: "Reconocimiento facial simulado" },
              { icon: Users, t: "Lista de asistentes e inasistentes" },
            ].map((e) => (
              <li key={e.t} className="flex items-center gap-2.5 rounded-lg bg-secondary/40 px-3 py-2">
                <e.icon className="size-4 text-accent" />
                <span className="text-foreground">{e.t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-lg bg-success/10 px-2 py-2 font-semibold text-success">5 asistentes</div>
            <div className="rounded-lg bg-destructive/10 px-2 py-2 font-semibold text-destructive">1 inasistente</div>
          </div>
        </Card>
      </div>
      <Tag icon={ShieldCheck}>Todo queda centralizado y asociado al acta correspondiente</Tag>
    </StepShell>
  );
}

/* ---------- Paso 5 ---------- */

function Step5() {
  const kpis = [
    { v: "24", l: "Actas registradas" },
    { v: "58", l: "Acuerdos monitoreados" },
    { v: "76%", l: "Avance general" },
  ];
  const estados = [
    { v: "32", l: "Cumplidos", color: "text-success", bg: "bg-success/10" },
    { v: "12", l: "En proceso", color: "text-warning", bg: "bg-warning/10" },
    { v: "5", l: "Vencidos", color: "text-destructive", bg: "bg-destructive/10" },
  ];
  const areas = [
    { a: "Calidad", v: 88 },
    { a: "Acreditación", v: 72 },
    { a: "Evaluación", v: 64 },
    { a: "Administración", v: 80 },
    { a: "Comunicación", v: 55 },
  ];
  return (
    <StepShell
      n={5}
      title="El SuperAdmin visualiza el cumplimiento en tiempo real"
      text="El área de calidad puede ver qué acuerdos avanzan, cuáles están vencidos, qué evidencias faltan y qué áreas necesitan seguimiento."
    >
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-primary">
          <LayoutDashboard className="size-4 text-accent" /> Dashboard de seguimiento
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {kpis.map((k) => (
            <div key={k.l} className="rounded-xl bg-secondary/50 p-3 text-center">
              <div className="font-display text-xl font-extrabold text-primary">{k.v}</div>
              <div className="text-[10px] leading-tight text-muted-foreground">{k.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {estados.map((e) => (
            <div key={e.l} className={`rounded-xl ${e.bg} p-3 text-center`}>
              <div className={`font-display text-xl font-extrabold ${e.color}`}>{e.v}</div>
              <div className="text-[10px] leading-tight text-muted-foreground">{e.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Donut simulado */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="flex size-28 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(var(--success) 0% 65%, var(--warning) 65% 88%, var(--destructive) 88% 100%)",
              }}
            >
              <div className="flex size-20 flex-col items-center justify-center rounded-full bg-card">
                <span className="font-display text-lg font-extrabold text-primary">76%</span>
                <span className="text-[9px] text-muted-foreground">avance</span>
              </div>
            </div>
          </div>
          {/* Barras por área */}
          <div className="space-y-2">
            {areas.map((a) => (
              <div key={a.a}>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{a.a}</span>
                  <span className="font-semibold text-primary">{a.v}%</span>
                </div>
                <ProgressBar value={a.v} />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </StepShell>
  );
}

/* ---------- Paso 6 ---------- */

function Step6() {
  const beneficios = [
    { icon: TrendingUp, t: "Más trazabilidad" },
    { icon: ClipboardCheck, t: "Menos seguimiento manual" },
    { icon: FolderCheck, t: "Evidencias centralizadas" },
    { icon: ShieldCheck, t: "Mejor preparación para auditoría y acreditación" },
  ];
  return (
    <StepShell
      n={6}
      title="El acta deja de ser un documento y se convierte en gestión"
      text="Con ComprometIA, cada reunión termina con compromisos claros, responsables visibles, evidencias verificables y seguimiento hasta el cumplimiento."
    >
      <div>
        <div className="grid gap-3 sm:grid-cols-2">
          {beneficios.map((b) => (
            <Card key={b.t} className="flex items-start gap-3 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-soft">
                <b.icon className="size-5" />
              </span>
              <p className="text-sm font-semibold text-primary">{b.t}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-4 bg-gradient-to-br from-card to-secondary/40 p-5 text-center">
          <Logo size="lg" className="justify-center" />
          <p className="mt-3 text-sm text-muted-foreground">
            Ingresa con el usuario de demostración para explorar la plataforma completa.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-4">
            <Link to="/login">
              <LogIn className="size-4" /> Iniciar sesión
            </Link>
          </Button>
        </Card>
      </div>
    </StepShell>
  );
}
