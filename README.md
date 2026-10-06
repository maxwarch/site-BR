# Site du CDPA Bassin-Rond

Nouveau site de www.bassin-rond.net : une page d'accueil statique (HTML, CSS, JS), dont les tarifs sont modifiables en JSON. Un portage vers Astro est envisagé plus tard.

## Organisation

```
site/                 les sources du site, servies telles quelles en développement
├── index.html        la page d'accueil
├── css/style.css     les styles
├── js/main.js        les interactions (fond qui évolue, rail et soleil, tarifs JSON, vidéos…)
├── data/             les données modifiables
│   ├── adhesion.json       tarifs et chiffres de l'adhésion
│   └── centres-aeres.json  formules, camping, livret des centres aérés
├── fonts/            les polices auto-hébergées (woff2)
└── images/
    ├── photos/       les photos du club (provenance dans PHOTOS.md)
    └── logo/         le logo, dont logo-carre.png pour les favicons
scripts/build.mjs     construit la version publiée dans dist/
PRODUCT.md            le contexte produit (publics, offre, contraintes)
DESIGN.md             le système visuel
```

Les contacts (adresse, téléphone, horaires) sont écrits en dur dans `site/index.html` : ils ne changent pas.

## Travailler en local

```sh
npm install
npm run dev       # sources, sur http://localhost:8742/
npm run preview   # version optimisée (dist/), sur http://localhost:8743/
```

## Publication

Le site est publié sur https://maxwarch.github.io/site-BR/. À chaque envoi sur `main`, GitHub Actions (`.github/workflows/pages.yml`) lance `npm run build` puis publie le dossier `dist/`.

`npm run build` ne modifie jamais `site/`. Il écrit dans `dist/` :
- les photos converties en WebP (900, 1200 et 1800 px), avec `srcset`, pour que chaque écran charge la bonne taille ; la photo d'accueil est préchargée ;
- le HTML, le CSS, le JS et le JSON minifiés ;
- les favicons, générés à partir de `site/images/logo/logo-carre.png`.

La version publiée est protégée par un mot de passe (chiffrement StatiCrypt de la page). Le mot de passe est le secret `SITE_PASSWORD` du dépôt (Settings > Secrets and variables > Actions). Pour le changer : `gh secret set SITE_PASSWORD`, puis relancer la publication. Sans ce secret, la publication échoue plutôt que de mettre le site en ligne sans protection. En local, il n'y a pas de mot de passe. Cette protection éloigne les visiteurs de passage, mais le dépôt étant public, son contenu reste lisible sur GitHub.

## À faire avant la mise en ligne définitive

- **Retirer le mot de passe** : supprimer les deux lignes `SITE_PASSWORD` et `REQUIRE_PASSWORD` du workflow `.github/workflows/pages.yml`.
- **Réactiver l'indexation.** Tant que le site n'est pas officiellement en ligne, la construction ajoute une balise `<meta name="robots" content="noindex, nofollow, …">` à chaque page et un `robots.txt` qui bloque tous les robots, y compris ceux des IA (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot…). Passer `INDEXABLE` à `true` dans `scripts/build.mjs`.
- **Vidéos hébergées sur l'ancien site.** Deux vidéos de « La vie du club » pointent encore vers l'ancien site. Leurs liens casseront quand www.bassin-rond.net sera remplacé :
  - « La vie de nos jeunes navigateurs » : `https://www.bassin-rond.net/assets/uploads/2020/07/film-Estelle.mp4` (353 Mo, trop lourd pour GitHub, limité à 100 Mo par fichier) ;
  - « Entraînement de l'équipe du CDPA » : `https://www.bassin-rond.net/assets/uploads/2020/07/Saison-2019.mp4` (18 Mo).

  Solution conseillée : les publier sur la chaîne YouTube du club, puis remplacer les deux liens dans `site/index.html` (section « La vie du club »).
