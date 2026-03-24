// ── AACN Essentials Types ─────────────────────────────────────────────────

export interface AacnCompetency {
  id: string;
  text: string;
}

export interface AacnDomain {
  id: string;
  domain: string;
  description: string;
  competencies: AacnCompetency[];
}

// ── QSEN Competency Types ─────────────────────────────────────────────────

export interface QsenCompetency {
  id: string;
  name: string;
  definition: string;
  knowledgeExamples: string[];
  skillsExamples: string[];
  attitudesExamples: string[];
}

// ── NCLEX-NG Types ────────────────────────────────────────────────────────

export interface NclexClinicalJudgmentLayer {
  id: string;
  layer: string;
  description: string;
  examples: string[];
}

export interface NclexSubcategory {
  id: string;
  name: string;
  percentRange: string;
  topics: string[];
}

export interface NclexClientNeedsCategory {
  id: string;
  category: string;
  percentRange?: string;
  topics?: string[];
  subcategories?: NclexSubcategory[];
}

export interface NclexCategories {
  model: string;
  description: string;
  clinicalJudgmentLayers: NclexClinicalJudgmentLayer[];
  clientNeedsCategories: NclexClientNeedsCategory[];
}

// ── Accreditation Standards Types ────────────────────────────────────────

export interface AccreditationStandard {
  id: string;
  title: string;
  description: string;
  keyElements?: string[];
  criteria?: string[];
}

export interface AccreditationBody {
  name: string;
  fullName: string;
  edition: string;
  website: string;
  standards: AccreditationStandard[];
}

export interface AccreditationStandards {
  ccne: AccreditationBody;
  acen: AccreditationBody;
}

// ── Curriculum Alignment Types ────────────────────────────────────────────

/** References to AACN Essential domains that a piece of content addresses */
export type AacnEssentialRef = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'D10';

/** References to QSEN competencies that a piece of content addresses */
export type QsenCompetencyRef = 'PCC' | 'TC' | 'EBP' | 'QI' | 'S' | 'I';

/** References to NCLEX-NG clinical judgment layers that a piece of content addresses */
export type NclexLayerRef = 'RC' | 'AC' | 'PH' | 'GS' | 'TA' | 'EO';

/** References to NCLEX-NG client needs categories */
export type NclexCategoryRef =
  | 'SECE'
  | 'HPM'
  | 'PI'
  | 'PhysI'
  | 'MC'
  | 'SIC'
  | 'BCC'
  | 'PPT'
  | 'RRP'
  | 'PA';

/** Accreditation standard references */
export type AccreditationRef =
  | 'CCNE-I'
  | 'CCNE-II'
  | 'CCNE-III'
  | 'CCNE-IV'
  | 'ACEN-1'
  | 'ACEN-2'
  | 'ACEN-3'
  | 'ACEN-4'
  | 'ACEN-5'
  | 'ACEN-6';

/** Full curriculum alignment metadata for a content item */
export interface CurriculumAlignment {
  aacnEssentials?: AacnEssentialRef[];
  qsenCompetencies?: QsenCompetencyRef[];
  nclexLayers?: NclexLayerRef[];
  nclexCategories?: NclexCategoryRef[];
  accreditationRefs?: AccreditationRef[];
  learningObjectives?: string[];
}
