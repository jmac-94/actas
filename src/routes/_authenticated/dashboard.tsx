import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from "recharts";
import { FileText, ListChecks, CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SemaforoDot } from "@/components/status";
import { metricasGenerales, resumenPorArea, AREAS, RESPONSABLES } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const CHART = {
  primary: "oklch(0.42 0.16 258)",
  accent: "oklch(0.74 0.13 232)",
  success: "oklch(0.62 0.16 150)",
  warning: "oklch(0.84 0.16 90)",
  destructive: "oklch(0.62 0.22 25)",
};

function Dashboard() {
  const m = metricasGenerales();
  const resumen = resumenPorArea();
  const [, setArea] = useState("todas");

  const pieData = [
    { name: "Avance", value: m.avance, fill: CHART.success },
    { name: "Restante", value: 100 - m.avance, fill: "oklch(0.90 0.025 232)" },
  ];
  const barData = [
    { estado: "Cumplidos", total: m.cumplidos, fill: CHART.success },
    { estado: "En proceso", total: m.enProceso, fill: CHART.accent },
    { estado: "Vencidos", total: m.vencidos, fill: CHART.destructive },
  ];

  const stats = [
    { label: "Actas registradas", value: m.totalActas, icon: FileText, color: "text-primary" },
    { label: "Total de acuerdos", value: m.totalAcuerdos, icon: ListChecks, color: "text-accent-foreground" },
    { label: "Acuerdos cumplidos", value: m.cumplidos, icon: CheckCircle2, color: "text-success" },
    { label: "Acuerdos en proceso", value: m.enProceso, icon: Clock, color: "text-warning" },
    { label: "Acuerdos vencidos", value: m.vencidos, icon: AlertTriangle, color: "text-destructive" },
    { label: "Avance general", value: `${m.avance}%`, icon: TrendingUp, color: "text-accent-foreground" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard general"
        description="Indicadores de cumplimiento institucional en tiempo real."
        action={
          <div className="flex flex-wrap gap-2">
            <Filtro placeholder="Área" items={["todas", ...AREAS]} onChange={setArea} />
            <Filtro placeholder="Responsable" items={["todos", ...RESPONSABLES]} />
            <Filtro placeholder="Fecha" items={["Este mes", "Último trimestre", "Este año"]} />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <s.icon className={`size-5 ${s.color}`} />
            </div>
            <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">Avance general</h3>
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={100} startAngle={90} endAngle={-270}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold text-primary">{m.avance}%</span>
              <span className="text-xs text-muted-foreground">Cumplimiento</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">Acuerdos por estado</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.025 232)" vertical={false} />
                <XAxis dataKey="estado" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: "oklch(0.94 0.02 230)" }} />
                <Legend />
                <Bar dataKey="total" name="Acuerdos" radius={[6, 6, 0, 0]}>
                  {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h3 className="mb-4 font-display text-lg font-semibold">Resumen por área</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Área</TableHead>
                <TableHead className="text-center">Actas</TableHead>
                <TableHead className="text-center">Cumplidos</TableHead>
                <TableHead className="text-center">Pendientes</TableHead>
                <TableHead className="text-center">Vencidos</TableHead>
                <TableHead className="text-center">% Cumplimiento</TableHead>
                <TableHead className="text-center">Semáforo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumen.map((r) => (
                <TableRow key={r.area}>
                  <TableCell className="font-medium">{r.area}</TableCell>
                  <TableCell className="text-center">{r.actas}</TableCell>
                  <TableCell className="text-center text-success">{r.cumplidos}</TableCell>
                  <TableCell className="text-center text-warning">{r.pendientes}</TableCell>
                  <TableCell className="text-center text-destructive">{r.vencidos}</TableCell>
                  <TableCell className="text-center font-semibold">{r.pct}%</TableCell>
                  <TableCell><div className="flex justify-center"><SemaforoDot semaforo={r.semaforo} /></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function Filtro({ placeholder, items, onChange }: {
  placeholder: string; items: string[]; onChange?: (v: string) => void;
}) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[150px] bg-card">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((i) => <SelectItem key={i} value={i}>{i === "todas" || i === "todos" ? `Todas (${placeholder})` : i}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
