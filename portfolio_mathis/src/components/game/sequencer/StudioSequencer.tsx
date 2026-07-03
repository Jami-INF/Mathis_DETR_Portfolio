// Île Preact du séquenceur (montée avec client:visible sur /studio).
// Tone.js n'est importé qu'au premier Play (dynamic import).
import { useEffect } from "preact/hooks";
import {
  TRACKS, STEPS, PRESETS, pattern, bpm, isPlaying, currentStep,
  toggleStep, loadPreset, clearPattern, randomize,
} from "./store";

let engine: typeof import("./engine") | null = null;

async function handlePlay() {
  if (!engine) {
    engine = await import("./engine");
    await engine.unlock();
    engine.init(() => pattern.value, (s) => (currentStep.value = s));
  }
  if (isPlaying.value) {
    engine.pause();
    isPlaying.value = false;
  } else {
    engine.play(bpm.value);
    isPlaying.value = true;
  }
}

function Cell({ row, col }: { row: number; col: number }) {
  const on = pattern.value[row][col];
  const hit = isPlaying.value && currentStep.value === col;
  const c = TRACKS[row].color;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`${TRACKS[row].label} pas ${col + 1}`}
      onPointerDown={(e) => { e.preventDefault(); toggleStep(row, col); }}
      class={`h-8 w-full rounded-md transition-transform duration-75 sm:h-9
        ${col % 4 === 0 ? "ring-1 ring-white/10" : ""}
        ${hit && on ? "scale-90" : ""}`}
      style={
        on
          ? `background:${c};box-shadow:0 0 ${hit ? 18 : 8}px ${c}66`
          : `background:${hit ? "#4a3b50" : col % 4 === 0 ? "#342a3a" : "#2c2331"}`
      }
    />
  );
}

export default function StudioSequencer() {
  // Resynchronise l'UI si le moteur se met en pause (onglet caché).
  useEffect(() => {
    const h = () => { if (document.hidden) isPlaying.value = false; };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);

  return (
    <div class="relative mx-auto w-full max-w-3xl rounded-[2rem] bg-[#201820] p-4 shadow-[10px_10px_0_#201820] ring-1 ring-black/40 sm:p-7">
      {/* Barre de transport */}
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePlay}
          class="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7a7f4] text-xl text-[#201820] shadow-[0_0_18px_#e7a7f466] transition hover:bg-[#f2bfdc]"
          aria-label={isPlaying.value ? "Pause" : "Lecture"}
        >
          {isPlaying.value ? "❚❚" : "▶"}
        </button>
        <label class="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/60">
          BPM
          <input
            type="range" min="80" max="160" value={bpm.value}
            onInput={(e) => {
              bpm.value = +(e.target as HTMLInputElement).value;
              engine?.setBpm(bpm.value);
            }}
            class="w-24 accent-[#e7a7f4] sm:w-32"
          />
          <span class="w-8 text-white/90">{bpm.value}</span>
        </label>
        <div class="ml-auto flex gap-2">
          <button type="button" onClick={randomize}
            class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-white/70 transition hover:bg-white/20">
            🎲
          </button>
          <button type="button" onClick={clearPattern}
            class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase text-white/70 transition hover:bg-white/20">
            Clear
          </button>
        </div>
      </div>

      {/* Presets */}
      <div class="mb-5 flex flex-wrap gap-2">
        {Object.keys(PRESETS).map((name) => (
          <button
            type="button" onClick={() => loadPreset(name)} title={PRESETS[name].tip}
            class="rounded-full bg-[#e7a7f4]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#e7a7f4] ring-1 ring-[#e7a7f4]/30 transition hover:bg-[#e7a7f4]/30"
          >
            {name}
          </button>
        ))}
      </div>

      {/* Repères de temps (1 2 3 4 sur les temps forts) */}
      <div class="mb-1 grid gap-1" style={`grid-template-columns:3.2rem repeat(${STEPS},1fr)`}>
        <span />
        {Array.from({ length: STEPS }, (_, i) => (
          <span class="text-center font-display text-[0.6rem] font-bold text-white/40">
            {i % 4 === 0 ? i / 4 + 1 : "·"}
          </span>
        ))}
      </div>

      {/* Grille */}
      <div class="space-y-1.5">
        {TRACKS.map((t, row) => (
          <div class="grid items-center gap-1" style={`grid-template-columns:3.2rem repeat(${STEPS},1fr)`}>
            <span class="truncate pr-1 font-display text-[0.6rem] font-bold uppercase tracking-wide sm:text-[0.65rem]" style={`color:${t.color}`}>
              {t.label}
            </span>
            {Array.from({ length: STEPS }, (_, col) => (
              <Cell row={row} col={col} />
            ))}
          </div>
        ))}
      </div>

      <p class="mt-4 text-center text-[0.7rem] text-white/40">
        Clique les cases pendant la lecture — la boucle se met à jour en direct. 🔊 Monte le son !
      </p>
    </div>
  );
}
