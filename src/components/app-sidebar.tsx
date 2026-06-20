import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, FilePlus2, FileText, ListChecks, Paperclip, UserX,
  QrCode, ScanFace, TrafficCone, CalendarRange,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LogoIso } from "@/components/logo";
import type { AppRole } from "@/lib/use-auth";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AppRole[];
}

const WEB: NavItem[] = [
  { title: "Dashboard general", url: "/dashboard", icon: LayoutDashboard },
  { title: "Usuarios y roles", url: "/usuarios", icon: Users, roles: ["superadmin"] },
  { title: "Crear acta", url: "/crear-acta", icon: FilePlus2, roles: ["superadmin", "convocador"] },
  { title: "Actas y acuerdos", url: "/actas", icon: FileText },
  { title: "Seguimiento", url: "/seguimiento", icon: ListChecks },
  { title: "Evidencias", url: "/evidencias", icon: Paperclip, roles: ["superadmin", "admin", "convocador"] },
  { title: "Inasistentes por área", url: "/inasistentes", icon: UserX, roles: ["superadmin", "admin"] },
];

const MOBILE: NavItem[] = [
  { title: "QR del acta", url: "/movil/qr", icon: QrCode },
  { title: "Registro de asistencia", url: "/movil/asistencia", icon: ScanFace },
  { title: "Semáforo de áreas", url: "/movil/semaforo", icon: TrafficCone },
  { title: "Calendario de seguimiento", url: "/movil/calendario", icon: CalendarRange },
];

export function AppSidebar({ role }: { role: AppRole }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visible = (items: NavItem[]) => items.filter((i) => !i.roles || i.roles.includes(role));

  const renderGroup = (label: string, items: NavItem[]) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {visible(items).map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <LogoIso size="md" className="rounded-lg bg-sidebar-foreground/5 p-0.5" />
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <p className="font-display text-base font-bold"><span className="text-sidebar-primary">Compromet</span><span className="text-sidebar-foreground">IA</span></p>
            <p className="text-xs text-sidebar-foreground/70">Actas y compromisos inteligentes</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Web / Intranet", WEB)}
        {renderGroup("Vista móvil", MOBILE)}
      </SidebarContent>
    </Sidebar>
  );
}
