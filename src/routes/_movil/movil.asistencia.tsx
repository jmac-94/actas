import { useRef, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ScanFace,
  PenLine,
  CheckCircle2,
  RotateCcw,
  Upload,
  Pencil,
} from "lucide-react";
import { MobileFrame } from "@/components/mobile-frame";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACTAS } from "@/lib/mock-data";
import { useProfile } from "@/lib/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_movil/movil/asistencia")({
  component: MovilAsistencia,
});

type FirmaModo = "dibujar" | "subir";

function SignaturePad({
  onSignedChange,
}: {
  onSignedChange: (signed: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modo, setModo] = useState<FirmaModo>("dibujar");
  const [hasDrawing, setHasDrawing] = useState(false);
  const [imagen, setImagen] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);

  const firmado = hasDrawing || !!imagen;

  useEffect(() => {
    onSignedChange(firmado);
  }, [firmado, onSignedChange]);

  // Set up canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || modo !== "dibujar") return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "hsl(217 91% 35%)";
    }
  }, [modo]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasDrawing) setHasDrawing(true);
  };

  const end = () => {
    drawing.current = false;
  };

  const limpiar = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawing(false);
    setImagen(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const subir = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagen(reader.result as string);
      setHasDrawing(false);
    };
    reader.readAsDataURL(file);
  };

  const cambiarModo = (m: FirmaModo) => {
    setModo(m);
    if (m === "subir") {
      fileRef.current?.click();
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-medium">Firma virtual</p>
        {firmado && (
          <Button size="sm" variant="ghost" onClick={limpiar}>
            <RotateCcw className="size-3.5" /> Borrar
          </Button>
        )}
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Puedes firmar manualmente o subir una imagen de tu firma.
      </p>

      {/* Área de firma */}
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-b from-card to-secondary/30">
        {imagen ? (
          <div className="flex h-40 items-center justify-center p-3">
            <img
              src={imagen}
              alt="Firma del asistente"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerLeave={end}
              className="h-40 w-full touch-none"
              style={{ cursor: "crosshair" }}
            />
            {!hasDrawing && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
                <PenLine className="size-5 text-muted-foreground/60" />
                <span className="text-xs text-muted-foreground/70">
                  Dibuja o sube tu firma
                </span>
              </div>
            )}
            {/* Línea de firma */}
            <div className="pointer-events-none absolute inset-x-6 bottom-6 border-b border-border" />
          </>
        )}
      </div>

      {/* Controles */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant={modo === "dibujar" && !imagen ? "default" : "outline"}
          onClick={() => {
            setImagen(null);
            cambiarModo("dibujar");
          }}
        >
          <Pencil className="size-3.5" /> Dibujar firma
        </Button>
        <Button
          size="sm"
          variant={imagen ? "default" : "outline"}
          onClick={() => cambiarModo("subir")}
        >
          <Upload className="size-3.5" /> Subir firma
        </Button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={subir}
      />
    </Card>
  );
}

function MovilAsistencia() {
  const { data: profile } = useProfile();
  const acta = ACTAS[0];
  const [nombre, setNombre] = useState("");
  const [facial, setFacial] = useState<"idle" | "scanning" | "ok">("idle");
  const [firma, setFirma] = useState(false);
  const [confirmado, setConfirmado] = useState<{
    nombre: string;
    hora: string;
  } | null>(null);

  useEffect(() => {
    if (profile?.nombre) setNombre((n) => n || profile.nombre);
  }, [profile?.nombre]);

  const escanear = () => {
    setFacial("scanning");
    setTimeout(() => setFacial("ok"), 1800);
  };

  const confirmar = () => {
    const hora = new Date().toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setConfirmado({ nombre: nombre || "Asistente", hora });
    toast.success("Asistencia confirmada", {
      description: "Tu asistencia fue registrada correctamente.",
    });
  };

  if (confirmado) {
    return (
      <MobileFrame title="Registro de asistencia">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="size-11 text-success" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">
              Asistencia registrada
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {confirmado.nombre} firmó su participación a las {confirmado.hora}
              .
            </p>
          </div>
          <Card className="w-full space-y-2 p-4 text-left text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Acta</span>
              <span className="font-medium">{acta.titulo}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Verificación facial</span>
              <span className="font-medium text-success">Verificada ✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Firma</span>
              <span className="font-medium text-success">Registrada ✓</span>
            </div>
          </Card>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setConfirmado(null);
              setFacial("idle");
              setFirma(false);
            }}
          >
            <RotateCcw className="size-4" /> Registrar otra asistencia
          </Button>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame title="Registro de asistencia">
      <Card className="space-y-3 p-4">
        <div className="space-y-1.5">
          <Label>Nombre del asistente</Label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="bg-card"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Acta asociada</Label>
          <Input readOnly value={acta.titulo} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label>Fecha y hora</Label>
          <Input
            readOnly
            value={`${acta.fecha} · ${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`}
            className="bg-secondary/50"
          />
        </div>
      </Card>

      <Card className="p-4">
        <p className="mb-2 text-sm font-medium">
          Reconocimiento facial (simulado)
        </p>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-accent/50 bg-accent/5 py-6">
          <ScanFace
            className={
              facial === "scanning"
                ? "size-12 animate-pulse text-accent-foreground"
                : facial === "ok"
                  ? "size-12 text-success"
                  : "size-12 text-muted-foreground"
            }
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {facial === "idle" && "Coloca tu rostro en el marco"}
            {facial === "scanning" && "Escaneando rostro…"}
            {facial === "ok" && "Rostro verificado ✓"}
          </p>
          {facial !== "ok" && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={escanear}
              disabled={facial === "scanning"}
            >
              {facial === "scanning" ? "Escaneando…" : "Escanear rostro"}
            </Button>
          )}
        </div>
      </Card>

      <SignaturePad onSignedChange={setFirma} />

      <Button
        variant="hero"
        className="w-full"
        disabled={facial !== "ok" || !firma || !nombre.trim()}
        onClick={confirmar}
      >
        <CheckCircle2 className="size-4" /> Confirmar asistencia
      </Button>
    </MobileFrame>
  );
}
