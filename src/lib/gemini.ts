import {
  ACTAS,
  USUARIOS,
  resumenAsistenciaPorArea,
  metricasGenerales,
  inasistentesDeActa,
} from "@/lib/mock-data";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as
  | string
  | undefined;
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

function buildAppContext(): string {
  const metricas = metricasGenerales();
  const asistencia = resumenAsistenciaPorArea();

  const actas = ACTAS.map((acta) => ({
    id: acta.id,
    titulo: acta.titulo,
    area: acta.area,
    fecha: acta.fecha,
    convocador: acta.convocador,
    tipo: acta.tipo,
    proceso: acta.proceso,
    estado: acta.estado,
    acuerdos: acta.acuerdos.map((ac) => ({
      id: ac.id,
      descripcion: ac.descripcion,
      responsable: ac.responsable,
      fechaInicio: ac.fechaInicio,
      fechaFin: ac.fechaFin,
      estado: ac.estado,
      avance: ac.avance,
      evidencias: ac.evidencias.map((e) => e.nombre),
    })),
    inasistentes: inasistentesDeActa(acta).map((p) => p.nombre),
    totalParticipantes: acta.participantes.length,
  }));

  const usuarios = USUARIOS.map((u) => ({
    nombre: u.nombre,
    email: u.email,
    area: u.area,
    rol: u.role,
    estado: u.estado,
  }));

  return `Eres el asistente virtual de ComprometIA, una plataforma de gestión de actas y acuerdos institucionales. Responde SIEMPRE en español, de forma breve y concreta, usando exclusivamente los datos reales de la plataforma que te paso abajo en JSON. Si te preguntan algo que no está en estos datos, dilo claramente en vez de inventar.

MÉTRICAS GENERALES:
${JSON.stringify(metricas)}

ASISTENCIA POR ÁREA (derivada de los participantes reales de cada acta):
${JSON.stringify(asistencia)}

ACTAS, ACUERDOS, EVIDENCIAS E INASISTENTES:
${JSON.stringify(actas)}

USUARIOS DE LA PLATAFORMA:
${JSON.stringify(usuarios)}`;
}

export async function askGemini(history: ChatMessage[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Falta configurar VITE_GEMINI_API_KEY en las variables de entorno.",
    );
  }

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildAppContext() }] },
      contents: history.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Error de Gemini (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini no devolvió una respuesta.");
  return text;
}
