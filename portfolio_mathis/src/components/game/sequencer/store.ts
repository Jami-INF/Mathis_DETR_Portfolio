import { signal } from "@preact/signals";

export const TRACKS = [
  { id: "kick", label: "Kick", color: "#ff8ac4" },
  { id: "snare", label: "Snare", color: "#c58bff" },
  { id: "hat", label: "Hat", color: "#ff9f6b" },
  { id: "ohat", label: "O.Hat", color: "#ffd166" },
  { id: "bass", label: "Bass", color: "#7ee8b2" },
] as const;
export const STEPS = 16;

// Presets : 1 chaîne de 16 caractères par piste ("x" = actif).
const P = (s: string) => [...s].map((c) => c === "x");
export const PRESETS: Record<string, { tip: string; rows: boolean[][] }> = {
  House: {
    tip: "Kick sur chaque temps, hat en contretemps.",
    rows: [
      P("x...x...x...x..."),
      P("....x.......x..."),
      P("x.x.x.x.x.x.x.x."),
      P("..x...x...x...x."),
      P("x.....x...x....."),
    ],
  },
  "Boom bap": {
    tip: "Kick syncopé, snare sur les temps 2 et 4.",
    rows: [
      P("x..x......x.x..."),
      P("....x.......x..."),
      P("x.x.x.x.x.x.x.x."),
      P("................"),
      P("x.........x....."),
    ],
  },
  Techno: {
    tip: "Quatre kicks au sol, tout le reste en tension.",
    rows: [
      P("x...x...x...x..."),
      P("................"),
      P("..x...x...x...x."),
      P("......x.......x."),
      P("x...x...x...x.x."),
    ],
  },
};

export const pattern = signal<boolean[][]>(
  PRESETS["House"].rows.map((r) => [...r])
);
export const bpm = signal(120);
export const isPlaying = signal(false);
export const currentStep = signal(-1);

export function toggleStep(row: number, col: number) {
  const p = pattern.value.map((r) => [...r]);
  p[row][col] = !p[row][col];
  pattern.value = p;
}
export function loadPreset(name: string) {
  pattern.value = PRESETS[name].rows.map((r) => [...r]);
}
export function clearPattern() {
  pattern.value = TRACKS.map(() => Array(STEPS).fill(false));
}
// Random « musical » : pondéré vers les emplacements idiomatiques.
export function randomize() {
  const w = [
    [0.9, 0.05, 0.1, 0.2, 0.6, 0.05, 0.1, 0.25, 0.8, 0.05, 0.15, 0.2, 0.6, 0.1, 0.1, 0.3],
    [0, 0, 0.05, 0.05, 0.9, 0.05, 0.05, 0.1, 0.05, 0.05, 0.05, 0.1, 0.9, 0.05, 0.1, 0.15],
    Array(16).fill(0.55),
    [0, 0, 0.4, 0, 0, 0, 0.4, 0, 0, 0, 0.4, 0, 0, 0, 0.4, 0.1],
    [0.7, 0, 0.1, 0.2, 0.1, 0, 0.3, 0.1, 0.2, 0, 0.3, 0.1, 0.1, 0, 0.2, 0.1],
  ];
  pattern.value = w.map((row) => row.map((p) => Math.random() < p));
}
