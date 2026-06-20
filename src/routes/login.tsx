import { useState } from "react";
import { createFileRoute, useNavigate, redirect, Link } from "@tanstack/react-router";
import { Loader2, ArrowLeft, ClipboardList, Clock, Brain, ShieldCheck, FileText, Bell, CheckCircle2, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { LogoIso } from "@/components/logo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { demo?: boolean } => ({
    demo: search.demo === true || search.demo === "true",
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  component: AuthPage,
});

const DEMO_CREDENTIALS = { email: "superadmin@comprometia.com", password: "123123aA" };

const DEMO = [
  { email: "superadmin@comprometia.com", rol: "SuperAdmin" },
  { email: "admin@comprometia.com", rol: "Admin" },
  { email: "convocador@comprometia.com", rol: "Convocador" },
  { email: "asistente@comprometia.com", rol: "Asistente" },
];

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ClipboardList,
    title: "Actas centralizadas",
    description: "Gestiona todas las actas institucionales desde una sola plataforma.",
  },
  {
    icon: Clock,
    title: "Seguimiento automático",
    description: "Monitorea compromisos, responsables y fechas límite en tiempo real.",
  },
  {
    icon: Brain,
    title: "IA predictiva",
    description: "Detecta riesgos de incumplimiento y genera alertas inteligentes.",
  },
  {
    icon: ShieldCheck,
    title: "Trazabilidad total",
    description: "Cada acuerdo queda registrado con evidencias verificables.",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "+95%", label: "Cumplimiento de acuerdos" },
  { value: "3x", label: "Más rápido el seguimiento" },
  { value: "24/7", label: "Monitoreo con IA" },
];

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: FileText, title: "Registra el acta", description: "Crea y documenta los acuerdos de cada reunión." },
  { icon: Bell, title: "Asigna y monitorea", description: "Define responsables y plazos con alertas automáticas." },
  { icon: CheckCircle2, title: "Verifica el cumplimiento", description: "Confirma evidencias y mide el avance real." },
];

function AuthPage() {
  const navigate = useNavigate();
  const { demo } = Route.useSearch();
  const [email, setEmail] = useState(demo ? DEMO_CREDENTIALS.email : "");
  const [password, setPassword] = useState(demo ? DEMO_CREDENTIALS.password : "");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (error) return toast.error("No se pudo iniciar sesión", { description: error.message });
    toast.success("Bienvenido a ComprometIA");
    navigate({ to: "/dashboard", replace: true });
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) return toast.error("No se pudo registrar", { description: error.message });
    toast.success("Cuenta creada", { description: "Ya puedes iniciar sesión." });
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Volver al inicio
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Panel informativo */}
          <section className="order-2 lg:order-1 lg:pt-2">
            <div className="mb-6 inline-flex items-center gap-3">
              <LogoIso size="xl" />
              <span className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                <span className="text-accent">Compromet</span>
                <span className="text-primary">IA</span>
              </span>
            </div>

            <h1 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              Gestión inteligente de acuerdos institucionales
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Plataforma potenciada con inteligencia artificial para registrar, dar seguimiento
              y garantizar el cumplimiento de cada compromiso de tus reuniones.
            </p>

            {/* Estadísticas */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <Card key={s.label} className="border bg-card/70 p-3 text-center backdrop-blur-sm sm:p-4">
                  <div className="font-display text-xl font-extrabold text-primary sm:text-2xl">{s.value}</div>
                  <div className="mt-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">{s.label}</div>
                </Card>
              ))}
            </div>

            {/* Beneficios */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <BenefitCard key={b.title} {...b} />
              ))}
            </div>

            {/* Pasos del proceso */}
            <div className="mt-6">
              <h2 className="mb-3 font-display text-sm font-semibold text-foreground">Cómo funciona</h2>
              <ol className="space-y-3">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <step.icon className="size-3.5 text-accent" />
                        <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Formulario */}
          <section className="order-1 w-full lg:order-2 lg:sticky lg:top-12">
            <div className="mx-auto w-full max-w-md">
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Card className="p-6">
                    {demo && (
                      <div className="mb-4 flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 p-3">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                        <p className="text-xs leading-relaxed text-foreground">
                          <span className="font-semibold">Modo demo activado.</span> Usa las credenciales precargadas para ingresar como SuperAdmin.
                        </p>
                      </div>
                    )}
                    <h2 className="font-display text-xl font-bold">{demo ? "Acceso de demostración" : "Bienvenido de nuevo"}</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {demo ? "Las credenciales del rol SuperAdmin ya están cargadas." : "Ingresa con tu correo institucional."}
                    </p>
                    <form onSubmit={login} className="space-y-4">
                      <Field label="Correo" value={email} onChange={setEmail} type="email" placeholder="usuario@comprometia.com" />
                      <Field label="Contraseña" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
                      <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="size-4 animate-spin" />} {demo ? "Ingresar al demo" : "Iniciar sesión"}
                      </Button>
                    </form>
                  </Card>
                </TabsContent>


                <TabsContent value="register">
                  <Card className="p-6">
                    <h2 className="font-display text-xl font-bold">Crear cuenta</h2>
                    <p className="mb-4 text-sm text-muted-foreground">Regístrate con email y contraseña.</p>
                    <form onSubmit={register} className="space-y-4">
                      <Field label="Correo" value={email} onChange={setEmail} type="email" placeholder="usuario@comprometia.com" />
                      <Field label="Contraseña" value={password} onChange={setPassword} type="password" placeholder="Mínimo 6 caracteres" />
                      <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="size-4 animate-spin" />} Registrarse
                      </Button>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card className="mt-4 overflow-hidden bg-secondary/40">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="demo" className="border-none">
                    <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:no-underline">
                      Acceso de demostración
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="mb-2 text-xs text-muted-foreground">Contraseña: 123123aA</p>
                      <div className="grid gap-1.5">
                        {DEMO.map((d) => (
                          <button
                            key={d.email}
                            onClick={() => { setEmail(d.email); setPassword("123123aA"); }}
                            className="flex items-center justify-between rounded-md bg-card px-3 py-1.5 text-left text-xs transition-colors hover:bg-accent/20"
                          >
                            <span className="text-foreground">{d.email}</span>
                            <span className="font-medium text-accent-foreground">{d.rol}</span>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <Card className="flex flex-col items-start gap-3 border bg-card/80 p-4 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-card">
      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

function Field({ label, value, onChange, type, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type: string; placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} placeholder={placeholder} required onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
