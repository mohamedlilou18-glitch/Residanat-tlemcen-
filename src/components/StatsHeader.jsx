import React from "react";
import { RotateCcw, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Stat({ label, value, accent }) {
  return (
    <div className="flex flex-col">
      <span
        className={cn(
          "font-display text-[26px] leading-none tabular-nums tracking-tight",
          accent ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </span>
      <span className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
    </div>
  );
}

export default function StatsHeader({
  specialties,
  remainingPosts,
  totalPosts,
  onReset,
  resetting,
  onUndo,
  undoing,
  canUndo,
}) {
  const checked = totalPosts - remainingPosts;
  const percent = totalPosts ? Math.round((checked / totalPosts) * 100) : 0;

  return (
    <header className="mx-auto w-full max-w-3xl px-4 pb-6 pt-9 sm:px-8 sm:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Résidanat · 2026 – 2027
          </p>
          <h1 className="mt-2 font-display text-[28px] leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Spécialités &amp; postes
          </h1>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            Faculté de Médecine de l'Université de Tlemcen. Cochez un poste au fur et à mesure des
            attributions&nbsp;: dès que toutes les cases d'une spécialité sont cochées, elle disparaît
            de la liste.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button
            onClick={onUndo}
            disabled={!canUndo || undoing || resetting}
            title="Annuler la dernière action"
            className="h-10 flex-1 rounded-full border border-primary bg-primary text-[12.5px] font-medium text-primary-foreground shadow-[0_4px_14px_-8px_hsl(var(--primary)/0.9)] transition-colors hover:bg-primary/90 disabled:border-primary/20 disabled:bg-primary/[0.08] disabled:text-primary/45 disabled:shadow-none sm:h-8 sm:flex-none"
          >
            <Undo2 className={cn("mr-1.5 h-4 w-4 sm:h-3.5 sm:w-3.5", undoing && "animate-pulse")} />
            Annuler
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            disabled={resetting || checked === 0}
            className="h-10 flex-1 rounded-full border-border bg-card/70 text-[12.5px] text-muted-foreground hover:text-foreground sm:h-8 sm:flex-none sm:text-[12px]"
          >
            <RotateCcw className={cn("mr-1.5 h-4 w-4 sm:h-3.5 sm:w-3.5", resetting && "animate-spin")} />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-5">
        <Stat label="Spécialités restantes" value={specialties} />
        <Stat label="Postes restants" value={remainingPosts} accent />
        <Stat label={`Postes cochés · ${percent}%`} value={checked} />
        <Stat label="Postes au total" value={totalPosts} />
      </div>
    </header>
  );
}