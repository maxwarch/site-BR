import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface AdhesionFormule {
  id: string;
  nom: string;
  cotisation: number;
  licence: number;
  forfait_seances: number;
  total: number;
  prix_seance: number | null;
  supports: string[];
}

export interface AdhesionFamille {
  nom: string;
  condition: string;
  cotisation: number;
  licence_adulte: number;
  licence_jeune: number;
  forfait_seances_base: number;
  forfait_seances_supplementaire: number;
  forfait_seances_precision: string;
  total_precision: string;
}

export interface AdhesionData {
  note: string;
  intro: string;
  licencies: number;
  labels_federaux: number;
  formules: AdhesionFormule[];
  famille: AdhesionFamille | null;
}

export interface CentreAereFormule {
  id: string;
  nom: string;
  prix: number;
  description: string;
  plus_demande: boolean;
}

export interface CentreAereDuree {
  id: string;
  libelle: string;
  formules: CentreAereFormule[];
}

export interface AnnexeTarif {
  id?: string;
  libelle: string;
  prix: number;
  unite: string;
  precision?: string | null;
}

export interface LivretData {
  prix: number;
  prise_en_charge_club: number;
  reste_a_charge: number;
  contenu: string[];
  description: string;
}

export interface CentresAeresData {
  unite: string;
  groupe_minimum: number;
  inclus: string;
  note?: string | null;
  durees: CentreAereDuree[];
  cotisation_groupe: AnnexeTarif;
  camping: AnnexeTarif[];
  forfait_energie: AnnexeTarif;
  livret: LivretData;
}

export interface VitrinePublic {
  adhesion: AdhesionData | null;
  centres_aeres: CentresAeresData | null;
}

export interface VacanceScolaire {
  id: number;
  nom: string;
  debut: string;
  fin: string;
}

export interface SessionStage {
  id: string;
  num: number;
  type_id: string;
  debut: string;
  fin: string;
  debut_label: string;
  fin_label: string;
  days: number;
  price: number;
  disponible: number;
  nom: string;
  horaire: string;
  public: 'jeunes' | 'adultes';
  niveaux: string[];
  age_min: number;
  age_max: number;
}

export interface TypeStage {
  id: string;
  nom: string;
  description: string;
  public: 'jeunes' | 'adultes';
  niveaux: string[];
  horaire: string;
  prix_defaut: number | null;
  places_defaut: number | null;
  age_min: number;
  age_max: number;
}

export interface SupportSummary {
  id: string;
  nom: string;
  prix_min: number | null;
  prix_max: number | null;
  prochaines_dates_ouvertes: string[];
}

export interface ClubSummary {
  annee_saison: number;
  vacances_scolaires: VacanceScolaire[];
  prochaines_sessions_stage: SessionStage[];
  location_ouverte: boolean;
  supports_location: SupportSummary[];
  licencies: number | null;
  labels_federaux: number | null;
}

export interface SiteData {
  adhesion: AdhesionData;
  centresAeres: CentresAeresData;
  summary: ClubSummary | null;
  typesStage: TypeStage[];
  source: 'api' | 'fallback';
}

const REQUEST_TIMEOUT_MS = 4000;

let cachedData: { value: SiteData; expiresAt: number } | null = null;

export function optionalEnv(key: string): string | undefined {
  const fromProcess = typeof process !== 'undefined' ? process.env?.[key] : undefined;
  const fromImportMeta = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.[key];
  const value = fromProcess ?? fromImportMeta;
  return typeof value === 'string' ? value.trim() || undefined : undefined;
}

function isDevMode(): boolean {
  return Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
}

export function getCacheMaxAge(): number {
  if (isDevMode()) return 0;
  const raw = Number(optionalEnv('PUBLIC_CACHE_MAX_AGE') ?? '30');
  return Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 30;
}

export function getCacheControlHeader(): string {
  const maxAge = getCacheMaxAge();
  if (maxAge <= 0) return 'no-store';
  return `public, max-age=${maxAge}, stale-while-revalidate=${Math.max(maxAge * 2, 60)}`;
}

function getApiBaseUrl(): string {
  return (optionalEnv('BASSIN_ROND_API_URL') ?? '').replace(/\/+$/, '');
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} on ${url}`);
  }
  return (await res.json()) as T;
}

function normalizeLocalAdhesion(raw: Record<string, any>): AdhesionData {
  const formules: AdhesionFormule[] = (raw.formules ?? []).map((f: Record<string, any>) => {
    const cotisation = Number(f.cotisation);
    const licence = Number(f.licence);
    const forfait_seances = Number(f.forfaitSeances ?? f.forfait_seances ?? 0);
    const prixRaw = f.prixSeance ?? f.prix_seance;
    return {
      id: String(f.id),
      nom: String(f.nom),
      cotisation,
      licence,
      forfait_seances,
      total: Number((cotisation + licence + forfait_seances).toFixed(2)),
      prix_seance: prixRaw ? Number(prixRaw) : null,
      supports: Array.isArray(f.supports) ? f.supports.map(String) : [],
    };
  });
  const fam = raw.famille;
  return {
    note: String(raw.note ?? ''),
    intro: String(raw.intro ?? ''),
    licencies: Number(raw.licencies ?? 0),
    labels_federaux: Number(raw.labelsFederaux ?? raw.labels_federaux ?? 0),
    formules,
    famille: fam
      ? {
          nom: String(fam.nom),
          condition: String(fam.condition),
          cotisation: Number(fam.cotisation),
          licence_adulte: Number(fam.licenceAdulte ?? fam.licence_adulte),
          licence_jeune: Number(fam.licenceJeune ?? fam.licence_jeune),
          forfait_seances_base: Number(fam.forfaitSeancesBase ?? fam.forfait_seances_base),
          forfait_seances_supplementaire: Number(
            fam.forfaitSeancesSupplementaire ?? fam.forfait_seances_supplementaire,
          ),
          forfait_seances_precision: String(
            fam.forfaitSeancesPrecision ?? fam.forfait_seances_precision ?? '',
          ),
          total_precision: String(fam.totalPrecision ?? fam.total_precision ?? ''),
        }
      : null,
  };
}

function normalizeLocalCentresAeres(raw: Record<string, any>): CentresAeresData {
  const liv = raw.livret ?? {};
  const cot = raw.cotisationGroupe ?? raw.cotisation_groupe ?? {};
  const nrj = raw.forfaitEnergie ?? raw.forfait_energie ?? {};
  return {
    unite: String(raw.unite ?? 'par personne'),
    groupe_minimum: Number(raw.groupeMinimum ?? raw.groupe_minimum ?? 6),
    inclus: String(raw.inclus ?? ''),
    note: raw.note ?? null,
    durees: (raw.durees ?? []).map((d: Record<string, any>) => ({
      id: String(d.id),
      libelle: String(d.libelle),
      formules: (d.formules ?? []).map((f: Record<string, any>) => ({
        id: String(f.id),
        nom: String(f.nom),
        prix: Number(f.prix),
        description: String(f.description),
        plus_demande: Boolean(f.plusDemande ?? f.plus_demande ?? false),
      })),
    })),
    cotisation_groupe: {
      libelle: String(cot.libelle ?? 'Cotisation groupe'),
      prix: Number(cot.prix ?? 0),
      unite: String(cot.unite ?? ''),
      precision: cot.precision ?? null,
    },
    camping: (raw.camping ?? []).map((c: Record<string, any>) => ({
      id: String(c.id),
      libelle: String(c.libelle),
      prix: Number(c.prix),
      unite: String(c.unite),
      precision: c.precision ?? null,
    })),
    forfait_energie: {
      libelle: String(nrj.libelle ?? 'Forfait énergie'),
      prix: Number(nrj.prix ?? 0),
      unite: String(nrj.unite ?? ''),
      precision: nrj.precision ?? null,
    },
    livret: {
      prix: Number(liv.prix ?? 0),
      prise_en_charge_club: Number(liv.priseEnChargeClub ?? liv.prise_en_charge_club ?? 0),
      reste_a_charge: Number(liv.resteACharge ?? liv.reste_a_charge ?? 0),
      contenu: Array.isArray(liv.contenu) ? liv.contenu.map(String) : [],
      description: String(liv.description ?? ''),
    },
  };
}

async function loadLocalVitrineFallback(): Promise<{
  adhesion: AdhesionData;
  centresAeres: CentresAeresData;
}> {
  const dataDir = path.resolve(process.cwd(), 'data');
  const [adhRaw, caRaw] = await Promise.all([
    readFile(path.join(dataDir, 'adhesion.json'), 'utf8').then((s) => JSON.parse(s)),
    readFile(path.join(dataDir, 'centres-aeres.json'), 'utf8').then((s) => JSON.parse(s)),
  ]);
  return {
    adhesion: normalizeLocalAdhesion(adhRaw),
    centresAeres: normalizeLocalCentresAeres(caRaw),
  };
}

export async function getSiteData(): Promise<SiteData> {
  const maxAgeMs = getCacheMaxAge() * 1000;
  const now = Date.now();
  if (maxAgeMs > 0 && cachedData && cachedData.expiresAt > now) {
    return cachedData.value;
  }

  const baseUrl = getApiBaseUrl();
  if (baseUrl) {
    const [vitrineRes, summaryRes, stagesRes] = await Promise.allSettled([
      fetchJson<VitrinePublic>(`${baseUrl}/v1/public/vitrine`),
      fetchJson<ClubSummary>(`${baseUrl}/v1/public/summary`),
      fetchJson<{ types_stage: TypeStage[] }>(`${baseUrl}/v1/public/stages`),
    ]);

    const vitrine = vitrineRes.status === 'fulfilled' ? vitrineRes.value : null;
    const summary = summaryRes.status === 'fulfilled' ? summaryRes.value : null;
    const typesStage = stagesRes.status === 'fulfilled' ? stagesRes.value.types_stage ?? [] : [];

    if (vitrine?.adhesion && vitrine?.centres_aeres) {
      const value: SiteData = {
        adhesion: vitrine.adhesion,
        centresAeres: vitrine.centres_aeres,
        summary,
        typesStage,
        source: 'api',
      };
      if (maxAgeMs > 0) {
        cachedData = { value, expiresAt: now + maxAgeMs };
      }
      return value;
    }

    // API partiellement joignable ou vitrine absente : fallback local sur vitrine tout en gardant summary si disponible
    const fallback = await loadLocalVitrineFallback();
    const value: SiteData = {
      adhesion: vitrine?.adhesion ?? fallback.adhesion,
      centresAeres: vitrine?.centres_aeres ?? fallback.centresAeres,
      summary,
      typesStage,
      source: summary ? 'api' : 'fallback',
    };
    if (maxAgeMs > 0) {
      cachedData = { value, expiresAt: now + Math.min(maxAgeMs, 10_000) };
    }
    return value;
  }

  const fallback = await loadLocalVitrineFallback();
  const value: SiteData = {
    adhesion: fallback.adhesion,
    centresAeres: fallback.centresAeres,
    summary: null,
    typesStage: [],
    source: 'fallback',
  };
  if (maxAgeMs > 0) {
    cachedData = { value, expiresAt: now + maxAgeMs };
  }
  return value;
}
