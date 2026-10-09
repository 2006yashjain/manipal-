import { EvidenceGapPriority } from './gaps';

export interface CaseBriefReference {
  id: string;
  generatedAt: string;
  format: string;
}

export interface BriefParty {
  role: 'Complainant' | 'Opposite Party' | 'Intermediary';
  name: string;
  identifier?: string;
  relationship: string;
}

export interface BriefVerifiedFact {
  fact: string;
  value: string;
  status: string;
  evidenceRefs: string[];
}

export interface BriefDisputedFact {
  fact: string;
  valueA: string;
  sourceA: string;
  valueB: string;
  sourceB: string;
  note: string;
}

export interface BriefEvidenceIndexItem {
  refId: string;
  filename: string;
  type: string;
  source: string;
  supportsFacts: string[];
  reviewStatus: 'Reviewed' | 'Needs review' | 'Accepted';
}

export interface BriefEvidenceGap {
  priority: EvidenceGapPriority;
  title: string;
  description: string;
  missingEvidence: string;
  recommendation: string;
}

export interface BriefInconsistency {
  title: string;
  description: string;
  sources: string[];
}

export interface BriefLegalProvision {
  provision: string;
  title: string;
  act: string;
  relevance: string;
}

export interface CaseBrief {
  reference: CaseBriefReference;
  consumer: BriefParty;
  oppositeParties: BriefParty[];
  transaction: {
    productService: string;
    amount: string;
    marketplace?: string;
    orderId?: string;
    purchaseDate?: string;
  };
  eligibility: {
    status: string;
    summary: string;
  };
  chronology: { date: string; event: string; source: string }[];
  verifiedFacts: BriefVerifiedFact[];
  userReportedFacts: BriefVerifiedFact[];
  disputedFacts: BriefDisputedFact[];
  evidenceIndex: BriefEvidenceIndexItem[];
  evidenceGaps: BriefEvidenceGap[];
  inconsistencies: BriefInconsistency[];
  legalProvisions: BriefLegalProvision[];
  preliminaryAssessment: string;
  requestedRemedy: string;
  limitations: string[];
  generatedAt: string;
}
