export interface LawArticle {
  id: string;
  systemId: string;
  articleNumber: string;
  title: string;
  keywords: string[];
  officialText: string;
  executiveBylaw: string;
  saudiExplanation: string;
  briefExplanation?: string;
  status?: 'active' | 'amended' | 'repealed';
  amendmentDetails?: string;
  practicalExamples: {
    title: string;
    scenario: string;
    takeaway: string;
  }[];
  courtCase: {
    caseTitle: string;
    court: string;
    parties: {
      claimant: string;
      defendant: string;
    };
    facts: string;
    arguments: {
      claimantArg: string;
      defendantArg: string;
    };
    judgment: string;
    legalRationale: string;
  };
  sadeedTip: string;
  relevantLinks?: { label: string; url?: string }[];
}

export interface LawSystem {
  id: string;
  name: string;
  shortName: string;
  category: 'labor' | 'commercial' | 'civil' | 'penal_cyber' | 'family' | 'judiciary';
  categoryLabel: string;
  description: string;
  briefSummary?: string;
  issuingAuthority: string;
  articlesCount: number;
  icon: string;
  keywords?: string[];
  articles: LawArticle[];
}

export const LAW_CATEGORIES = [
  { id: 'all', label: 'جميع الأنظمة واللوائح' },
  { id: 'labor', label: 'العمل والتوظيف' },
  { id: 'commercial', label: 'التجارة والشركات' },
  { id: 'civil', label: 'المعاملات المدنية' },
  { id: 'judiciary', label: 'القضاء والإثبات والتنفيذ' },
  { id: 'penal_cyber', label: 'الجرائم والسلامة' },
  { id: 'family', label: 'الأحوال الشخصية والأسرة' },
];
