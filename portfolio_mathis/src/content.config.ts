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

export const collections = { projets, evenements };
