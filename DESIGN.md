---
name: CDPA Bassin-Rond
description: Votre moment au CDPA Bassin-Rond — le Bassin-Rond raconté par ses photos, sur un fond dont la lumière avance avec le défilement.
colors:
  ink: "#0e2a3c"
  ink-soft: "#2f4a5c"
  lac: "#0f5c99"
  lac-vif: "#1a72bd"
  foret: "#2f6b3c"
  or: "#f2a531"
  or-chiffre: "#ffd27a"
  panel: "#ffffff"
  voile-ciel: "#f0f6fa"
  ground-lieu: "#dbe7ef"
  ground-stages: "#e6f2f8"
  ground-groupes: "#e1efe3"
  ground-location: "#d6ecf6"
  ground-adhesion: "#ffe6a0"
  ground-vingt-quatre: "#cfe8f7"
  ground-videos: "#e4eef8"
  ground-infos: "#e9f1f4"
  ciel-24-haut: "#5fb2e6"
  ciel-24-bas: "#8ccbef"
  soleil-disque: "#ffc531"
  soleil-rayons: "#f2a10f"
  soleil-cerne: "#6b3a00"
  soleil-reflet: "#ffe9a3"
  nuit-legende: "#081a30"
  pied-texte: "#e5eef4"
  pied-legal: "#b9cad6"
typography:
  display:
    fontFamily: "Fira Sans, Source Sans 3, system-ui, sans-serif"
    fontSize: "clamp(3.1rem, 7.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fira Sans, Source Sans 3, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.2vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline-evenement:
    fontFamily: "Fira Sans, Source Sans 3, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.4vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fira Sans, Source Sans 3, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title-item:
    fontFamily: "Fira Sans, Source Sans 3, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1.2
  price:
    fontFamily: "Fira Sans, Source Sans 3, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 3.6vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\", \"lnum\""
  price-large:
    fontFamily: "Fira Sans, Source Sans 3, system-ui, sans-serif"
    fontSize: "clamp(3rem, 5vw, 4.2rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\", \"lnum\""
  lead:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)"
    fontWeight: 500
    lineHeight: 1.6
  body:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Source Sans 3, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  hairline: "3px"
  sm: "4px"
  md: "6px"
  pill: "999px"
spacing:
  space-1: "0.5rem"
  space-2: "1rem"
  space-3: "1.5rem"
  space-4: "2.5rem"
  space-5: "4rem"
  space-6: "clamp(5rem, 10vw, 9rem)"
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  max: "80rem"
  header-h: "4.5rem"
  rail-space: "3.75rem"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.95rem 1.4rem"
  button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
  button-plein:
    backgroundColor: "{colors.lac}"
    textColor: "{colors.panel}"
    rounded: "{rounded.pill}"
    padding: "0.95rem 1.4rem"
  button-plein-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
  button-sombre:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
    rounded: "{rounded.pill}"
    padding: "0.95rem 1.4rem"
  button-sombre-hover:
    backgroundColor: "{colors.lac}"
    textColor: "{colors.panel}"
  button-clair:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.95rem 1.4rem"
  tel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1rem"
  bascule-option:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.3rem"
  bascule-option-checked:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
  fait:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.95rem"
  badge-plus-demande:
    backgroundColor: "{colors.or}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.65rem"
  lien-media:
    backgroundColor: "transparent"
    textColor: "{colors.lac}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1rem"
  lien-media-hover:
    backgroundColor: "{colors.lac}"
    textColor: "{colors.panel}"
  panneau:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "clamp(1.5rem, 4vw, 3.5rem)"
  pastille-programme:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.1rem"
  legende-photo:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.45rem 0.85rem"
  rail-soleil:
    size: "2.25rem"
  pied:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.pied-texte}"
---

# Design System: CDPA Bassin-Rond

## Overview

**Creative North Star: "La lumière qui avance sur le bassin"**

Le site est un récit photographique au défilement chromatique. Les photos récentes du club (`fb*`), en plein cadre ou en grands aplats débordant la grille, portent tout le propos : l'eau calme, la forêt, les péniches, les voiles. Autour d'elles, le fond de page n'est pas une couleur fixe mais une lumière qui change progressivement d'une section à l'autre, du bleu-gris pâle du matin au vert d'eau, au bleu ciel franc, jusqu'à un or clair net, puis revient vers un bleu doux. Elle ne descend jamais vers la nuit et ne vire jamais au crème ou au parchemin.

La densité est aérée et franche : de grands titres humanistes très gras (Fira Sans 800), un texte courant généreux (Source Sans 3, 19 px), des listes séparées par de simples filets plutôt que des cartes. Les informations pratiques (prix, horaires, âges) sont traitées en chiffres tabulaires et en gras, toujours lisibles. Un rail collant à droite (en bas sur mobile) sert de repère et de navigation ; un soleil dessiné en SVG s'y déplace avec le défilement. C'est le seul ornement du système : tout le reste vient des photos.

Le propriétaire a fixé l'univers : évasion, sport, nature. Rien de techno, pas de pixel art, pas d'univers étranger plaqué ; uniquement les photos Facebook récentes, retouchées légèrement.

**Key Characteristics:**
- Fond de lecture piloté par le défilement : une teinte par section, interpolée pendant la seconde moitié de chaque section.
- Photos `fb*` plein cadre ou débordant la gouttière, étalonnage léger par famille (frais, net, doré).
- Panneaux blancs qui chevauchent le bas d'une photo plein cadre.
- Typographie humaniste franche : Fira Sans 800 pour les titres et les chiffres, Source Sans 3 pour le texte.
- Formes en pilule pour tout ce qui se touche ; filets fins pour tout ce qui se lit.
- Un seul ornement dessiné : le soleil du rail.

## Colors

Une palette de plein jour : encre bleu-nuit pour le texte, le bleu et le vert du logo assombris pour l'accent, l'or pour la chaleur, et une série de fonds clairs qui forment la lumière de la page.

### Primary
- **Bleu du lac** (`lac`) : l'accent d'action. Boutons pleins (stages, location, groupes), liens directs du sélecteur, prix, mot « moment » du titre d'accueil, liens média. C'est le bleu du logo assombri pour atteindre le contraste du texte.
- **Bleu vif du lac** (`lac-vif`) : uniquement l'anneau de focus (3 px, décalé de 3 px).

### Secondary
- **Vert forêt** (`foret`) : le vert du logo assombri. Repères d'âge de la flotte (« dès 7 ans »), nom du média dans la presse, date dans la vie du club. Une étiquette de contexte, jamais un fond.

### Tertiary
- **Or du soleil** (`or`) : badge « Le plus demandé » des formules groupes et sélection de texte. Rare, ponctuel.
- **Or des chiffres** (`or-chiffre`) : les horaires mis en relief dans la pastille « fait » sur fond encre.

### Neutral
- **Encre du bassin** (`ink`) : texte, bordures des boutons, pastilles encrées, pied de page. Les filets en dérivent (encre à 22 % d'opacité, `color-mix`).
- **Encre douce** (`ink-soft`) : texte secondaire, sous-lignes, légendes, notes.
- **Blanc panneau** (`panel`) : panneaux posés sur les photos, options de la bascule, pastilles du programme, points du rail.
- **Voile de ciel** (`voile-ciel`) : base du voile de lisibilité radial derrière le titre d'accueil (0,74 puis 0,5 d'opacité, fondu à 72 %) et du dégradé de l'en-tête au repos.
- **Nuit de légende** (`nuit-legende`) : uniquement le dégradé de lisibilité sous les légendes de la mosaïque des 24 h (de 0 à 0,85).
- **Texte du pied** (`pied-texte`) et **mention légale** (`pied-legal`) : textes clairs sur le pied encré.

### La progression du fond
Le fond de page (`--ground`) est réécrit par le script selon la section courante, dans l'ordre du document : `ground-lieu` → `ground-stages` → `ground-groupes` (vert d'eau) → `ground-location` (bleu ciel) → `ground-adhesion` (or clair net) → `ground-vingt-quatre` (ciel franc) → `ground-videos` → `ground-infos`. La section des 24 h superpose un ciel dégradé (`ciel-24-haut` à 0 %, `ciel-24-bas` à 55 %, puis le fond courant à 100 %). Les surfaces translucides (en-tête au défilement, menu, barre du rail mobile, étiquettes du rail) mélangent ce fond avec du blanc, de sorte qu'elles suivent la lumière.

### Named Rules
**The Daylight Rule.** Le fond de lecture reste une lumière de jour : bleu-gris, vert d'eau, bleu ciel ou or clair net. Jamais de crème, de parchemin, ni de section nocturne ; seul le pied de page est encré.

**The Ground-Follows Rule.** Toute surface claire translucide se compose à partir de `--ground` mélangé au blanc, jamais d'une teinte fixe, pour suivre la progression.

**The Gold Is Rare Rule.** L'or n'apparaît qu'en point : un badge, une sélection, les chiffres d'une pastille, le soleil, et le fond d'une seule section (l'adhésion).

## Typography

**Display Font:** Fira Sans 600 et 800, auto-hébergée (avec Source Sans 3, system-ui)
**Body Font:** Source Sans 3 400–700 et italique 400, auto-hébergée (avec system-ui, -apple-system, Segoe UI)

**Character:** deux humanistes sans empattement, sportifs et francs. Fira Sans en très gras, serrée (−0,02 em), donne les titres et les chiffres ; Source Sans 3 garde un texte courant chaleureux et très lisible, de l'enfant au senior.

### Hierarchy
- **Display** (800, clamp(3.1rem, 7.4vw, 6rem), 1) : le seul titre d'accueil, posé dans le ciel de la photo, 12 ch au plus.
- **Headline** (800, clamp(2.1rem, 4.2vw, 3.6rem), 1.04) : titres de section, 16 ch au plus, `text-wrap: balance`. Variante événement plus grande pour les 24 h.
- **Title** (800, clamp(1.6rem, 2.6vw, 2.25rem)) : sous-parties (la flotte, la vie du club, les blocs d'infos à 1.4rem, les formules à 1.6rem).
- **Title item** (800, 1.35–1.5rem, 1.15–1.2) : nom d'un bateau, d'une embarcation, d'une formule, d'un reportage, d'une entrée du sélecteur.
- **Price** (800, clamp(2.4rem, 3.6vw, 3.2rem), chiffres tabulaires) en bleu du lac ; **Price large** (clamp(3rem, 5vw, 4.2rem)) pour l'adhésion à l'année.
- **Lead** (500, 1.2rem) : les chapeaux de section.
- **Body** (400, 1.1875rem, 1.6 ; 1.0625rem sous 760 px) : paragraphes limités à 32–40 rem (environ 65 ch), `text-wrap: pretty`.
- **Label** (600, 1rem) : navigation, légendes, en-têtes de tableaux ; 0.875rem pour les étiquettes du rail.

### Named Rules
**The Tabular Facts Rule.** Tout prix, horaire, âge ou numéro de téléphone passe en chiffres tabulaires et alignés, sans césure (`white-space: nowrap`), et les montants principaux en Fira Sans 800.

**The No Uppercase Rule.** Aucun texte en capitales espacées : la hiérarchie se fait par la graisse et la taille, jamais par un surtitre.

## Layout

Grille de 12 colonnes dans un conteneur de 80 rem, gouttière fluide clamp(1rem, 4vw, 3.5rem). Les sections (« chapitres ») respirent avec un grand pas vertical clamp(5rem, 10vw, 9rem) ; l'échelle d'espacement va de 0.5rem à 4rem (8, 16, 24, 40, 64 px).

Les photos sortent de la grille : elles débordent la gouttière d'un côté (marges négatives de `--gutter`), se collent (`position: sticky`) à côté d'une liste qui défile (la flotte, la vie du club, le texte des stages), ou occupent toute la largeur (location, adhésion : min(78vh, 52rem)). Les compositions alternent texte et photo en 5/7 ou 6/6, jamais en rangée de cartes égales.

Au-dessus de 901 px, le contenu réserve 3.75rem à droite pour le rail ; les sections plein cadre (accueil, location, adhésion, 24 h) annulent cette réserve pour aller jusqu'au bord. À 1100 px, la navigation passe dans un menu. À 900 px, le rail devient une barre en bas d'écran (3.5rem). À 760 px, tout passe sur une colonne, l'en-tête descend à 4rem, le numéro de téléphone se réduit à son icône et les légendes plein cadre sortent sous la photo.

Le premier écran tient en 100svh : un bandeau photo `fb02` atténué (clamp(16rem, 48svh, 30rem), cadré en bas sur les enfants), puis le titre principal « Votre *moment* au CDPA Bassin-Rond » et les quatre vignettes, qui prennent toute la hauteur restante. Le bloc entier est visible sans défiler, et centré : la réserve du rail ne s'applique pas au premier écran.

## Elevation & Depth

Système hybride, surtout plat : la profondeur vient du chevauchement (un panneau blanc remonte de 3.5rem sur la photo plein cadre, une seconde photo des stages chevauche la première) et des filets. Les ombres sont diffuses, très étalées et à rayon négatif, teintées d'encre bleue (ou de brun doré sous l'adhésion) ; jamais d'ombre dure décalée.

### Shadow Vocabulary
- **Panneau sur photo** (`box-shadow: 0 20px 50px -30px rgba(14, 42, 60, .55)`) : panneau de la location ; variante dorée `rgba(74, 40, 8, .55)` sous l'adhésion.
- **En-tête au défilement** (`box-shadow: 0 1px 0 var(--line), 0 8px 24px -18px rgba(14, 42, 60, .45)`).
- **Menu ouvert** (`box-shadow: 0 16px 30px -20px rgba(14, 42, 60, .5)`).
- **Pastille du programme** (`box-shadow: 0 6px 16px -10px rgba(14, 42, 60, .5)`).
- **Point et étiquette du rail** (`0 1px 4px rgba(14, 42, 60, .45)` et `.25`), filet du rail cerné (`0 0 0 1px rgba(14, 42, 60, .35)`).
- **Soleil** (`filter: drop-shadow(0 1px 2px rgba(60, 30, 0, .45))`).
- **Passe-partout de photo** (`box-shadow: 0 0 0 clamp(.4rem, 1vw, .75rem) var(--ground)`) : anneau couleur de fond autour de la photo qui en chevauche une autre.

### Named Rules
**The Lift-Over-Photo Rule.** Une surface ne s'élève que lorsqu'elle se pose sur une photo ou flotte au-dessus du contenu (en-tête, menu, rail). Les listes et les tarifs restent à plat, séparés par des filets.

## Shapes

Deux familles de formes. Tout ce qui se touche est une pilule (999px) : boutons, téléphone, menu, options de la bascule, liens média, pastilles. Tout ce qui se lit est rectangulaire et découpé par des filets : filet encre de 2 px en tête des formules groupes, filet encre de 1 px en tête des formules d'adhésion et des blocs d'infos, filets à 22 % entre les lignes, pointillés pour les lignes de détail (horaires, décomposition des prix). Les coins restent discrets : 6px pour les panneaux et les tuiles de la mosaïque, 4px pour les légendes, étiquettes et la photo des stages, 3px pour le logo et l'anneau de focus. Les photos plein cadre et les photos qui débordent la gouttière n'ont aucun arrondi. Les points du rail et du sélecteur sont des cercles de 1rem cerclés d'encre (2 px).

## Components

### Buttons
Pilules franches, en gras, qui s'encrent au survol.
- **Shape:** pilule (999px), bordure de 2 px.
- **Contour (par défaut):** bordure et texte encre, fond transparent ; au survol, fond encre et texte blanc.
- **Plein:** fond et bordure bleu du lac, texte blanc, padding 0.95rem 1.4rem, Source Sans 800 à 1.05rem ; au survol, il passe à l'encre. Une flèche SVG oblique (↗ dessinée, 1em, trait 1.9) suit le libellé quand le lien sort vers un sous-domaine ou une autre page.
- **Sombre:** fond encre, au survol bleu du lac (adhésion).
- **Clair:** fond blanc et bordure encre, au survol encre (sur le ciel des 24 h).
- **Hover / Focus:** transitions de 0.25s sur `cubic-bezier(.16, 1, .3, 1)`, enfoncement de 1 px à l'appui, anneau de focus `lac-vif` 3 px décalé de 3 px.
- **Téléphone de l'en-tête:** pilule encre, 800, 1rem, icône de combiné SVG ; au survol bleu du lac.

### Chips
- **Fait pratique:** pilule encre, Fira Sans 600 à 1.1rem, chiffres en or (`or-chiffre`, 800). Une donnée réelle (horaires des stages), jamais un surtitre.
- **Badge « Le plus demandé »:** pilule or, Source Sans 700 à 0.95rem, posée dans la ligne du nom de formule ; piloté par le champ `plusDemande` du JSON.
- **Pastilles du programme:** pilules blanches, Fira Sans 800 clamp(1.15rem, 2vw, 1.5rem), ombre diffuse, sur le ciel des 24 h.
- **Liens média:** pilule contour 2 px en bleu du lac, icône lecture ou casque en SVG ; au survol, fond bleu du lac et texte blanc.

### Cards / Containers
- **Panneau sur photo plein cadre:** fond blanc, coins 6px, padding clamp(1.5rem, 4vw, 3.5rem), largeur min(80rem, 100 % − 2 gouttières), remonte de 3.5rem (2.5rem sur mobile) sur la photo qui le précède. Ombre « Panneau sur photo ». Location : deux colonnes texte et liste d'embarcations ; adhésion : chapeau puis deux formules.
- Pas d'autres cartes : les offres sont des listes à filets.

### Inputs / Fields
- **Bascule 4 jours / 5 jours:** un groupe de boutons radio natifs masqués, avec une légende en Fira Sans 800 à 1.15rem et deux options en pilule (bordure encre 2 px, fond blanc, Fira Sans 800 à 1.1rem, padding 0.7rem 1.3rem). L'option cochée passe en fond encre et texte blanc ; le focus clavier reporte l'anneau `lac-vif` sur l'étiquette. Le basculement se fait en CSS seul (`:has()`), sans script ; sans `:has()`, les deux durées s'affichent l'une sous l'autre avec leur titre.

### Navigation
- **En-tête fixe** (4.5rem) : logo et nom à gauche, liens en Source Sans 600 à 1rem, soulignement de 2 px qui se déroule au survol (0.35s), pilule téléphone à droite. Au repos sur la photo, un dégradé `voile-ciel` de 0.55 à 0 ; dès 24 px de défilement, un fond `--ground` mélangé à 92 % avec du blanc et l'ombre de l'en-tête.
- **Menu (≤ 1100 px):** bouton pilule contour avec icône SVG à trois traits ; panneau déroulé sous l'en-tête, liens à 1.15rem séparés par des filets ; fermeture au clic d'un lien et à Échap.

### Le rail et son soleil (Signature Component)
Repère de lecture et accès direct aux huit sections, qui apparaît en fondu (0.5s) après 60 % de la hauteur d'écran. Sur grand écran : colonne fixe à droite, hauteur min(52vh, 26rem), un filet blanc de 3 px cerné d'encre, huit points blancs de 1rem cerclés d'encre. L'étiquette de la section courante (fond `--ground` mélangé au blanc, coins 4px, 0.875rem, 800 pour l'active) s'affiche à gauche du point ; les autres apparaissent au survol. Sous 900 px : barre horizontale en bas d'écran, cibles de 2.75rem, étiquette au-dessus du point actif.

Le soleil est un SVG dessiné (40 × 40, 2.25rem ; 2rem sur mobile) : disque `soleil-disque` cerné de `soleil-cerne`, reflet `soleil-reflet`, dix rayons `soleil-rayons` de 3 px doublés d'un halo `soleil-cerne` de 4.6 px. Il se pose sur le point de la section courante et glisse vers le suivant en proportion du défilement ; ses rayons tournent de `scrollY / 6` degrés. L'étiquette active suit le point le plus proche du soleil.

### L'accueil « Votre moment au CDPA Bassin-Rond »
- **Bandeau photo :** `fb02`, `saturate(.8) brightness(1.06) contrast(.92)`, sous un voile clair vertical (0,86 en haut, 0,22 au milieu sur les enfants, puis fondu vers `--ground`). La photo reste un décor : elle ne porte plus de texte.
- **Titre principal (h1) :** Fira Sans 800, clamp(2rem, 3.6vw, 3.2rem), interlettrage -0.02em, centré, en encre ; un seul mot en bleu du lac (« moment »), comme le faisait « unique » auparavant. Aucun soulignement ni autre couleur.
- **Vignettes :** quatre portes photo dans cet ordre fixe : un stage (enfant ou adulte), venir en groupe, louer un bateau, naviguer toute l'année. Grille de 4 colonnes (gap 1rem, 2 colonnes entre 761 et 1100 px, carrousel horizontal à 78 % sur mobile, avec aimantation), coins de 6px, ombre diffuse encre. Photo `object-fit: cover` (50 % 78 %) sous un dégradé encre vers le bas (0 à 0,88) ; nom en Fira Sans 800 blanc, sous-ligne `#e5eef4`, et pilule blanche « Voir les dates » ou « Réserver un créneau » quand un lien direct existe. Toute la vignette renvoie à sa section. Au survol, elle monte de 6 px et la photo zoome à 1,05.

### Listes de tarifs
- **Formules groupes:** trois colonnes (1.15fr 1.15fr 0.8fr) sous un filet encre de 2 px, séparées par des filets verticaux à 22 % ; nom, badge éventuel, prix en style Price, « par personne » en encre douce, description.
- **Annexes:** tableaux sans bordure extérieure, lignes à filet, intitulés en 600 avec précision en `<small>`, montants en Fira Sans 800 à 1.3rem.
- **Adhésion:** deux formules sous un filet encre de 1 px, prix en style Price large, décomposition en liste de définitions à pointillés, total par séance en encre douce.
- Toutes les valeurs proviennent des JSON de données.

### Photos et étalonnage
Trois familles d'étalonnage, appliquées par la figure qui contient la photo, toujours légères :
- **Frais** : `saturate(.92) brightness(1.03) contrast(1.02)` et un voile `soft-light` bleu `rgba(110, 165, 210, .08)` (le lieu).
- **Net** : `saturate(1.06) sepia(.05)` et un voile `soft-light` `rgba(255, 196, 120, .05)` (stages, flotte, groupes, location, vie du club).
- **Doré** : `sepia(.12) saturate(1.1) brightness(1.02)` et un voile `soft-light` `rgba(255, 168, 80, .07)` (adhésion).
- Toutes les photos graduées dans le contenu reçoivent en plus une chaleur qui monte avec la progression de la page (`rgba(255, 200, 130, progress × .07)`, `soft-light`).
- **Légendes:** sur photo plein cadre, étiquette blanche à 88 % en haut à gauche (coins 4px, 600, 1rem) ; dans la mosaïque des 24 h, texte blanc 600 sur un dégradé `nuit-legende` de 0 à 0.85 en pied de tuile.

## Do's and Don'ts

### Do:
- **Do** laisser les photos `fb*` porter chaque section, en plein cadre ou en débordant la gouttière, avec l'une des trois familles d'étalonnage (frais, net, doré) et rien de plus fort que `sepia(.12)` ou `saturate(1.1)`.
- **Do** donner à toute nouvelle section sa teinte de fond dans la progression et la faire glisser pendant la seconde moitié de la section précédente.
- **Do** composer les surfaces translucides à partir de `--ground` mélangé au blanc.
- **Do** poser les panneaux d'action en blanc (coins 6px) sur le bas d'une photo plein cadre, avec l'ombre diffuse « Panneau sur photo ».
- **Do** donner aux prix, horaires et âges des chiffres tabulaires en Fira Sans 800, et lire leurs valeurs dans les JSON.
- **Do** mettre en pilule tout ce qui se clique et séparer tout ce qui se lit par des filets à 22 % d'encre.
- **Do** dessiner les icônes en SVG au trait (1em, trait 1.9, extrémités arrondies, `currentColor`).
- **Do** figer les états avec `prefers-reduced-motion` : fond par section sans interpolation, soleil posé sur le point courant, rayons immobiles, transitions à 0s.

### Don't:
- **Don't** utiliser de photo hors des `fb*` récentes, ni la photo de planche à voile (fb05), ni d'image de soirée ou de repas.
- **Don't** introduire d'esthétique techno, de pixel art, de néon ou d'univers étranger au plan d'eau.
- **Don't** faire virer le fond au crème, au parchemin ou à la nuit ; l'encre est réservée au pied de page, aux pastilles et aux boutons.
- **Don't** retoucher les photos à outrance : pas de filtres saturés, de duotones ou de dégradés colorés plein cadre.
- **Don't** aligner des rangées de cartes égales sous une photo d'accueil ; les offres sont des listes et des compositions texte-photo.
- **Don't** utiliser d'ombre dure décalée ni de surtitre en capitales au-dessus des titres.
- **Don't** ajouter d'autre ornement dessiné que le soleil du rail.
