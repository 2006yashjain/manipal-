import {
  ReviewerCaseRecord,
  ReviewStatus,
  ReviewerNote,
  ReviewerActivity,
  FlaggedEvidence,
  ClarificationRequest,
  CompletenessSummary,
} from '../types/reviewer';
import { EvidenceDocument } from '../types/evidence';
import { EvidenceGapReport } from '../types/gaps';
import { EvidenceConflict } from '../types/evidence';
import { ConsumerCaseInput, CaseRecord } from '../types';

export function buildCompletenessSummary(
  caseData: ConsumerCaseInput,
  documents: EvidenceDocument[],
  gaps: EvidenceGapReport | null,
  conflicts: EvidenceConflict[],
  hasBrief: boolean,
  hasComplaint: boolean
): CompletenessSummary {
  const requiredFields = [
    { key: 'orderId', label: 'Order ID', value: caseData.orderId },
    { key: 'purchaseDate', label: 'Purchase date', value: caseData.purchaseDate },
    { key: 'seller', label: 'Seller', value: caseData.seller },
    { key: 'amount', label: 'Amount', value: caseData.amount },
    { key: 'story', label: 'Problem description', value: caseData.story },
    { key: 'issueCategory', label: 'Issue category', value: caseData.issueCategory },
    { key: 'remedies', label: 'Remedy requested', value: caseData.remedies?.length },
  ];

  const completedFields = requiredFields.filter(f => !!f.value).length;
  const recordCompleteness = Math.round((completedFields / requiredFields.length) * 100);

  const evTotal = 5;
  const evPresent = Math.min(documents.length, evTotal);
  const evidenceCompleteness = documents.length ? Math.round((evPresent / evTotal) * 100) : 0;

  const missingItems: string[] = [];
  requiredFields.filter(f => !f.value).forEach(f => missingItems.push(f.label));
  if (!hasBrief) missingItems.push('Case brief not yet generated');
  if (!hasComplaint) missingItems.push('Complaint draft not yet generated');

  const evidenceConflicts = conflicts.map(c => `${c.factName}: ${c.description}`);
  const timelineInconsistencies = conflicts
    .filter(c => c.factName.toLowerCase().includes('date'))
    .map(c => c.neutralObservation);

  const legalReviewPoints: string[] = [];
  if (gaps) {
    if (gaps.criticalCount > 0) {
      legalReviewPoints.push(`${gaps.criticalCount} critical evidence gap(s) to be addressed before review`);
    }
    if (gaps.importantCount > 0) {
      legalReviewPoints.push(`${gaps.importantCount} important evidence gap(s) require attention`);
    }
  }
  if (conflicts.length > 0) {
    legalReviewPoints.push(`${conflicts.length} possible inconsistency(ies) across evidence sources`);
  }

  const complaintLimitations: string[] = [
    'Draft complaint has not been formally verified by the complainant',
    'Complainant declaration signature block is not executed',
    'Evidence references in the complaint have not been cross-checked against original documents',
    'All statutory and forum requirements (court fees, jurisdiction, limitation) must be independently verified',
  ];

  return {
    recordCompleteness,
    evidenceCompleteness,
    missingItems,
    evidenceConflicts,
    timelineInconsistencies,
    legalReviewPoints,
    complaintLimitations,
  };
}

export function addReviewerNote(
  notes: ReviewerNote[],
  text: string,
  relatedTo: string,
  author: string = 'Demo Reviewer'
): ReviewerNote[] {
  return [
    ...notes,
    {
      id: `note-${Date.now()}`,
      author,
      timestamp: new Date().toISOString(),
      note: text,
      relatedCaseElement: relatedTo,
    },
  ];
}

export function addReviewerActivity(
  log: ReviewerActivity[],
  event: ReviewerActivity['event'],
  category: ReviewerActivity['category'],
  details?: string,
  actor: string = 'Demo Reviewer'
): ReviewerActivity[] {
  return [
    ...log,
    {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor,
      event,
      details,
      category,
    },
  ];
}

export function flagEvidence(
  flagged: FlaggedEvidence[],
  evidenceId: string,
  reason: string,
  by: string = 'Demo Reviewer'
): FlaggedEvidence[] {
  const existing = flagged.find(f => f.evidenceId === evidenceId);
  if (existing) {
    return flagged.map(f =>
      f.evidenceId === evidenceId
        ? {
            ...f,
            flagged: true,
            flagReason: reason,
            status: 'Flagged',
            flaggedAt: new Date().toISOString(),
            flaggedBy: by,
          }
        : f
    );
  }
  return [
    ...flagged,
    {
      evidenceId,
      flagged: true,
      flagReason: reason,
      status: 'Flagged',
      flaggedAt: new Date().toISOString(),
      flaggedBy: by,
    },
  ];
}

export function requestClarification(
  requests: ClarificationRequest[],
  subject: string,
  description: string,
  relatedTo: string,
  by: string = 'Demo Reviewer'
): ClarificationRequest[] {
  return [
    ...requests,
    {
      id: `clar-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      requestedBy: by,
      subject,
      description,
      relatedTo,
      status: 'Pending',
    },
  ];
}

export function buildConsumerReviewerCaseRecord(
  caseData: CaseRecord,
  reviewStatus: ReviewStatus
): ReviewerCaseRecord {
  const issueLabels: Record<string, string> = {
    defective_not_as_described: 'Defective / not as described',
    payment_refund_unresolved: 'Refund unresolved',
    product_not_delivered: 'Product not delivered',
  };

  const documents = caseData.evidenceDocuments?.length || 0;
  const evStatus = documents === 0 ? 'Partial' : documents >= 4 ? 'Verified' : 'Submitted';

  return {
    caseId: caseData.id,
    issue:
      (caseData.issueCategory && issueLabels[caseData.issueCategory]) ||
      'Consumer dispute — category unspecified',
    consumer: 'Demo Consumer',
    seller: caseData.parties.seller || caseData.seller || 'Unknown seller',
    marketplace: caseData.parties.marketplace || caseData.platform || undefined,
    dateCreated: caseData.createdAt,
    lastUpdated: new Date().toISOString(),
    recordCompleteness: 70,
    evidenceStatus: evStatus,
    reviewStatus,
    amount: caseData.amount ? `₹${caseData.amount}` : undefined,
    issueCategory: caseData.issueCategory || 'defective_not_as_described',
    consumerCaseId: caseData.id,
  };
}

export const statusTransitionMatrix: Record<ReviewStatus, ReviewStatus[]> = {
  New: ['Under Review', 'Needs Clarification', 'Closed'],
  'Under Review': [
    'Evidence Review',
    'Needs Clarification',
    'Ready for Assessment',
    'Complaint Drafted',
    'Closed',
  ],
  'Needs Clarification': ['Under Review', 'Evidence Review', 'Closed'],
  'Evidence Review': ['Under Review', 'Ready for Assessment', 'Needs Clarification', 'Closed'],
  'Ready for Assessment': ['Under Review', 'Complaint Drafted', 'Closed'],
  'Complaint Drafted': ['Under Review', 'Closed'],
  Closed: ['Under Review'],
};

export function canTransition(from: ReviewStatus, to: ReviewStatus): boolean {
  return statusTransitionMatrix[from]?.includes(to) ?? false;
}
