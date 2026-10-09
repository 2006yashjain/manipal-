export type ReviewStatus =
  | 'New'
  | 'Under Review'
  | 'Needs Clarification'
  | 'Evidence Review'
  | 'Ready for Assessment'
  | 'Complaint Drafted'
  | 'Closed';

export type EvidenceFlagStatus =
  | 'Accepted'
  | 'Flagged'
  | 'Needs verification';

export interface ReviewerNote {
  id: string;
  author: string;
  timestamp: string;
  note: string;
  relatedCaseElement: string;
}

export interface ReviewerActivity {
  id: string;
  timestamp: string;
  actor: string;
  event: string;
  details?: string;
  category:
    | 'Case created'
    | 'Evidence uploaded'
    | 'Fact corrected'
    | 'Conflict detected'
    | 'Reviewer opened'
    | 'Evidence flagged'
    | 'Clarification requested'
    | 'Complaint drafted'
    | 'Status changed'
    | 'Note added';
}

export interface FlaggedEvidence {
  evidenceId: string;
  flagged: boolean;
  flagReason?: string;
  status: EvidenceFlagStatus;
  flaggedAt?: string;
  flaggedBy?: string;
}

export interface ClarificationRequest {
  id: string;
  requestedAt: string;
  requestedBy: string;
  subject: string;
  description: string;
  relatedTo: string;
  status: 'Pending' | 'Provided' | 'Expired';
}

export interface ReviewerCaseRecord {
  caseId: string;
  issue: string;
  consumer: string;
  seller: string;
  marketplace?: string;
  dateCreated: string;
  lastUpdated: string;
  recordCompleteness: number;
  evidenceStatus: 'Partial' | 'Submitted' | 'Verified';
  reviewStatus: ReviewStatus;
  amount?: string;
  issueCategory: string;
  consumerCaseId: string;
}

export interface CompletenessSummary {
  recordCompleteness: number;
  evidenceCompleteness: number;
  missingItems: string[];
  evidenceConflicts: string[];
  timelineInconsistencies: string[];
  legalReviewPoints: string[];
  complaintLimitations: string[];
}
