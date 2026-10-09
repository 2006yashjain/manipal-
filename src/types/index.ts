import { EligibilityResult } from './eligibility';
import { EvidenceDocument, EvidenceFact, EvidenceConflict } from './evidence';
import { TruthGraph } from './graph';
import { ReconstructedTimeline } from './timeline';
import { EvidenceGapReport } from './gaps';
import { LegalMapping, PreliminaryAssessment } from './legal';
import { CaseBrief } from './caseBrief';
import { ComplaintDraft } from './complaint';
import {
  ReviewerNote,
  ReviewerActivity,
  FlaggedEvidence,
  ClarificationRequest,
  ReviewStatus,
} from './reviewer';

export * from './eligibility';
export * from './evidence';
export * from './graph';
export * from './timeline';
export * from './gaps';
export * from './legal';
export * from './caseBrief';
export * from './complaint';
export * from './reviewer';

export type ProvenanceStatus =
  | 'Consumer reported'
  | 'Document supported'
  | 'Disputed'
  | 'Inferred'
  | 'Unknown';

export type UserRole = 'consumer' | 'reviewer' | null;

export type IssueCategoryType =
  | 'payment_refund_unresolved'
  | 'product_not_delivered'
  | 'defective_not_as_described';

export type RemedyType =
  | 'Refund'
  | 'Replacement'
  | 'Delivery'
  | 'Repair'
  | 'Compensation'
  | 'Other';

export interface InvolvedPartiesInput {
  marketplace: string;
  seller: string;
  paymentProvider: string;
  logistics: string;
  other?: string;
}

export interface CaseCompletenessItem {
  id: string;
  label: string;
  isComplete: boolean;
  isUpcoming?: boolean;
}

export interface ConsumerCaseInput {
  id: string;
  orderId: string;
  purchaseDate: string;
  platform: string;
  seller: string;
  amount: string;
  currency: string;
  story: string;
  issueCategory: IssueCategoryType | null;
  remedies: RemedyType[];
  parties: InvolvedPartiesInput;
  consentGiven: boolean;
  status: 'draft_story' | 'ready_for_evidence' | 'evidence_in_progress';
  createdAt: string;
  consumerEligibility?: EligibilityResult | null;
}

export interface CaseRecord extends ConsumerCaseInput {
  evidenceDocuments: EvidenceDocument[];
  evidenceFacts: EvidenceFact[];
  evidenceConflicts: EvidenceConflict[];
  timelineEvents: ReconstructedTimeline | null;
  truthGraph: TruthGraph | null;
  evidenceGapReport: EvidenceGapReport | null;
  legalMappings: LegalMapping[];
  preliminaryAssessment: PreliminaryAssessment | null;
  caseBrief: CaseBrief | null;
  complaint: ComplaintDraft | null;
  review: {
    reviewStatus: ReviewStatus;
    reviewerNotes: ReviewerNote[];
    activityLog: ReviewerActivity[];
    flaggedEvidence: FlaggedEvidence[];
    clarificationRequests: ClarificationRequest[];
    assignedReviewer: string;
  } | null;
}

