# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, généré en site 100 % statique. Les contenus qui changent (dates de stages, tarifs, événements, actualités, horaires) vivent dans des fichiers JSON que le build lit ; un agent tiers, créé par le propriétaire, modifiera ces JSON. Pas de CMS, pas de back-end. L'hébergeur n'est pas encore choisi.

## Users

Tous les publics comptent autant ; le site doit orienter chaque profil vers sa démarche en quelques secondes :

- **Familles** : parents ou grands-parents qui inscrivent un enfant de 7 à 17 ans à un stage de voile pendant les vacances.
- **Grand public / loisirs** : habitants de la région (Bouchain, Denain, Valenciennes, Douai, Cambrai) qui veulent louer un canoë, un kayak, un paddle, un paddle géant ou un voilier Hansa, ou venir à un événement.
- **Futurs adhérents** : adultes et jeunes qui veulent pratiquer à l'année (cotisation, licence, forfait de séances).
- **Groupes** : centres aérés, comités d'entreprise, écoles, journées d'intégration, EHPAD. Ils comparent des formules au tarif par personne.

## Product Purpose

Refonte du site vitrine de www.bassin-rond.net pour le CDPA Bassin-Rond, une association et école de voile installée à Bouchain (59). Le site présente le club et ses activités, puis envoie chaque visiteur vers la bonne action : réserver un stage, louer une embarcation, adhérer, demander un devis de groupe ou venir à un rendez-vous. Le site est réussi quand un visiteur trouve son offre, son prix et la marche à suivre sans devoir appeler le club.

## Positioning

C'est un plan d'eau intérieur, calme et protégé, entouré de forêt, sur un site au passé batelier : on y navigue en sécurité, sans moteur et sans bruit. Le club est une association à taille humaine (140 licenciés, 3 labels fédéraux) réputée pour son ambiance familiale et ses repas maison. Il organise aussi les 24 heures du Bassin-Rond, qui attirent plus de 5000 personnes le dernier week-end complet de juin.

## Operating Context

- La réservation et le paiement **restent sur des outils séparés**, vers lesquels le site renvoie : `stages.bassin-rond.net` (stages de voile, panier, inscription) et `location.bassin-rond.net` (créneaux de location, paiement en ligne, confirmation par e-mail avec QR code). Le site vitrine ne les remplace pas.
- Le club communique surtout sur Facebook (facebook.com/bassin.rond, environ 5300 abonnés) et sur YouTube (youtube.com/user/bassinrond).
- Saisonnalité : les stages ont lieu pendant les vacances scolaires (exemple : sessions S9 et S10 en octobre 2026, 14h–17h, 131,50 € par stagiaire, hors Passeport Voile à +14,50 €). Les locations suivent des horaires d'ouverture ; les 24 h ont lieu fin juin.
- Horaires de l'accueil : du lundi au vendredi, 9h–12h et 14h–18h, toute l'année ; le samedi, 14h–18h de mars à fin juin et de septembre à fin octobre.
- Coordonnées : CDPA Bassin-Rond, 403 rue Henri Deshays, 59111 Bouchain · 03 27 35 72 28 · directeur@bassin-rond.net.
- Le club ne gère ni le port ni la pêche (le formulaire de contact actuel le précise).

## Capabilities and Constraints

- **Offre du club** : école de voile (enfants, adultes, seniors), stages individuels, formules pour centres aérés (4 ou 5 jours : multi-activités, nature, demi-journée ou journée ; camping ; cotisation de groupe ; livret de certification FFVoile), locations, adhésion à l'année, rendez-vous (24 h du Bassin-Rond, fête du sport, Rand'eau nautic), apprentissage en mer pour les membres.
- **Flotte** (une partie à confirmer) : Optimist (dès 7 ans), Open Bic / OpenSkiff (dès 11 ans), RS Quba, catamaran Newcat 12, Laser / ILCA (dès 14 ans), Ludic, planche à voile (dès 12 ans), 420, Hansa ; canoë, kayak, paddle, paddle géant.
- **Aucune vente sur le site** : pas de boutique, pas de panier, pas de paiement. Toute réservation et tout paiement passent par les sous-domaines `stages.` et `location.`.
- **Seuls tarifs affichés sur le site** : les formules **centres aérés** (page actuelle `/centres-aeres/`) et les tarifs d'**adhésion** (page actuelle `/le-club/je-minscris/`). Les deux sont pilotés par JSON. Les prix des stages et des locations ne sont pas recopiés : le site renvoie vers les sous-domaines.
- **Données dynamiques au format JSON** : tarifs centres aérés, tarifs d'adhésion, événements, actualités, horaires. Chaque fichier doit garder un schéma simple et stable pour que l'agent puisse les modifier sans casser le build.
- **Langue** : français. Une version anglaise n'a pas été demandée.
- **Contenu actuel à ne pas reprendre** : la page « Les extras », qui contient encore le texte de démonstration du thème WordPress, et le lien « Les stages » du menu, qui mène à une erreur 404.
- **Questions ouvertes** : l'hébergeur ; le nom des 3 labels fédéraux ; la flotte exacte d'aujourd'hui ; le nom réel de l'association derrière le sigle CDPA.

## Brand Commitments

- Nom : « CDPA Bassin-Rond » (avec le trait d'union ; le site actuel écrit aussi « Bassin Rond »). Signature actuelle : « Un club de voile unique ! ».
- Logo existant : `https://www.bassin-rond.net/assets/uploads/2019/04/BR-logo.png`. Il faut le récupérer en meilleure définition ou en vectoriel si possible.
- Ton : chaleureux, associatif et familial, tutoiement collectif de la région (« on vous donne rendez-vous »), ouvert à tous (« de l'enfant au senior »).

## Evidence on Hand

- **Photos** : le propriétaire autorise la réutilisation des photos du site actuel (environ 56 images dans `/assets/uploads/`) et de la page Facebook (`facebook.com/bassin.rond/photos`). Les photos Facebook sont publiques.
- **Contenu éditorial** : les textes du site actuel et des sous-domaines servent de matière, et la page Facebook d'inspiration.
- **Chiffres réels** : 140 licenciés, 3 labels fédéraux, plus de 5000 visiteurs aux 24 h, 20e édition des 24 h, 18 participants à la première Rand'eau nautic.
- **Presse et médias** : un reportage de France Bleu Nord (24 juillet), une interview sur Wéo (émission « Sportez-vous bien ! ») et des vidéos YouTube, dont les 24 h filmées vues du ciel.
- **Vie du club** : l'accueil des aînés de l'EHPAD de Bouchain, l'entraînement des membres en habitable en mer, les débuts des jeunes navigateurs.
- **Ce qui manque et ne doit pas être inventé** : des témoignages, des avis chiffrés, les noms des moniteurs (à part Guillaume et Geoffrey, cités dans les actualités), des tarifs ou des dates absents des sources.

## Product Principles

1. **Chaque public trouve son chemin tout de suite** : familles, loisirs, adhérents et groupes ont chacun une entrée claire dès la page d'accueil.
2. **Le prix et la marche à suivre sont toujours visibles** : chaque offre affiche son tarif, à qui elle s'adresse et un lien direct vers la réservation ou le contact.
3. **Le lieu est l'argument** : l'eau calme, la forêt et le passé batelier font la différence ; il faut les montrer avec de vraies photos plutôt que les décrire.
4. **Les données vivent dans les JSON, pas dans les gabarits** : tout ce qui change d'une saison à l'autre se met à jour sans toucher au code.
5. **Une association, pas une entreprise** : les vraies personnes, les événements et la convivialité passent avant le discours commercial.

## Accessibility & Inclusion

Le public va de l'enfant au senior et beaucoup consultent le site sur mobile. Viser au minimum le niveau WCAG 2.1 AA, avec des tarifs et des horaires lisibles sur un petit écran.
