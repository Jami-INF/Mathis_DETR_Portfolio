// Moteur audio du séquenceur — chargé dynamiquement au premier Play.
// Une Tone.Sequence en "16n" lit le pattern via getter (édition à chaud),
// les voix reçoivent le `time` du scheduler (sample-accurate), et la
// synchro du playhead passe par Tone.Draw (calée sur l'horloge audio).
import * as Tone from "tone";

type Voice = (time: number) => void;
let voices: Voice[] = [];
let seq: Tone.Sequence<number> | null = null;
let meter: Tone.Meter | null = null;

// Niveau sonore global lissé (0..1) — lu par la visualisation en rAF.
export function getLevel(): number {
  if (!meter) return 0;
  const v = meter.getValue();
  return typeof v === "number" ? Math.max(0, Math.min(1, v * 2.2)) : 0;
}

export async function unlock() {
  await Tone.start();
}

function buildVoices(): Voice[] {
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.04,
    octaves: 6,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0 },
  }).toDestination();
  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.18, sustain: 0 },
  }).toDestination();
  snare.volume.value = -8;
  const hatFilter = new Tone.Filter(8000, "highpass").toDestination();
  const hat = new Tone.NoiseSynth({
    envelope: { attack: 0.001, decay: 0.04, sustain: 0 },
  }).connect(hatFilter);
  hat.volume.value = -12;
  const ohat = new Tone.NoiseSynth({
    envelope: { attack: 0.001, decay: 0.3, sustain: 0 },
  }).connect(hatFilter);
  ohat.volume.value = -14;
  // Basse « sub » : sinus à l'octave grave + filtre très bas → beaucoup
  // plus de basses fréquences qu'une dent de scie filtrée.
  const bass = new Tone.MonoSynth({
    oscillator: { type: "sine" },
    filter: { type: "lowpass", Q: 1 },
    envelope: { attack: 0.005, decay: 0.4, sustain: 0.3, release: 0.1 },
    filterEnvelope: { attack: 0.005, decay: 0.2, sustain: 0.4, baseFrequency: 55, octaves: 1.5 },
  }).toDestination();
  bass.volume.value = 0;

  return [
    (t) => kick.triggerAttackRelease("C1", "8n", t),
    (t) => snare.triggerAttackRelease("16n", t),
    (t) => hat.triggerAttackRelease("32n", t),
    (t) => ohat.triggerAttackRelease("8n", t),
    (t) => bass.triggerAttackRelease("C1", "8n", t),
  ];
}

export function init(
  getPattern: () => boolean[][],
  onStep: (step: number) => void
) {
  if (seq) return;
  voices = buildVoices();
  // Enveloppe globale : un Meter branché sur la sortie mesure le volume
  // instantané ; smoothing = décroissance douce entre deux frappes.
  meter = new Tone.Meter({ smoothing: 0.85, normalRange: true });
  Tone.getDestination().connect(meter);
  seq = new Tone.Sequence(
    (time, step) => {
      const p = getPattern();
      voices.forEach((v, row) => {
        if (p[row]?.[step]) v(time);
      });
      Tone.getDraw().schedule(() => onStep(step), time);
    },
    [...Array(16).keys()],
    "16n"
  ).start(0);

  // Pause si l'onglet passe en arrière-plan (batterie mobile).
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
}

export function play(bpmValue: number) {
  Tone.getTransport().bpm.value = bpmValue;
  Tone.getTransport().start();
}
export function pause() {
  Tone.getTransport().pause();
}
export function setBpm(v: number) {
  Tone.getTransport().bpm.value = v;
}
