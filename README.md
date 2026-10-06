# Site du CDPA Bassin-Rond

Refonte de www.bassin-rond.net. La maquette retenue pour la page d'accueil est dans `maquettes/d-journee/` (HTML, CSS et JS statiques ; le port vers Astro est prévu).

- `PRODUCT.md` : le contexte produit (publics, offre, contraintes).
- `DESIGN.md` : le système visuel.
- `maquettes/d-journee/data/` : les tarifs modifiables en JSON (adhésion, centres aérés).

Voir la maquette en local :

```sh
cd maquettes && python3 -m http.server 8742
# puis ouvrir http://localhost:8742/d-journee/
```

## Publication

Le site est publié sur https://maxwarch.github.io/site-BR/. À chaque envoi sur `main`, GitHub Actions (`.github/workflows/pages.yml`) lance `npm run build` puis publie le dossier `dist/`.

`npm run build` (`scripts/build.mjs`) ne modifie jamais les sources. Il écrit dans `dist/` :
- les photos converties en WebP (900, 1200 et 1800 px), avec `srcset`, pour que chaque écran charge la bonne taille ;
- le HTML, le CSS, le JS et le JSON minifiés ;
- les favicons, générés à partir de `maquettes/assets/logo/logo-carre.png`.

La version publiée est protégée par un mot de passe (chiffrement StatiCrypt de la page). Le mot de passe est le secret `SITE_PASSWORD` du dépôt (Settings > Secrets and variables > Actions) ; pour le changer : `gh secret set SITE_PASSWORD`, puis relancer la publication. Sans ce secret, la publication échoue plutôt que de mettre le site en ligne sans protection. En local, il n'y a pas de mot de passe. Cette protection éloigne les visiteurs de passage, mais le dépôt étant public, son contenu reste lisible sur GitHub.

Pour voir la version publiée en local : `npm install`, puis `npm run preview` (http://localhost:8743/).

## À faire avant la migration

- **Retirer le mot de passe** : supprimer les deux lignes `SITE_PASSWORD` et `REQUIRE_PASSWORD` du workflow `.github/workflows/pages.yml`.
- **Réactiver l'indexation.** Tant que le site n'est qu'une maquette, la construction ajoute une balise `<meta name="robots" content="noindex, nofollow, …">` à chaque page et un `robots.txt` qui bloque tous les robots, y compris ceux des IA (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot…). Pour la mise en ligne définitive, passer `INDEXABLE` à `true` dans `scripts/build.mjs`.

- **Vidéos hébergées sur l'ancien site.** Deux vidéos de « La vie du club » pointent encore vers l'ancien site. Leurs liens casseront quand www.bassin-rond.net sera remplacé :
  - « La vie de nos jeunes navigateurs » : `https://www.bassin-rond.net/assets/uploads/2020/07/film-Estelle.mp4` (353 Mo, trop lourd pour GitHub, limité à 100 Mo par fichier) ;
  - « Entraînement de l'équipe du CDPA » : `https://www.bassin-rond.net/assets/uploads/2020/07/Saison-2019.mp4` (18 Mo).

  Solution conseillée : les publier sur la chaîne YouTube du club, puis remplacer les deux liens dans `maquettes/d-journee/index.html` (section « La vie du club »).
