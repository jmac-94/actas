import { Link, useRouterState } from "@tanstack/react-router";
import { QrCode, ScanFace, TrafficCone, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoIso } from "@/components/logo";

const TABS = [
  { url: "/movil/qr", icon: QrCode, label: "QR" },
  { url: "/movil/asistencia", icon: ScanFace, label: "Asistencia" },
  { url: "/movil/semaforo", icon: TrafficCone, label: "Semáforo" },
  { url: "/movil/calendario", icon: CalendarRange, label: "Calendario" },
];

export function MobileFrame({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Vista móvil de ComprometIA — interfaz responsive para la comunidad académica.
      </p>
      <div className="w-full max-w-[390px] overflow-hidden rounded-[2.2rem] border-8 border-sidebar bg-background shadow-2xl">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-sidebar px-5 py-2 text-xs text-sidebar-foreground">
          <span>9:41</span>
          <span className="flex items-center gap-1.5 font-display font-semibold">
            <LogoIso size="sm" className="size-4" />
            <span><span className="text-sidebar-primary">Compromet</span><span className="text-sidebar-foreground">IA</span></span>
          </span>
          <span>100%</span>
        </div>
        {/* Header */}
        <div className="bg-primary px-5 py-4 text-primary-foreground">
          <h2 className="font-display text-lg font-bold">{title}</h2>
        </div>
        {/* Content */}
        <div className="min-h-[520px] space-y-4 p-4">{children}</div>
        {/* Bottom nav */}
        <nav className="grid grid-cols-4 border-t bg-card">
          {TABS.map((t) => {
            const active = pathname === t.url;
            return (
              <Link
                key={t.url}
                to={t.url}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <t.icon className={cn("size-5", active && "text-accent-foreground")} />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
