import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogoIso } from "@/components/logo";
import { cn } from "@/lib/utils";
import { askGemini, type ChatMessage } from "@/lib/gemini";

const SALUDO =
  "Hola, soy el asistente de ComprometIA. Puedo responder preguntas sobre actas, acuerdos, evidencias, inasistencias y usuarios de la plataforma. ¿En qué te ayudo?";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", text: SALUDO },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || loading) return;

    const historial = [...messages, { role: "user" as const, text: texto }];
    setMessages(historial);
    setInput("");
    setLoading(true);

    try {
      const respuesta = await askGemini(historial);
      setMessages((m) => [...m, { role: "model", text: respuesta }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "model",
          text: `No pude responder: ${err instanceof Error ? err.message : "error desconocido"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <Card className="flex h-[480px] w-[360px] flex-col overflow-hidden p-0 shadow-2xl">
          <div className="flex items-center gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <LogoIso size="sm" className="size-6" />
            <div className="flex-1">
              <p className="font-display text-sm font-bold leading-tight">
                Asistente ComprometIA
              </p>
              <p className="text-[11px] text-primary-foreground/80">
                Potenciado con Gemini
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-3">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" /> Pensando…
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <form
            className="flex items-center gap-2 border-t bg-card p-3"
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre actas, asistencia…"
              disabled={loading}
              className="bg-background"
            />
            <Button
              type="submit"
              size="icon"
              variant="hero"
              disabled={loading || !input.trim()}
            >
              <Send className="size-4" />
            </Button>
          </form>
        </Card>
      )}

      <Button
        size="icon"
        variant="hero"
        className="size-14 rounded-full shadow-2xl"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir asistente"
      >
        {open ? (
          <X className="size-6" />
        ) : (
          <span className="relative">
            <Bot className="size-6" />
            <Sparkles className="absolute -right-1.5 -top-1.5 size-3.5 text-accent" />
          </span>
        )}
      </Button>
    </div>
  );
}
