---
version: 1
slug: "maquettes-d-journee-index-html"
primary_target: "maquettes/d-journee/index.html"
related_targets: []
---

# Accueil — « Une journée au Bassin-Rond » (direction retenue)

Scope : page d'accueil de bassin-rond.net, maquette HTML/CSS statique, future base du port Astro. Mode : Persuade.
Audience : familles, loisirs, futurs adhérents, groupes, à égalité. Action : trouver son moment de la journée et rejoindre directement stages.bassin-rond.net, location.bassin-rond.net, l'adhésion ou les centres aérés. Aucune vente sur le site.
Contraintes : seules les photos Facebook récentes (`fb*`), retouche légère seulement ; rien de techno ni de pixel art. Les heures affichées doivent être réelles : accueil de 9 h à 12 h et de 14 h à 18 h en semaine, stages de 14 h à 17 h. Les autres moments sont nommés par moment de la journée, sans heure inventée.
Révision du propriétaire : il garde le défilement et la couleur de fond qui change progressivement, mais abandonne le récit d'une journée (plus de moments de la journée ; le soleil du rail est conservé). Il garde le titre « Votre moment au CDPA Bassin-Rond » au-dessus du sélecteur, dans cet ordre : un stage (enfants et adultes), venir en groupe, louer un bateau, puis l'adhésion. Les 24 h ont pour titre « Les 24 heures du Bassin-Rond ». Cette révision prime sur le contrat ci-dessous partout où ils divergent.
Remplace les directions A, B et C, rejetées par le propriétaire. Le propriétaire exclut le soir et le repas : la page ne parle ni de soirée, ni de repas maison, ni de vie du club le soir.

## Direction contract
THESIS : le Bassin-Rond raconté par ses photos récentes, plein cadre. En descendant la page, la lumière et la couleur du fond changent progressivement, de section en section, comme le temps qui passe au bord de l'eau, sans aller jusqu'à la nuit. Refuse le héros photo suivi de quatre cartes égales, comme les gadgets : seule la photographie raconte.
OWN-WORLD : photos fb* plein cadre, étalonnage léger par section ; un fond qui glisse du bleu-gris pâle à un or clair net et à un bleu ciel franc, ni crème, ni parchemin, ni nuit ; bleu et vert du logo ; typographie humaniste franche ; horaires réels uniquement comme informations pratiques.
STORY : le visiteur ressent l'évasion, le sport et la nature, se reconnaît dans « Votre moment au CDPA Bassin-Rond » (stage enfant ou adulte, groupe, location, adhésion) et clique sur son lien direct.
FIRST VIEWPORT : la photo fb02 en plein cadre, avec « Un club de voile unique » dans le ciel et un voile de lisibilité serré derrière le texte seulement. Au pied, « Votre moment au CDPA Bassin-Rond » propose dans l'ordre : Un stage (enfant ou adulte) vers stages., Venir en groupe vers les centres aérés, Louer un bateau vers location., puis Naviguer toute l'année vers l'adhésion. Chaque entrée a son lien direct.
FORM : récit photographique au défilement chromatique. Il vient du candidat familier « Une journée » retenu au tour « safer » (clé de tirage 9c72580c) ; le récit de la journée a été retiré à la demande du propriétaire. Interaction signature : la couleur du fond et l'étalonnage avancent avec le défilement ; un rail collant sert de navigation entre les sections, avec un soleil qui avance au défilement (gardé à la demande du propriétaire). Avec `prefers-reduced-motion`, les états sont fixes.
FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
