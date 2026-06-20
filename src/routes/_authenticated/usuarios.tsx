import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserCog, CalendarPlus, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROLE_LABEL } from "@/lib/use-auth";
import { USUARIOS } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/usuarios")({
  component: Usuarios,
});

const ROLES = [
  {
    key: "superadmin" as const,
    icon: ShieldCheck,
    perfil: "Jefe del área de calidad",
    funciones: [
      "Revisar todas las actas registradas",
      "Visualizar el dashboard general",
      "Ver indicadores de cumplimiento por área",
      "Acceder a evidencias, acuerdos, inasistentes y reportes",
    ],
  },
  {
    key: "admin" as const,
    icon: UserCog,
    perfil: "Responsable de área",
    funciones: [
      "Revisar solo las actas de su área",
      "Ver acuerdos asignados a su área",
      "Subir evidencias de cumplimiento",
      "Revisar inasistentes de su área",
    ],
  },
  {
    key: "convocador" as const,
    icon: CalendarPlus,
    perfil: "Persona que crea y gestiona el acta",
    funciones: [
      "Crear nueva acta",
      "Registrar agenda, acuerdos y responsables",
      "Asociar asistentes",
      "Subir evidencias y ver avance del acta",
    ],
  },
  {
    key: "asistente" as const,
    icon: UserCheck,
    perfil: "Miembro de la comunidad académica",
    funciones: [
      "Ver el acta a la que fue invitado",
      "Confirmar asistencia mediante QR o firma virtual",
      "Revisar acuerdos donde participa",
      "Consultar su calendario personal de seguimiento",
    ],
  },
];

const roleBadge: Record<
  string,
  "default" | "accent" | "warning" | "secondary"
> = {
  superadmin: "default",
  admin: "accent",
  convocador: "warning",
  asistente: "secondary",
};

function Usuarios() {
  return (
    <div>
      <PageHeader
        title="Gestión de usuarios y roles"
        description="Perfiles y permisos de la plataforma institucional."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((r) => (
          <Card key={r.key} className="flex flex-col p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <r.icon className="size-5" />
              </div>
              <div>
                <p className="font-display font-semibold">
                  {ROLE_LABEL[r.key]}
                </p>
                <p className="text-xs text-muted-foreground">{r.perfil}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {r.funciones.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent-foreground">•</span> {f}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h3 className="mb-4 font-display text-lg font-semibold">
          Usuarios registrados
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USUARIOS.map((u) => (
                <TableRow key={u.email}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-secondary text-xs text-primary">
                          {u.nombre
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.nombre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>{u.area}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadge[u.role]}>
                      {ROLE_LABEL[u.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">{u.estado}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
