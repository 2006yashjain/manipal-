export type EvidenceGapPriority = 'Critical' | 'Important' | 'Informational';

export type GapType =
  | 'missing_document'
  | 'unsupported_claim'
  | 'conflicting_evidence'
  | 'unknown_date'
  | 'unknown_party'
  | 'unresolved_status';

export interface EvidenceGap {
  id: string;
  priority: EvidenceGapPriority;
  type: GapType;
  title: string;
  description: string;
  relatedFactId?: string;
  relatedFact?: string;
  availableEvidence: string[];
  missingEvidence: string;
  recommendation: string;
}

export interface EvidenceGapReport {
  gaps: EvidenceGap[];
  criticalCount: number;
  importantCount: number;
  informationalCount: number;
  generatedAt: string;
}
