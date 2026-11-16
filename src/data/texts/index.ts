import { LawArticle, LawSystem } from '../types';
import systemsRaw from './systems.json';
import articlesMetaRaw from './articlesMeta.json';
import officialTextsRaw from './officialTexts.json';
import briefExplanationsRaw from './briefExplanations.json';
import saudiExplanationsRaw from './saudiExplanations.json';
import practicalExamplesRaw from './practicalExamples.json';
import executiveBylawsRaw from './executiveBylaws.json';
import courtCasesRaw from './courtCases.json';
import preventiveTipsRaw from './preventiveTips.json';

interface StoredSystemMeta extends Omit<LawSystem, 'articles'> {
  articleIds: string[];
}

interface StoredArticleMeta {
  id: string;
  systemId: string;
  articleNumber: string;
  title: string;
  keywords: string[];
  status?: 'active' | 'amended' | 'repealed';
  amendmentDetails?: string;
  relevantLinks?: { label: string; url?: string }[];
}

const systemsList = systemsRaw as StoredSystemMeta[];
const articlesMetaList = articlesMetaRaw as StoredArticleMeta[];
const officialTexts = officialTextsRaw as Record<string, string>;
const briefExplanations = briefExplanationsRaw as Record<string, string>;
const saudiExplanations = saudiExplanationsRaw as Record<string, string>;
const practicalExamples = practicalExamplesRaw as Record<string, LawArticle['practicalExamples']>;
const executiveBylaws = executiveBylawsRaw as Record<string, string>;
const courtCases = courtCasesRaw as Record<string, LawArticle['courtCase']>;
const preventiveTips = preventiveTipsRaw as Record<string, string>;

const articlesById = new Map<string, LawArticle>();

for (const meta of articlesMetaList) {
  const article: LawArticle = {
    id: meta.id,
    systemId: meta.systemId,
    articleNumber: meta.articleNumber,
    title: meta.title,
    keywords: meta.keywords,
    officialText: officialTexts[meta.id] ?? '',
    executiveBylaw: executiveBylaws[meta.id] ?? '',
    saudiExplanation: saudiExplanations[meta.id] ?? '',
    briefExplanation: briefExplanations[meta.id] ?? '',
    practicalExamples: practicalExamples[meta.id] ?? [],
    courtCase: courtCases[meta.id],
    sadeedTip: preventiveTips[meta.id] ?? '',
    ...(meta.status !== undefined ? { status: meta.status } : {}),
    ...(meta.amendmentDetails !== undefined ? { amendmentDetails: meta.amendmentDetails } : {}),
    ...(meta.relevantLinks !== undefined ? { relevantLinks: meta.relevantLinks } : {}),
  };
  articlesById.set(meta.id, article);
}

export const ALL_LAW_SYSTEMS: LawSystem[] = systemsList.map(({ articleIds, ...sysMeta }) => ({
  ...sysMeta,
  articles: articleIds
    .map((id) => articlesById.get(id))
    .filter((art): art is LawArticle => Boolean(art)),
}));

const systemsById = new Map<string, LawSystem>(
  ALL_LAW_SYSTEMS.map((sys) => [sys.id, sys])
);

export function getLawSystemById(id: string): LawSystem {
  const sys = systemsById.get(id);
  if (!sys) {
    throw new Error(`Law system not found: ${id}`);
  }
  return sys;
}
