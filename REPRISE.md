# Refonte bassin-rond.net : où on en est

Dernière mise à jour : 6 octobre 2026.

## Le projet

Refonte du site vitrine du **CDPA Bassin-Rond**, club de voile associatif de Bouchain (59). Toute la vérité produit est dans **`PRODUCT.md`** : publics, positionnement, contraintes, contenus disponibles, questions ouvertes. Lis-le avant toute reprise.

Décisions confirmées :
- **Stack** : Astro, site 100 % statique. Les données qui changent vivent dans des fichiers JSON, qu'un agent créé par le propriétaire modifiera.
- **Aucune vente sur le site.** Les stages renvoient vers https://stages.bassin-rond.net/ et les locations vers https://location.bassin-rond.net/.
- **Seuls tarifs repris**, pilotés par JSON : les formules centres aérés (source : `/centres-aeres/`) et l'adhésion (source : `/le-club/je-minscris/`).
- **Publics à égalité** : familles (stages enfants), loisirs (location), futurs adhérents, groupes (centres aérés, CE, écoles).
- **Langue** : français.

## Ce qui a été fait

1. **`PRODUCT.md`** rédigé à l'issue de l'entretien d'initialisation, puis complété avec le périmètre de vente et de tarifs.
2. **Photos récupérées** dans `maquettes/assets/photos/` (redimensionnées à 1800 px) :
   - 41 photos publiques de Facebook (`fb*.jpg`) et 33 du site actuel (`site-*.jpg`) ;
   - un index commenté dans `PHOTOS.md`, avec la provenance et la description de chaque photo ;
   - exclues : fb08 et fb09 (prises à Barcelone) et fb26 (panneau publicitaire).
3. **Logo actuel** dans `maquettes/assets/logo/`. Il est en basse définition (347 px de large) : il faut demander une version vectorielle.
4. **Trois maquettes de page d'accueil** en HTML/CSS/JS statique, avec les mêmes contenus réels :

   | Dossier | Direction | Principe |
   |---|---|---|
   | `maquettes/a-voilerie/` | A, La Voilerie | Grand-voile en SVG comme premier écran, titre lettré comme un numéro de voile, ligne de départ avec 4 flammes de profil. La voile faseye au défilement. |
   | `maquettes/b-plan-d-eau/` | B, Le plan d'eau | Carte schématique du bassin qui sert de navigation. 4 repères (ponton école, location, club-house, pelouse des 24 h) dont la fiche se retourne, de la promesse au pratique. |
   | `maquettes/c-presentoir/` | C, Le présentoir des saisons | Sachets suspendus à un rack : photo en gouache au recto, pratique au verso, avec un retournement en 3D. Calendrier du club sous le rack. |

   - Page sommaire : `maquettes/index.html`.
   - Captures : `maquettes/<direction>/.review/desktop.png` et `mobile.png`.
   - Polices : auto-hébergées dans chaque `fonts/`.
5. **Contrats de direction** (thèse, univers, premier écran, interaction signature) dans `.impeccable/surfaces/` : un fichier par maquette.

## Pour voir les maquettes

```sh
cd maquettes && python3 -m http.server 8742
# puis ouvrir http://localhost:8742/
```

Passe par un serveur local plutôt que par `file://`, qui bloque certaines polices.

## Prochaine étape : choisir une direction

Rien n'a encore été choisi. Une fois la direction retenue (A, B, C, ou un mélange) :

1. Garder son contrat dans `.impeccable/surfaces/` et supprimer les deux autres.
2. Faire la revue de fin de la maquette retenue, puis appliquer les corrections.
3. Écrire **`DESIGN.md`** : le système visuel (couleurs, typographie, composants), tiré de la maquette finale.
4. Créer le projet **Astro** et y porter la page d'accueil.
5. Définir les **schémas JSON**, par exemple :
   - `data/centres-aeres.json` : formules 4 et 5 jours, demi-journée et journée, camping, cotisation de groupe (74 €), livret FFVoile ;
   - `data/adhesion.json` : cotisation, licence et forfait de séances, pour les adultes et pour les jeunes ;
   - `data/evenements.json`, `data/actus.json` et `data/horaires.json`.
6. Construire les autres pages : le club et la flotte, l'adhésion, les centres aérés, les rendez-vous et les 24 h, la vie du club et les médias, le contact, les CGV.

Avec le skill Impeccable : demande la page d'accueil avec la direction choisie, puis lance `/impeccable polish` ou `/impeccable critique` sur la maquette.

## Points à vérifier avec le club

- **Tarifs d'adhésion** : j'ai attribué 313 € aux adultes (cotisation 41 €, licence 72 €, forfait 200 €) et 262 € aux jeunes (29 €, 33 €, 200 €). La page actuelle ne l'indique pas clairement.
- **Labels fédéraux** : il en faut le nom.
- **Flotte** : quels bateaux sont réellement utilisés aujourd'hui (Optimist, Open Bic / OpenSkiff, RS Quba, Newcat 12, Laser / ILCA, Ludic, 420, Hansa, planche à voile) ? Il manque une photo du 420 et du Hansa.
- **Sigle CDPA** : il en faut la signification complète.
- **Direction B** : il faut caler la disposition réelle des installations (ponton, club-house, base de location) sur la carte.
- **Direction A** : la pile des éditions des 24 h affiche des numéros de 1 à 19 qui sont décoratifs, déduits de la mention de la « 20e édition ». Il faut trouver la vraie année de chaque édition.
- **Hébergeur** : il n'est pas encore choisi.

## Limites connues des maquettes

- **A** : sur mobile, la photo du premier écran montre surtout du ciel. Sur un écran de 1440 × 900, le titre « Vous venez pour… » passe en partie sous la ligne de flottaison.
- **B** : la géographie est inventée (le plan est présenté comme schématique). Sur mobile, la légende des quatre fiches est longue.
- **C** : sur un écran de 1440 × 900, le bas des sachets est coupé. Le filtre gouache rend certaines photos moins lisibles, en particulier celle de l'adhésion.
- **Toutes** : les liens internes visent les futures routes et ne mènent encore nulle part. Les alertes restantes du détecteur sont des faux positifs ou des choix assumés (titres en capitales). Aucune exception n'a été ajoutée au détecteur.
