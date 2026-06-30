# Portfolio — Mathis Detroussat

Site portfolio one-page + sections dédiées, conçu et développé pour **Mathis Detroussat**, chargé de projet événementiel, afin de présenter son parcours, ses projets, ses événements et ses compétences.

🔗 **En ligne : [mathis-detroussat.fr](https://mathis-detroussat.fr)**

![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![Déploiement](https://img.shields.io/badge/Déploiement-GitHub_Pages-222?logo=github&logoColor=white)
![Licence](https://img.shields.io/badge/Open_source-✓-3FB950)

---

## 🎯 Le projet

Mathis avait besoin d'un site vitrine **professionnel, rapide et personnel** pour valoriser son profil auprès d'écoles et de recruteurs dans l'événementiel. L'objectif : un site **statique** (donc ultra-rapide et sans coût de serveur), avec une **direction artistique forte** (style « sticker » rose/crème, titres détourés, éléments décoratifs) et un **vrai soin sur la performance, l'accessibilité et le référencement**.

Le contenu (parcours, projets, photos) est celui de Mathis ; le design, l'intégration, l'outillage et la mise en production ont été réalisés par mes soins.

---

## 🧱 Stack technique

| Domaine | Choix | Pourquoi |
|---|---|---|
| Framework | **[Astro](https://astro.build) 6** | Génère un site **statique** (HTML), zéro JS inutile envoyé au navigateur → chargement très rapide, idéal SEO. |
| Styling | **Tailwind CSS 4** (via `@tailwindcss/vite`) | Design system cohérent, responsive rapide à écrire, purge automatique du CSS. |
| Composants | **Astro components** (`.astro`) | Sections réutilisables et typées, rendues côté build. |
| Interactivité | **TypeScript / JS vanilla** | Lightbox galerie, bouton « voir plus », menu mobile, animations au scroll — sans framework lourd. |
| Images | **[sharp](https://sharp.pixelplumbing.com/)** + composant `<Image>` d'Astro | Compression, redimensionnement et filigrane automatisés (voir plus bas). |
| Sitemap | **@astrojs/sitemap** | Génération automatique du `sitemap-index.xml`. |
| Hébergement | **GitHub Pages** | Gratuit, fiable, CDN intégré. |
| CI/CD | **GitHub Actions** | Build + déploiement automatiques à chaque `push` sur `main`. |
| Nom de domaine | **OVH** | Domaine `.fr` relié à GitHub Pages. |

---

## ✨ Fonctionnalités notables

- **Galerie avec lightbox** maison (navigation clavier, flèches, fermeture, focus) et **bouton « + Voir plus »** pour ne charger/afficher les photos qu'à la demande.
- **Page Compétences** avec **jauges circulaires** (SVG) et indicateurs de niveau qualitatifs.
- **Design 100 % responsive** (mobile → desktop) et **respect de `prefers-reduced-motion`**.
- **Pages légales** complètes (mentions légales + politique de confidentialité) conformes au cadre français.
- **Direction artistique cohérente** réutilisable (palette, titres « sticker », composants décoratifs).

---

## 🖼️ Pipeline images (compression + filigrane)

Les photos brutes pesaient **~570 Mo** (16–32 Mo l'unité). Un script Node ([`scripts/watermark-images.mjs`](portfolio_mathis/scripts/watermark-images.mjs)) automatise tout via **sharp** :

- redimensionnement à **2500 px** max,
- **filigrane de crédit** gravé dans l'image (« © Mathis Detroussat — mathis-detroussat.fr »),
- **idempotent** (manifeste pour ne pas filigraner deux fois) + **sauvegarde des originaux**.

➡️ Résultat : **570 Mo → ~97 Mo** de sources, puis Astro génère à la livraison des **WebP dimensionnés par usage** (vignettes ~80–150 Ko au lieu de plusieurs Mo). Temps de build divisé par ~6.

---

## 🔍 Référencement (SEO)

Le SEO a été traité de bout en bout :

- **Titre, meta description, URL canonique et Open Graph uniques par page** (gérés dans le `Layout`).
- **Données structurées JSON-LD** (`schema.org/Person`).
- **`sitemap-index.xml`** généré automatiquement + **`robots.txt`** pointant dessus.
- **Image de partage Open Graph 1200×630** générée par script ([`scripts/generate-og.mjs`](portfolio_mathis/scripts/generate-og.mjs)) aux couleurs du site.
- **HTML sémantique** : un `<h1>` unique par page, balises `alt`, attributs `aria`.
- Page légale en `noindex` et exclue du sitemap.

---

## 🌐 Nom de domaine & déploiement

- Le domaine **`mathis-detroussat.fr`** est enregistré chez **OVH** et pointé vers **GitHub Pages** (fichier [`CNAME`](portfolio_mathis/public/CNAME)).
- À chaque `push` sur `main`, **GitHub Actions** ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) installe les dépendances, build le site et le déploie automatiquement.
- Site 100 % statique → **aucun serveur à maintenir**, temps de réponse minimal.

---

## 📁 Structure du projet

```
portfolio_mathis/
├── public/              # Fichiers servis tels quels (favicon, og-image, robots.txt, CNAME)
├── scripts/             # Outils Node (filigrane images, génération og-image)
├── src/
│   ├── assets/          # Photos & éléments graphiques (optimisés par Astro au build)
│   ├── components/      # Composants .astro (sections, galerie, cartes, déco, texte)
│   ├── layouts/         # Layout principal (head, SEO, navbar, footer)
│   ├── pages/           # Une route par fichier (index, projets, evenements, galerie, competences, mentions-legales)
│   └── styles/          # CSS global (Tailwind)
└── astro.config.mjs
```

---

## 🚀 Démarrage local

> Prérequis : **Node ≥ 22.12** et npm.

```bash
# depuis la racine du dépôt
cd portfolio_mathis
npm install
npm run dev        # serveur de dev sur http://localhost:4321
```

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (hot reload). |
| `npm run build` | Build de production dans `dist/`. |
| `npm run preview` | Prévisualise le build de production. |
| `npm run watermark` | Compresse + applique le filigrane sur les photos sources. |
| `node scripts/generate-og.mjs` | (Re)génère l'image de partage Open Graph. |

---

## 📄 Licence & code source

Le code de ce site est **open source**. Le contenu éditorial et les photographies appartiennent à leurs auteurs respectifs (Mathis Detroussat et les photographes crédités).

## 👤 Auteur

Conception & développement : **Jami Infante** — [LinkedIn](https://www.linkedin.com/in/jami-infante/)
