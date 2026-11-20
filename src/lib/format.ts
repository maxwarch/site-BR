import photoVariants from './photo-variants.json';

interface PhotoVariant {
  l: number;
  out: string;
}

const variantsMap = photoVariants as Record<string, PhotoVariant[]>;

export function euros(n: number): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
  return `${formatted}\u00a0€`;
}

export function formatPriceRange(min: number | null | undefined, max: number | null | undefined): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null && min !== max) {
    return `${euros(min)} – ${euros(max)}`;
  }
  const val = min ?? max;
  return val != null ? `dès ${euros(val)}` : null;
}

const MOIS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

function parseIsoDate(iso: string): { year: number; month: number; day: number } {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return { year: y, month: m, day: d };
}

export function formatDateRangeFr(debutIso: string, finIso: string): string {
  const a = parseIsoDate(debutIso);
  const b = parseIsoDate(finIso);
  const jourA = a.day === 1 ? '1er' : String(a.day);
  const jourB = b.day === 1 ? '1er' : String(b.day);
  if (a.year === b.year && a.month === b.month) {
    return `${jourA} – ${jourB} ${MOIS_FR[b.month - 1]} ${b.year}`;
  }
  if (a.year === b.year) {
    return `${jourA} ${MOIS_FR[a.month - 1]} – ${jourB} ${MOIS_FR[b.month - 1]} ${b.year}`;
  }
  return `${jourA} ${MOIS_FR[a.month - 1]} ${a.year} – ${jourB} ${MOIS_FR[b.month - 1]} ${b.year}`;
}

export function formatShortDateFr(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(d);
}

export function photoAttrs(base: string, sizes: string): { src: string; srcset: string; sizes: string } {
  const list = variantsMap[base];
  if (!list || list.length === 0) {
    return { src: `/images/photos/${base}-1800.webp`, srcset: '', sizes };
  }
  const largest = list[list.length - 1];
  return {
    src: `/images/photos/${largest.out}`,
    srcset: list.map((v) => `/images/photos/${v.out} ${v.l}w`).join(', '),
    sizes,
  };
}
