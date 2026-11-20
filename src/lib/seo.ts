import { optionalEnv, type SiteData } from './api';
import { euros, formatDateRangeFr, formatPriceRange, formatShortDateFr } from './format';

export const SITE_URL = 'https://www.bassin-rond.net';
export const API_PUBLIC_URL = 'https://api.bassin-rond.net';

export function isIndexable(): boolean {
  return (optionalEnv('INDEXABLE') ?? 'false').toLowerCase() === 'true';
}

export function buildRobotsTxt(indexable: boolean): string {
  if (!indexable) {
    return [
      'User-agent: *',
      'Disallow: /',
      '',
      ...[
        'GPTBot',
        'ChatGPT-User',
        'OAI-SearchBot',
        'ClaudeBot',
        'Claude-Web',
        'anthropic-ai',
        'Google-Extended',
        'PerplexityBot',
        'CCBot',
        'Bytespider',
        'Applebot-Extended',
        'Meta-ExternalAgent',
        'Amazonbot',
        'cohere-ai',
      ].flatMap((bot) => [`User-agent: ${bot}`, 'Disallow: /', '']),
    ].join('\n');
  }
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# Recherche agentique autorisée',
    ...['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot', 'Claude-User'].flatMap((bot) => [
      `User-agent: ${bot}`,
      'Allow: /',
      '',
    ]),
    "# Bots d'entraînement bloqués",
    ...[
      'GPTBot',
      'ClaudeBot',
      'Google-Extended',
      'CCBot',
      'Bytespider',
      'Applebot-Extended',
      'Meta-ExternalAgent',
      'Amazonbot',
      'cohere-ai',
    ].flatMap((bot) => [`User-agent: ${bot}`, 'Disallow: /', '']),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

export function buildSitemapXml(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

export function buildJsonLd(data: SiteData): Record<string, unknown> {
  const { adhesion, centresAeres: d, summary } = data;

  const offersAdhesion: Record<string, unknown>[] = adhesion.formules.map((f) => ({
    '@type': 'Offer',
    name: `Adhésion annuelle ${f.nom}`,
    price: String(f.total),
    priceCurrency: 'EUR',
    description: `Cotisation (${euros(f.cotisation)}) + licence (${euros(f.licence)}) + forfait séances (${euros(f.forfait_seances)})${f.prix_seance ? `, soit ${euros(f.prix_seance)} la séance` : ''}. Supports : ${f.supports.join(', ')}.`,
    url: `${SITE_URL}/#adhesion`,
  }));

  if (adhesion.famille) {
    const fam = adhesion.famille;
    offersAdhesion.push({
      '@type': 'Offer',
      name: `Adhésion annuelle ${fam.nom}`,
      description: `${fam.condition} : cotisation famille ${euros(fam.cotisation)}, licence adulte ${euros(fam.licence_adulte)}, licence jeune ${euros(fam.licence_jeune)}, forfait séances ${euros(fam.forfait_seances_base)} (${fam.forfait_seances_precision}), personne supplémentaire ${euros(fam.forfait_seances_supplementaire)}.`,
      url: `${SITE_URL}/#adhesion`,
    });
  }

  const offersGroupes: Record<string, unknown>[] = [
    ...d.durees.flatMap((duree) =>
      duree.formules.map((f) => ({
        '@type': 'Offer',
        name: `Centres aérés — ${duree.libelle} : ${f.nom}`,
        price: String(f.prix),
        priceCurrency: 'EUR',
        description: `${f.description} (${d.unite}).`,
        url: `${SITE_URL}/#groupes`,
      })),
    ),
    ...[d.cotisation_groupe, ...d.camping, d.forfait_energie].map((item) => ({
      '@type': 'Offer',
      name: `Groupes & centres aérés — ${item.libelle}`,
      price: String(item.prix),
      priceCurrency: 'EUR',
      description: `${item.unite}${item.precision ? ` (${item.precision})` : ''}.`,
      url: `${SITE_URL}/#groupes`,
    })),
    {
      '@type': 'Offer',
      name: 'Centres aérés — Livret de certification FFVoile',
      price: String(d.livret.reste_a_charge),
      priceCurrency: 'EUR',
      description: `Reste à charge par livret (${euros(d.livret.prix)} au total, dont ${euros(d.livret.prise_en_charge_club)} pris en charge par le club).`,
      url: `${SITE_URL}/#groupes`,
    },
    {
      '@type': 'Service',
      name: "Accueil de groupes (centres aérés, comités d'entreprise, journées d'intégration, écoles)",
      description:
        "Formules centres aérés (séjours 4 ou 5 jours, camping, cotisation groupe) et accueil sur contact de comités d'entreprise, journées d'intégration et autres groupes.",
      url: `${SITE_URL}/#groupes`,
    },
  ];

  const offersLocation: Record<string, unknown>[] =
    summary && summary.supports_location.length > 0
      ? summary.supports_location.map((s) => {
          const base: Record<string, unknown> = {
            '@type': s.prix_min != null && s.prix_max != null && s.prix_min !== s.prix_max ? 'AggregateOffer' : 'Offer',
            name: `Location ${s.nom}`,
            priceCurrency: 'EUR',
            availability:
              s.prochaines_dates_ouvertes.length > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url: `https://location.bassin-rond.net/reservation/${s.id}`,
          };
          if (base['@type'] === 'AggregateOffer') {
            base.lowPrice = String(s.prix_min);
            base.highPrice = String(s.prix_max);
          } else if (s.prix_min != null) {
            base.price = String(s.prix_min);
          }
          return base;
        })
      : [];

  const stageEvents: Record<string, unknown>[] =
    summary && summary.prochaines_sessions_stage.length > 0
      ? summary.prochaines_sessions_stage.slice(0, 6).map((s) => ({
          '@type': 'Event',
          name: `${s.nom} — ${formatDateRangeFr(s.debut, s.fin)}`,
          startDate: s.debut,
          endDate: s.fin,
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: { '@id': `${SITE_URL}/#club` },
          organizer: { '@id': `${SITE_URL}/#club` },
          offers: {
            '@type': 'Offer',
            price: String(s.price),
            priceCurrency: 'EUR',
            availability: s.disponible > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
            url: 'https://stages.bassin-rond.net/',
          },
        }))
      : [];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'CDPA Bassin-Rond',
        inLanguage: 'fr',
      },
      {
        '@type': 'SportsActivityLocation',
        '@id': `${SITE_URL}/#club`,
        name: 'CDPA Bassin-Rond',
        description:
          "Association et école de voile sur le plan d'eau intérieur du Bassin-Rond à Bouchain : stages de voile jeunes et adultes, location de canoë, kayak, paddle et Hansa, adhésion à l'année, formules centres aérés et les 24 heures du Bassin-Rond.",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/logo/BR-logo.png`,
        image: `${SITE_URL}/images/photos/club-voile-bassin-rond-bouchain-1200.webp`,
        telephone: '+33327357228',
        email: 'directeur@bassin-rond.net',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '403 rue Henri Deshays',
          postalCode: '59111',
          addressLocality: 'Bouchain',
          addressCountry: 'FR',
        },
        areaServed: ['Bouchain', 'Valenciennes', 'Cambrai', 'Douai', 'Denain', 'Nord'],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '12:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '14:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '14:00',
            closes: '18:00',
          },
        ],
        sameAs: [
          'https://www.facebook.com/bassin.rond',
          'https://www.youtube.com/user/bassinrond/playlists',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Activités, stages et tarifs du CDPA Bassin-Rond',
          itemListElement: [
            ...offersAdhesion,
            ...offersGroupes,
            {
              '@type': 'Service',
              name: 'Stages de voile jeunes (7 à 17 ans) et adultes',
              description:
                "Stages à la semaine pendant les vacances scolaires (14 h – 17 h), encadrés par des moniteurs diplômés d'État.",
              url: 'https://stages.bassin-rond.net/',
            },
            {
              '@type': 'Service',
              name: 'Location de canoë, kayak, paddle et voilier Hansa',
              description:
                "Location d'embarcations en ligne sans licence requise : canoë, kayak, paddle, paddle géant et Hansa.",
              url: 'https://location.bassin-rond.net/',
            },
            ...offersLocation,
          ],
        },
      },
      {
        '@type': 'Event',
        '@id': `${SITE_URL}/#24-heures-du-bassin-rond`,
        name: 'Les 24 heures du Bassin-Rond',
        description:
          'Manifestation sportive et culturelle annuelle le premier week-end de septembre à Bouchain, réunissant plus de 5 000 personnes : baptêmes nautiques, concert, jeux et ateliers créatifs. Ouverte à tous, adhérent ou non.',
        url: `${SITE_URL}/#les-24-heures-du-bassin-rond`,
        image: `${SITE_URL}/images/photos/24-heures-bassin-rond-baptemes-nautiques-1200.webp`,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@id': `${SITE_URL}/#club` },
        organizer: { '@id': `${SITE_URL}/#club` },
      },
      ...stageEvents,
    ],
  };
}

export function buildLlmsTxt(data: SiteData): string {
  const { adhesion, centresAeres: d, summary } = data;

  const lignesAdhesion = adhesion.formules.map((f) => {
    const seance = f.prix_seance ? ` (soit ${euros(f.prix_seance)} / séance)` : '';
    return `- **${f.nom}** : ${euros(f.total)} / an${seance} — Cotisation ${euros(f.cotisation)}, Licence ${euros(f.licence)}, Forfait séances ${euros(f.forfait_seances)}. Supports : ${f.supports.join(', ')}.`;
  });
  if (adhesion.famille) {
    const fam = adhesion.famille;
    lignesAdhesion.push(
      `- **${fam.nom}** (${fam.condition}) : cotisation famille ${euros(fam.cotisation)}, licence adulte ${euros(fam.licence_adulte)}, licence jeune ${euros(fam.licence_jeune)}, forfait séances ${euros(fam.forfait_seances_base)} (${fam.forfait_seances_precision}), personne supplémentaire ${euros(fam.forfait_seances_supplementaire)}.`,
    );
  }

  const lignesGroupes = d.durees.flatMap((duree) =>
    duree.formules.map(
      (f) => `- **${duree.libelle} — ${f.nom}** : ${euros(f.prix)} ${d.unite} (${f.description})`,
    ),
  );
  const lignesAnnexes = [d.cotisation_groupe, ...d.camping, d.forfait_energie].map(
    (a) => `- **${a.libelle}**${a.precision ? ` (${a.precision})` : ''} : ${euros(a.prix)} ${a.unite}`,
  );

  const lignesStagesLive: string[] = [];
  if (summary) {
    if (summary.prochaines_sessions_stage.length > 0) {
      lignesStagesLive.push(`### Prochaines sessions ouvertes (saison ${summary.annee_saison})`);
      for (const s of summary.prochaines_sessions_stage) {
        lignesStagesLive.push(
          `- **${s.nom}** (${s.horaire}) — ${formatDateRangeFr(s.debut, s.fin)} : ${euros(s.price)} (${s.disponible} place${s.disponible > 1 ? 's' : ''} restante${s.disponible > 1 ? 's' : ''}) — [S'inscrire](https://stages.bassin-rond.net/)`,
        );
      }
    } else {
      lignesStagesLive.push(
        `- Aucune session de stage ouverte actuellement pour la saison ${summary.annee_saison}. Consulter https://stages.bassin-rond.net/.`,
      );
    }
  }

  const lignesLocationLive: string[] = [];
  if (summary && summary.supports_location.length > 0) {
    lignesLocationLive.push(
      `### Supports de location en direct (${summary.location_ouverte ? 'créneaux ouverts' : 'actuellement fermée — consulter le calendrier'})`,
    );
    for (const sup of summary.supports_location) {
      const range = formatPriceRange(sup.prix_min, sup.prix_max);
      const dates =
        sup.prochaines_dates_ouvertes.length > 0
          ? ` — prochains créneaux : ${sup.prochaines_dates_ouvertes.slice(0, 3).map(formatShortDateFr).join(', ')}`
          : '';
      lignesLocationLive.push(
        `- **${sup.nom}**${range ? ` (${range})` : ''}${dates} — [Réserver](https://location.bassin-rond.net/reservation/${sup.id})`,
      );
    }
  }

  return [
    '# CDPA Bassin-Rond',
    '',
    `> Club et école de voile associative à Bouchain (Nord, France), sur le plan d'eau intérieur du Bassin-Rond (${adhesion.licencies} licenciés, ${adhesion.labels_federaux} labels fédéraux). Note : le club ne propose pas de planche à voile.`,
    '',
    '## Coordonnées & accueil',
    '- Adresse : 403 rue Henri Deshays, 59111 Bouchain, France',
    '- Téléphone : +33 3 27 35 72 28 (03 27 35 72 28)',
    '- E-mail : directeur@bassin-rond.net',
    '- Horaires : lundi au vendredi 9 h – 12 h et 14 h – 18 h ; samedi 14 h – 18 h de mars à fin juin et de septembre à fin octobre.',
    '- Note : le club ne gère ni le port ni la pêche.',
    '',
    '## Réservations en ligne (sous-domaines dédiés)',
    "- [Stages de voile jeunes (7 à 17 ans) et adultes](https://stages.bassin-rond.net/) : vacances scolaires, 14 h – 17 h, moniteurs diplômés d'État.",
    ...lignesStagesLive,
    "- [Location d'embarcations](https://location.bassin-rond.net/) : canoë, kayak, paddle, paddle géant et voilier Hansa (sans licence requise).",
    ...lignesLocationLive,
    '',
    `## Adhésion annuelle (${SITE_URL}/#adhesion)`,
    ...lignesAdhesion,
    '',
    `## Groupes et centres aérés (${SITE_URL}/#groupes)`,
    `- Minimum ${d.groupe_minimum} personnes ; ${d.inclus}`,
    ...lignesGroupes,
    ...lignesAnnexes,
    `- **Livret de certification FFVoile** : ${euros(d.livret.prix)} le livret (${euros(d.livret.prise_en_charge_club)} pris en charge par le club, reste à charge ${euros(d.livret.reste_a_charge)}).`,
    "- Comités d'entreprise, journées d'intégration et autres groupes : sur contact.",
    '',
    `## Événement annuel : Les 24 heures du Bassin-Rond (${SITE_URL}/#les-24-heures-du-bassin-rond)`,
    '- Premier week-end de septembre, ouvert à tous (adhérent ou non), plus de 5 000 visiteurs : baptêmes nautiques, concert, jeux et ateliers créatifs.',
    '',
    '## API publique temps réel (données structurées JSON)',
    `- Résumé complet (stages, location, calendrier) : ${API_PUBLIC_URL}/v1/public/summary`,
    `- Tarifs vitrine (adhésion, centres aérés) : ${API_PUBLIC_URL}/v1/public/vitrine`,
    `- Sessions de stages : ${API_PUBLIC_URL}/v1/public/stages`,
    `- Supports & créneaux de location : ${API_PUBLIC_URL}/v1/public/location`,
    `- Spécification OpenAPI : ${API_PUBLIC_URL}/openapi.json`,
    '',
  ].join('\n');
}
