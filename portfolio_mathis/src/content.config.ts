import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

// Schéma commun aux « fiches » (projets ET événements) : même structure.
// Le schéma valide la structure au build : si un champ obligatoire manque
// ou a le mauvais type, le build échoue avec un message clair.
const ficheSchema = z.object({
  ordre: z.number().optional().default(99),
  titre: z.string(),
  titre2: z.string().optional().default(""),
  role: z.string().optional(),
  description: z.string(),
  missions: z.array(z.string()).optional().default([]),
  resultats: z.array(z.string()).optional().default([]),
  image: z.string().optional().default(""),
  alt: z.string().optional().default(""),
  galerie: z.string().optional().default(""),
});

// Collections alimentées par les fichiers YAML de src/content/.
const projets = defineCollection({
  loader: file("src/content/projets.yaml"),
  schema: ficheSchema,
});

const evenements = defineCollection({
  loader: file("src/content/evenements.yaml"),
  schema: ficheSchema,
});

// ── Compétences ──────────────────────────────────────────────────
// Un seul fichier YAML, découpé en 4 sections (hard-skills, soft-skills,
// outils, details). Le loader `file` crée une entrée par section ;
// le schéma ci-dessous tolère les 4 formes (chaque champ est optionnel
// selon la section) tout en validant la structure interne de chacune.
const competencesSchema = z.object({
  titre: z.string().optional().default(""),
  // hard-skills / soft-skills
  skills: z
    .array(
      z.object({
        titre: z.string(),
        icon: z.string().optional().default(""),
        niveau: z.string(),
        items: z.array(z.string()).optional().default([]),
      })
    )
    .optional(),
  // outils
  groupes: z
    .array(
      z.object({
        categorie: z.string(),
        items: z.array(z.string()).optional().default([]),
      })
    )
    .optional(),
  // details (blocs notés)
  blocs: z
    .array(
      z.object({
        titre: z.string(),
        sousTitre: z.string().optional().default(""),
        moyenne: z.string().optional().default(""),
        competences: z
          .array(
            z.object({
              nom: z.string(),
              niveau: z.number(),
              score: z.string(),
              exemple: z.string().optional().default(""),
            })
          )
          .optional()
          .default([]),
      })
    )
    .optional(),
});

const competences = defineCollection({
  loader: file("src/content/competences.yaml"),
  schema: competencesSchema,
});

export const collections = { projets, evenements, competences };
