import isoAsset from "@/assets/comprometia-iso.png.asset.json";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Tamaño del isotipo (alto/ancho en px equivalentes vía clases) */
  size?: "sm" | "md" | "lg" | "xl";
  /** Mostrar el wordmark "ComprometIA" junto al isotipo */
  showWordmark?: boolean;
  /** Mostrar subtítulo institucional bajo el wordmark */
  subtitle?: boolean | string;
  /** Variante de color del wordmark según el fondo */
  variant?: "light" | "dark";
  className?: string;
}

const ISO_SIZE: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
};

const WORD_SIZE: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
};

export function LogoIso({ size = "md", className }: { size?: LogoProps["size"]; className?: string }) {
  return (
    <img
      src={isoAsset.url}
      alt="ComprometIA"
      className={cn(ISO_SIZE[size ?? "md"], "shrink-0 object-contain", className)}
    />
  );
}

export function Logo({
  size = "md",
  showWordmark = true,
  subtitle = false,
  variant = "light",
  className,
}: LogoProps) {
  const comprometClass = variant === "dark" ? "text-sidebar-primary" : "text-accent";
  const iaClass = variant === "dark" ? "text-sidebar-foreground" : "text-primary";
  const subClass = variant === "dark" ? "text-sidebar-foreground/70" : "text-muted-foreground";
  const subText =
    typeof subtitle === "string" ? subtitle : "Gestión inteligente de actas y compromisos";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoIso size={size} />
      {showWordmark && (
        <span className="leading-tight">
          <span className={cn("block font-display font-extrabold", WORD_SIZE[size ?? "md"])}>
            <span className={comprometClass}>Compromet</span>
            <span className={iaClass}>IA</span>
          </span>
          {subtitle && <span className={cn("block text-[11px]", subClass)}>{subText}</span>}
        </span>
      )}
    </span>
  );
}
