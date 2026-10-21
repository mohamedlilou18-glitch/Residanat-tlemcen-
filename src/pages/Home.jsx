import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import SpecialtyRow from "@/components/SpecialtyRow";
import StatsHeader from "@/components/StatsHeader";

const TOTAL_POSTS = 182;

export default function Home() {
  const [specialties, setSpecialties] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const historyRef = useRef([]);
  const removalTimer = useRef(null);

  const pushHistory = (current) => {
    historyRef.current = [
      ...historyRef.current.slice(-19),
      (current || []).map((s) => ({ ...s, checked: [...(s.checked || [])] })),
    ];
    setCanUndo(true);
  };

  useEffect(() => {
    const load = async () => {
      const page = await base44.entities.Specialty.list({ sort: "order", limit: 200 });
      const items = (page.items || []).filter(
        (s) => (s.checked?.length || 0) < s.posts
      );
      setSpecialties(items);
    };
    load();
  }, []);

  const remainingPosts = useMemo(() => {
    if (!specialties) return 0;
    return specialties.reduce((sum, s) => sum + s.posts - (s.checked?.length || 0), 0);
  }, [specialties]);

  const handleToggle = async (specialty, index) => {
    const current = specialty.checked || [];
    const wasChecked = current.includes(index);
    const next = wasChecked
      ? current.filter((i) => i !== index)
      : [...current, index].sort((a, b) => a - b);
    const complete = next.length >= specialty.posts;

    if (removalTimer.current) {
      window.clearTimeout(removalTimer.current);
      removalTimer.current = null;
    }

    pushHistory(specialties);
    setSpecialties((prev) =>
      prev.map((s) => (s.id === specialty.id ? { ...s, checked: next } : s))
    );
    await base44.entities.Specialty.update(specialty.id, { checked: next });

    if (complete) {
      removalTimer.current = window.setTimeout(() => {
        setSpecialties((prev) => prev.filter((s) => s.id !== specialty.id));
        removalTimer.current = null;
      }, 600);
    }
  };

  const handleUndo = async () => {
    const previous = historyRef.current.pop();
    if (!previous) return;

    if (removalTimer.current) {
      window.clearTimeout(removalTimer.current);
      removalTimer.current = null;
    }

    setUndoing(true);
    setSpecialties(previous);
    setCanUndo(historyRef.current.length > 0);
    await base44.entities.Specialty.bulkUpdate(
      previous.map((s) => ({ id: s.id, checked: s.checked || [] }))
    );
    setUndoing(false);
  };

  const handleReset = async () => {
    if (!window.confirm("Réinitialiser toutes les cases cochées ?")) return;
    pushHistory(specialties);
    setResetting(true);
    const page = await base44.entities.Specialty.list({ sort: "order", limit: 200 });
    const items = page.items || [];
    await base44.entities.Specialty.bulkUpdate(
      items.map((s) => ({ id: s.id, checked: [] }))
    );
    setSpecialties(items.map((s) => ({ ...s, checked: [] })));
    setResetting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/[0.05] to-transparent" />

      <div className="relative">
        <StatsHeader
          specialties={specialties?.length ?? 0}
          remainingPosts={remainingPosts}
          totalPosts={TOTAL_POSTS}
          onReset={handleReset}
          resetting={resetting}
          onUndo={handleUndo}
          undoing={undoing}
          canUndo={canUndo}
        />

        <main className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-8">
          {specialties === null ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[86px] animate-pulse border-b border-border/70 bg-card last:border-b-0"
                />
              ))}
            </div>
          ) : specialties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card px-6 py-14 text-center"
            >
              <h2 className="font-display text-xl tracking-tight text-foreground">
                Toutes les spécialités sont complètes
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                Les 182 postes ont été cochés. Utilisez «&nbsp;Réinitialiser&nbsp;» pour recommencer.
              </p>
            </motion.div>
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(31,28,25,0.04)]">
              <AnimatePresence initial={false}>
                {specialties.map((specialty) => (
                  <SpecialtyRow
                    key={specialty.id}
                    specialty={specialty}
                    onToggle={(index) => handleToggle(specialty, index)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </main>

        <footer className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-8">
          <p className="border-t border-border pt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Annexe de l'arrêté interministériel · Faculté de Médecine de Tlemcen
          </p>
        </footer>
      </div>
    </div>
  );
}