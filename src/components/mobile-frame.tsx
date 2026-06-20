import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  QrCode,
  ScanFace,
  CalendarRange,
  ArrowLeft,
  Wifi,
  SignalHigh,
  BatteryFull,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoIso } from "@/components/logo";

const TABS = [
  { url: "/movil/qr", icon: QrCode, label: "QR" },
  { url: "/movil/asistencia", icon: ScanFace, label: "Asistencia" },
  { url: "/movil/calendario", icon: CalendarRange, label: "Calendario" },
];

function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function MobileFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const time = useClock();

  return (
    <div className="flex h-screen flex-col items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--sidebar)_0%,_var(--background)_60%)] sm:h-auto sm:min-h-screen sm:justify-center sm:overflow-visible sm:py-8">
      {/* Phone shell: edge-to-edge + full-height on real phones, fixed-height framed mockup on wider screens */}
      <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden bg-background sm:m-auto sm:h-[844px] sm:max-h-[88vh] sm:w-[390px] sm:flex-none sm:rounded-[3rem] sm:border-[10px] sm:border-sidebar sm:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
        {/* Dynamic island */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden justify-center py-2 sm:flex">
          <div className="h-6 w-28 rounded-full bg-sidebar" />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between bg-sidebar px-6 pb-1.5 pt-3 text-xs font-medium text-sidebar-foreground sm:pt-2.5">
          <span className="tabular-nums">{time}</span>
          <span className="hidden items-center gap-1.5 font-display font-semibold sm:flex">
            <LogoIso size="sm" className="size-4" />
            <span>
              <span className="text-sidebar-primary">Compromet</span>
              <span className="text-sidebar-foreground">IA</span>
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <SignalHigh className="size-3.5" />
            <Wifi className="size-3.5" />
            <BatteryFull className="size-4" />
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 bg-primary px-5 py-4 text-primary-foreground">
          <Link
            to="/dashboard"
            className="-ml-1 flex size-8 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Salir de la vista móvil"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h2 className="font-display text-lg font-bold">{title}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 pb-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
          {children}
        </div>

        {/* Bottom nav */}
        <nav className="grid grid-cols-3 border-t bg-card pb-[env(safe-area-inset-bottom)]">
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
                <t.icon
                  className={cn("size-5", active && "text-accent-foreground")}
                />
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* Home indicator */}
        <div className="hidden justify-center bg-card pb-2 sm:flex">
          <div className="h-1 w-32 rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}
