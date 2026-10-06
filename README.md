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

## À faire avant la migration

- **Vidéos hébergées sur l'ancien site.** Deux vidéos de « La vie du club » pointent encore vers l'ancien site. Leurs liens casseront quand www.bassin-rond.net sera remplacé :
  - « La vie de nos jeunes navigateurs » : `https://www.bassin-rond.net/assets/uploads/2020/07/film-Estelle.mp4` (353 Mo, trop lourd pour GitHub, limité à 100 Mo par fichier) ;
  - « Entraînement de l'équipe du CDPA » : `https://www.bassin-rond.net/assets/uploads/2020/07/Saison-2019.mp4` (18 Mo).

  Solution conseillée : les publier sur la chaîne YouTube du club, puis remplacer les deux liens dans `maquettes/d-journee/index.html` (section « La vie du club »).
