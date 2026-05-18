import logo from "@/assets/cutly-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  subtitle?: string;
}

export function Logo({ className, showWordmark = true, size = 32, subtitle }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logo}
        alt="Cutly AI"
        width={size}
        height={size}
        className="rounded-lg shrink-0"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
      {showWordmark && (
        <div className="leading-tight">
          <div className="font-display font-bold text-foreground">
            Cutly <span className="text-gold">AI</span>
          </div>
          {subtitle && (
            <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
