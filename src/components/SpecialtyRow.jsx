import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SpecialtyRow({ specialty, onToggle }) {
  const checked = specialty.checked || [];
  const remaining = specialty.posts - checked.length;

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="flex gap-3 overflow-hidden border-b border-border/70 px-3.5 py-2.5 last:border-b-0 hover:bg-secondary/30"
    >
      <span className="mt-0.5 w-5 shrink-0 text-[10px] font-semibold leading-4 tracking-wide text-muted-foreground tabular-nums">
        {specialty.number}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[14.5px] leading-[1.25] tracking-tight text-foreground">
          {specialty.name}
        </h3>

        {specialty.terrain && (
          <p className="mt-0.5 truncate text-[10.5px] leading-snug text-muted-foreground">
            {specialty.terrain}
          </p>
        )}

        <div className="mt-2 flex flex-wrap gap-1">
          {Array.from({ length: specialty.posts }).map((_, index) => {
            const isChecked = checked.includes(index);
            return (
              <button
                key={index}
                type="button"
                onClick={() => onToggle(index)}
                aria-pressed={isChecked}
                aria-label={`Poste ${index + 1} de ${specialty.name}`}
                className={cn(
                  "flex h-[26px] w-[26px] items-center justify-center rounded-md border text-[10px] font-semibold tabular-nums transition-all duration-200 active:scale-90",
                  isChecked
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_2px_8px_-4px_hsl(var(--primary)/0.9)]"
                    : "border-border bg-background/70 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                )}
              >
                {isChecked ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex w-9 shrink-0 flex-col items-center pt-0.5">
        <span className="font-display text-[15px] leading-none tabular-nums text-primary">
          {String(remaining).padStart(2, "0")}
        </span>
        <span className="mt-0.5 text-[7px] uppercase tracking-[0.14em] text-muted-foreground">
          postes
        </span>
      </div>
    </motion.li>
  );
}