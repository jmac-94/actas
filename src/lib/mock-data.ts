// Datos de ejemplo y tipos para ComprometIA

export type EstadoAcuerdo = "Pendiente" | "En proceso" | "Cumplido" | "Vencido";
export type Semaforo = "verde" | "amarillo" | "rojo";

export const AREAS = ["Calidad", "Acreditación", "Evaluación", "Administración", "Comunicación"] as const;
export type Area = (typeof AREAS)[number];

export const RESPONSABLES = ["Ana Torres", "Luis Ramírez", "Camila Flores", "Diego Herrera", "Mariana Soto"];

export interface Evidencia {
  id: string;
  nombre: string;
  tipo: "PDF" | "Word" | "Excel" | "Imagen" | "Video" | "URL" | "Acta escaneada";
  fecha: string;
  usuario: string;
  acuerdo: string;
}

export interface Acuerdo {
  id: string;
  descripcion: string;
  responsable: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoAcuerdo;
  avance: number;
  evidencias: Evidencia[];
}

export interface Acta {
  id: string;
  titulo: string;
  fecha: string;
  area: Area;
  convocador: string;
  tipo: "Interna" | "Externa";
  proceso: "Estratégico" | "Operativo" | "Soporte";
  estado: "Abierta" | "En seguimiento" | "Cerrada";
  acuerdos: Acuerdo[];
}

export function semaforoDeEstado(estado: EstadoAcuerdo): Semaforo {
  if (estado === "Cumplido") return "verde";
  if (estado === "Vencido") return "rojo";
  return "amarillo";
}

export function avanceActa(acta: Acta): number {
  if (acta.acuerdos.length === 0) return 0;
  return Math.round(acta.acuerdos.reduce((s, a) => s + a.avance, 0) / acta.acuerdos.length);
}

const ev = (id: string, nombre: string, tipo: Evidencia["tipo"], usuario: string, acuerdo: string, fecha: string): Evidencia => ({
  id, nombre, tipo, usuario, acuerdo, fecha,
});

export const ACTAS: Acta[] = [
  {
    id: "ACT-001",
    titulo: "Acta de reunión de Calidad Académica",
    fecha: "2026-05-12",
    area: "Calidad",
    convocador: "Ana Torres",
    tipo: "Interna",
    proceso: "Estratégico",
    estado: "En seguimiento",
    acuerdos: [
      {
        id: "AC-101", descripcion: "Actualizar matriz de seguimiento de calidad", responsable: "Ana Torres",
        fechaInicio: "2026-05-13", fechaFin: "2026-06-30", estado: "En proceso", avance: 60,
        evidencias: [ev("E1", "matriz_calidad_v2.xlsx", "Excel", "Ana Torres", "AC-101", "2026-05-20")],
      },
      {
        id: "AC-102", descripcion: "Enviar reporte final de cumplimiento", responsable: "Luis Ramírez",
        fechaInicio: "2026-05-13", fechaFin: "2026-06-10", estado: "Cumplido", avance: 100,
        evidencias: [ev("E2", "reporte_cumplimiento.pdf", "PDF", "Luis Ramírez", "AC-102", "2026-06-08")],
      },
      {
        id: "AC-103", descripcion: "Revisar compromisos pendientes del área", responsable: "Camila Flores",
        fechaInicio: "2026-05-13", fechaFin: "2026-05-30", estado: "Vencido", avance: 25,
        evidencias: [],
      },
    ],
  },
  {
    id: "ACT-002",
    titulo: "Acta de coordinación de Acreditación",
    fecha: "2026-05-18",
    area: "Acreditación",
    convocador: "Luis Ramírez",
    tipo: "Interna",
    proceso: "Operativo",
    estado: "En seguimiento",
    acuerdos: [
      {
        id: "AC-201", descripcion: "Subir evidencia del informe de acreditación", responsable: "Luis Ramírez",
        fechaInicio: "2026-05-19", fechaFin: "2026-07-05", estado: "En proceso", avance: 45,
        evidencias: [ev("E3", "informe_acreditacion.docx", "Word", "Luis Ramírez", "AC-201", "2026-06-01")],
      },
      {
        id: "AC-202", descripcion: "Validar asistencia de participantes", responsable: "Mariana Soto",
        fechaInicio: "2026-05-19", fechaFin: "2026-06-15", estado: "Pendiente", avance: 0,
        evidencias: [],
      },
    ],
  },
  {
    id: "ACT-003",
    titulo: "Acta de seguimiento de Evaluación Docente",
    fecha: "2026-05-22",
    area: "Evaluación",
    convocador: "Camila Flores",
    tipo: "Interna",
    proceso: "Operativo",
    estado: "Abierta",
    acuerdos: [
      {
        id: "AC-301", descripcion: "Actualizar matriz de seguimiento docente", responsable: "Camila Flores",
        fechaInicio: "2026-05-23", fechaFin: "2026-06-28", estado: "En proceso", avance: 70,
        evidencias: [ev("E4", "fotos_reunion.jpg", "Imagen", "Camila Flores", "AC-301", "2026-05-23")],
      },
      {
        id: "AC-302", descripcion: "Revisar compromisos pendientes del área", responsable: "Diego Herrera",
        fechaInicio: "2026-05-23", fechaFin: "2026-06-20", estado: "Cumplido", avance: 100,
        evidencias: [ev("E5", "acta_docente_escaneada.pdf", "Acta escaneada", "Diego Herrera", "AC-302", "2026-06-18")],
      },
    ],
  },
  {
    id: "ACT-004",
    titulo: "Acta de reunión administrativa",
    fecha: "2026-05-28",
    area: "Administración",
    convocador: "Diego Herrera",
    tipo: "Interna",
    proceso: "Soporte",
    estado: "En seguimiento",
    acuerdos: [
      {
        id: "AC-401", descripcion: "Enviar reporte final de cumplimiento", responsable: "Diego Herrera",
        fechaInicio: "2026-05-29", fechaFin: "2026-06-12", estado: "Vencido", avance: 40,
        evidencias: [],
      },
      {
        id: "AC-402", descripcion: "Actualizar matriz de seguimiento", responsable: "Mariana Soto",
        fechaInicio: "2026-05-29", fechaFin: "2026-07-10", estado: "En proceso", avance: 55,
        evidencias: [ev("E6", "grabacion_reunion", "URL", "Mariana Soto", "AC-402", "2026-05-29")],
      },
    ],
  },
  {
    id: "ACT-005",
    titulo: "Acta de comité de comunicación institucional",
    fecha: "2026-06-02",
    area: "Comunicación",
    convocador: "Mariana Soto",
    tipo: "Externa",
    proceso: "Estratégico",
    estado: "Abierta",
    acuerdos: [
      {
        id: "AC-501", descripcion: "Validar asistencia de participantes", responsable: "Mariana Soto",
        fechaInicio: "2026-06-03", fechaFin: "2026-06-25", estado: "Pendiente", avance: 10,
        evidencias: [],
      },
      {
        id: "AC-502", descripcion: "Subir evidencia del informe de acreditación", responsable: "Ana Torres",
        fechaInicio: "2026-06-03", fechaFin: "2026-07-15", estado: "En proceso", avance: 35,
        evidencias: [ev("E7", "video_comite.mp4", "Video", "Ana Torres", "AC-502", "2026-06-03")],
      },
    ],
  },
];

export const TODOS_ACUERDOS = ACTAS.flatMap((a) =>
  a.acuerdos.map((ac) => ({ ...ac, actaId: a.id, actaTitulo: a.titulo, area: a.area })),
);

export const TODAS_EVIDENCIAS = ACTAS.flatMap((a) =>
  a.acuerdos.flatMap((ac) => ac.evidencias.map((e) => ({ ...e, area: a.area, actaTitulo: a.titulo }))),
);

export interface AsistenciaArea {
  area: Area;
  estado: "Asisten" | "Cumplen parcialmente" | "No cumplen";
  asistentes: number;
  inasistentes: number;
  evidenciaNoAsistencia: boolean;
  semaforo: Semaforo;
}

export const ASISTENCIA_AREAS: AsistenciaArea[] = [
  { area: "Calidad", estado: "Asisten", asistentes: 12, inasistentes: 0, evidenciaNoAsistencia: false, semaforo: "verde" },
  { area: "Acreditación", estado: "Cumplen parcialmente", asistentes: 8, inasistentes: 3, evidenciaNoAsistencia: true, semaforo: "amarillo" },
  { area: "Evaluación", estado: "Asisten", asistentes: 10, inasistentes: 1, evidenciaNoAsistencia: false, semaforo: "verde" },
  { area: "Administración", estado: "No cumplen", asistentes: 4, inasistentes: 7, evidenciaNoAsistencia: false, semaforo: "rojo" },
  { area: "Comunicación", estado: "Cumplen parcialmente", asistentes: 6, inasistentes: 4, evidenciaNoAsistencia: true, semaforo: "amarillo" },
];

// Resumen por área para dashboard
export function resumenPorArea() {
  return AREAS.map((area) => {
    const actas = ACTAS.filter((a) => a.area === area);
    const acuerdos = actas.flatMap((a) => a.acuerdos);
    const cumplidos = acuerdos.filter((a) => a.estado === "Cumplido").length;
    const pendientes = acuerdos.filter((a) => a.estado === "Pendiente" || a.estado === "En proceso").length;
    const vencidos = acuerdos.filter((a) => a.estado === "Vencido").length;
    const total = acuerdos.length || 1;
    const pct = Math.round((cumplidos / total) * 100);
    const semaforo: Semaforo = pct >= 70 ? "verde" : pct >= 40 ? "amarillo" : "rojo";
    return { area, actas: actas.length, cumplidos, pendientes, vencidos, pct, semaforo };
  });
}

export function metricasGenerales() {
  const acuerdos = ACTAS.flatMap((a) => a.acuerdos);
  const cumplidos = acuerdos.filter((a) => a.estado === "Cumplido").length;
  const enProceso = acuerdos.filter((a) => a.estado === "En proceso" || a.estado === "Pendiente").length;
  const vencidos = acuerdos.filter((a) => a.estado === "Vencido").length;
  const avance = Math.round(acuerdos.reduce((s, a) => s + a.avance, 0) / (acuerdos.length || 1));
  return {
    totalActas: ACTAS.length,
    totalAcuerdos: acuerdos.length,
    cumplidos,
    enProceso,
    vencidos,
    avance,
  };
}
