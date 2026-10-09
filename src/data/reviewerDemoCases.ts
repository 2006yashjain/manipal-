import { ReviewerCaseRecord } from '../types/reviewer';
import { CaseRecord, ConsumerCaseInput, EvidenceDocument, EvidenceFact, EvidenceConflict } from '../types';
import { syntheticDemoDocuments, syntheticExtractedFacts, syntheticConflicts } from './demoEvidence';
import { buildTruthGraph } from '../services/truthGraphEngine';
import { buildTimeline } from '../services/timelineEngine';
import { detectEvidenceGaps } from '../services/evidenceGapEngine';
import { mapLegalFactors, generatePreliminaryAssessment } from '../services/legalAnalysisEngine';
import { buildCaseBrief } from '../services/caseBriefEngine';
import { buildComplaintDraft } from '../services/complaintEngine';
import { legalSources } from './legalSources';

function buildFullCaseRecord(
  base: Partial<ConsumerCaseInput> & { id: string; issueCategory: any; remedies: any },
  docs: EvidenceDocument[],
  facts: EvidenceFact[],
  conflicts: EvidenceConflict[]
): CaseRecord {
  const input: ConsumerCaseInput = {
    id: base.id,
    orderId: base.orderId || '',
    purchaseDate: base.purchaseDate || '',
    platform: base.platform || '',
    seller: base.seller || '',
    amount: base.amount || '',
    currency: base.currency || 'INR (₹)',
    story: base.story || '',
    issueCategory: base.issueCategory,
    remedies: base.remedies,
    parties: {
      marketplace: base.parties?.marketplace || base.platform || '',
      seller: base.parties?.seller || base.seller || '',
      paymentProvider: base.parties?.paymentProvider || '',
      logistics: base.parties?.logistics || '',
      other: base.parties?.other || '',
    },
    consentGiven: base.consentGiven ?? true,
    status: 'ready_for_evidence',
    createdAt: base.createdAt || new Date().toISOString().split('T')[0],
    consumerEligibility: base.consumerEligibility || null,
  };

  const graph = buildTruthGraph(input, facts);
  const tl = buildTimeline(input, facts, conflicts);
  const gaps = detectEvidenceGaps(facts, conflicts);
  const mappings = mapLegalFactors(facts, input, gaps.gaps);
  const assessment = generatePreliminaryAssessment(facts, mappings, gaps.gaps, conflicts, input);
  const brief = buildCaseBrief(
    input,
    undefined,
    facts,
    conflicts,
    docs,
    tl,
    gaps,
    mappings,
    legalSources,
    assessment
  );
  const complaint = buildComplaintDraft(brief, input);

  return {
    ...input,
    evidenceDocuments: docs,
    evidenceFacts: facts,
    evidenceConflicts: conflicts,
    timelineEvents: tl,
    truthGraph: graph,
    evidenceGapReport: gaps,
    legalMappings: mappings,
    preliminaryAssessment: assessment,
    caseBrief: brief,
    complaint,
    review: {
      reviewStatus: 'New',
      reviewerNotes: [],
      activityLog: [
        {
          id: 'seed-1',
          timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
          actor: 'System',
          event: 'Case created by consumer',
          category: 'Case created',
        },
        {
          id: 'seed-2',
          timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(),
          actor: 'System',
          event: 'Evidence uploaded',
          category: 'Evidence uploaded',
        },
      ],
      flaggedEvidence: [],
      clarificationRequests: [],
      assignedReviewer: 'Demo Reviewer',
    },
  };
}

// ============ CASE 1: Defective laptop (Under Review) ============
const case1Input: any = {
  id: 'CASE-NS-2026-101',
  orderId: 'ORD-78291',
  purchaseDate: '2026-09-12',
  platform: 'ExampleMart',
  seller: 'TechWorld Store',
  amount: '54,999',
  currency: 'INR (₹)',
  story: 'I ordered a Dell Inspiron 15 laptop from ExampleMart. The package arrived with visible damage. I contacted the seller and requested a refund, but the refund has not been confirmed.',
  issueCategory: 'defective_not_as_described',
  remedies: ['Refund'],
  parties: {
    marketplace: 'ExampleMart',
    seller: 'TechWorld Store',
    paymentProvider: 'ExamplePay',
    logistics: 'FastShip',
  },
  consentGiven: true,
  createdAt: '2026-10-08',
};

export const case1Record: CaseRecord = buildFullCaseRecord(
  case1Input,
  syntheticDemoDocuments,
  syntheticExtractedFacts,
  syntheticConflicts
);

case1Record.review!.reviewStatus = 'Under Review';
case1Record.review!.reviewerNotes = [
  {
    id: 'note-101-a',
    author: 'Demo Reviewer',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    note: 'Evidence bundle looks mostly complete. Invoice, payment receipt and order confirmation are in order.',
    relatedCaseElement: 'Evidence Overview',
  },
  {
    id: 'note-101-b',
    author: 'Demo Reviewer',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    note: 'Payment confirmation should be verified against the transaction record before drafting the final complaint.',
    relatedCaseElement: 'Payment Evidence',
  },
];
case1Record.review!.activityLog.push(
  {
    id: 'seed-3',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    actor: 'Demo Reviewer',
    event: 'Case opened for review',
    category: 'Reviewer opened',
  },
  {
    id: 'seed-4',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    actor: 'Demo Reviewer',
    event: 'Added note on evidence completeness',
    category: 'Note added',
  }
);
case1Record.review!.flaggedEvidence = [
  {
    evidenceId: 'doc-2',
    flagged: true,
    flagReason: 'UPI reference visible but timestamp not clearly legible — recommend verifying against bank statement.',
    status: 'Flagged',
    flaggedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    flaggedBy: 'Demo Reviewer',
  },
];

export const case1QueueItem: ReviewerCaseRecord = {
  caseId: 'CASE-NS-2026-101',
  issue: 'Defective / not as described',
  consumer: 'Demo Consumer (R. Sharma)',
  seller: 'TechWorld Store',
  marketplace: 'ExampleMart',
  dateCreated: '2026-10-08',
  lastUpdated: new Date(Date.now() - 3600000 * 2).toISOString(),
  recordCompleteness: 86,
  evidenceStatus: 'Verified',
  reviewStatus: 'Under Review',
  amount: '₹54,999',
  issueCategory: 'defective_not_as_described',
  consumerCaseId: 'CASE-NS-2026-101',
};

// ============ CASE 2: Refund unresolved (Needs Clarification) ============
const case2Docs: EvidenceDocument[] = [
  {
    id: 'c2-doc-1',
    filename: 'invoice_headphones.pdf',
    category: 'Invoice',
    fileType: 'PDF',
    fileSize: '180 KB',
    uploadStatus: 'uploaded',
    processingStatus: 'processed',
    uploadedAt: '2026-10-07 11:12',
  },
  {
    id: 'c2-doc-2',
    filename: 'payment_confirm.png',
    category: 'Payment receipt',
    fileType: 'PNG',
    fileSize: '310 KB',
    uploadStatus: 'uploaded',
    processingStatus: 'processed',
    uploadedAt: '2026-10-07 11:13',
  },
  {
    id: 'c2-doc-3',
    filename: 'return_request.png',
    category: 'Refund / cancellation record',
    fileType: 'PNG',
    fileSize: '410 KB',
    uploadStatus: 'uploaded',
    processingStatus: 'processed',
    uploadedAt: '2026-10-07 11:14',
  },
];

const case2Facts: EvidenceFact[] = [
  {
    id: 'c2-fact-1',
    fact: 'Product Purchased',
    value: 'SoundWave X Headphones',
    status: 'Document supported',
    source: 'invoice_headphones.pdf',
    sourceLocation: 'Line Item 1',
    originalValue: 'SoundWave X Headphones',
    isCorrected: false,
  },
  {
    id: 'c2-fact-2',
    fact: 'Transaction Amount',
    value: '₹8,999',
    status: 'Document supported',
    source: 'invoice_headphones.pdf',
    sourceLocation: 'Total Line',
    originalValue: '₹8,999',
    isCorrected: false,
  },
  {
    id: 'c2-fact-3',
    fact: 'Seller',
    value: 'AudioHub India',
    status: 'Document supported',
    source: 'invoice_headphones.pdf',
    sourceLocation: 'Merchant Block',
    originalValue: 'AudioHub India',
    isCorrected: false,
  },
  {
    id: 'c2-fact-4',
    fact: 'Payment Method',
    value: 'Credit Card (ExampleCard ****4821)',
    status: 'Document supported',
    source: 'payment_confirm.png',
    sourceLocation: 'Authorization Summary',
    originalValue: 'Credit Card (ExampleCard ****4821)',
    isCorrected: false,
  },
  {
    id: 'c2-fact-5',
    fact: 'Return Request Date',
    value: '22 September 2026',
    status: 'Document supported',
    source: 'return_request.png',
    sourceLocation: 'Return ID: RT-4412',
    originalValue: '22 September 2026',
    isCorrected: false,
  },
  {
    id: 'c2-fact-6',
    fact: 'Refund Status',
    value: 'Awaiting seller confirmation for 14+ days',
    status: 'Consumer reported',
    source: 'Consumer Intake Narrative',
    sourceLocation: 'Initial narrative',
    originalValue: 'Awaiting seller confirmation for 14+ days',
    isCorrected: false,
  },
  {
    id: 'c2-fact-7',
    fact: 'Reverse Pickup Completion',
    value: 'Unknown / Not Confirmed',
    status: 'Unknown',
    source: 'return_request.png',
    sourceLocation: 'Status section',
    originalValue: 'Unknown / Not Confirmed',
    isCorrected: false,
  },
];

const case2Conflicts: EvidenceConflict[] = [];

const case2Input: any = {
  id: 'CASE-NS-2026-202',
  orderId: 'ORD-AU-55612',
  purchaseDate: '2026-09-04',
  platform: 'ShopHub',
  seller: 'AudioHub India',
  amount: '8,999',
  currency: 'INR (₹)',
  story: 'I purchased SoundWave X headphones on ShopHub. The audio quality was poor so I raised a return within the return window. The reverse pickup was supposed to happen, but the seller has not confirmed refund status for over two weeks.',
  issueCategory: 'payment_refund_unresolved',
  remedies: ['Refund'],
  parties: {
    marketplace: 'ShopHub',
    seller: 'AudioHub India',
    paymentProvider: 'ExampleCard',
    logistics: 'QuickShip',
  },
  consentGiven: true,
  createdAt: '2026-10-07',
};

export const case2Record: CaseRecord = buildFullCaseRecord(case2Input, case2Docs, case2Facts, case2Conflicts);
case2Record.review!.reviewStatus = 'Needs Clarification';
case2Record.review!.clarificationRequests = [
  {
    id: 'clar-202-1',
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    requestedBy: 'Demo Reviewer',
    subject: 'Reverse Pickup Proof',
    description: 'Please upload the reverse pickup acknowledgment or courier receipt showing that the item was picked up from your address.',
    relatedTo: 'Return / Refund Evidence',
    status: 'Pending',
  },
];
case2Record.review!.activityLog.push(
  {
    id: 'c2-act-1',
    timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(),
    actor: 'Demo Reviewer',
    event: 'Case opened — clarification requested',
    category: 'Reviewer opened',
  },
  {
    id: 'c2-act-2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    actor: 'Demo Reviewer',
    event: 'Requested reverse pickup proof from complainant',
    category: 'Clarification requested',
  }
);

export const case2QueueItem: ReviewerCaseRecord = {
  caseId: 'CASE-NS-2026-202',
  issue: 'Refund unresolved',
  consumer: 'Demo Consumer (P. Kumar)',
  seller: 'AudioHub India',
  marketplace: 'ShopHub',
  dateCreated: '2026-10-07',
  lastUpdated: new Date(Date.now() - 86400000).toISOString(),
  recordCompleteness: 62,
  evidenceStatus: 'Partial',
  reviewStatus: 'Needs Clarification',
  amount: '₹8,999',
  issueCategory: 'payment_refund_unresolved',
  consumerCaseId: 'CASE-NS-2026-202',
};

// ============ CASE 3: Product not delivered (Evidence Review) ============
const case3Docs: EvidenceDocument[] = [
  {
    id: 'c3-doc-1',
    filename: 'order_screenshot.png',
    category: 'Order confirmation',
    fileType: 'PNG',
    fileSize: '520 KB',
    uploadStatus: 'uploaded',
    processingStatus: 'processed',
    uploadedAt: '2026-10-06 09:00',
  },
  {
    id: 'c3-doc-2',
    filename: 'upi_sms.jpg',
    category: 'Payment receipt',
    fileType: 'JPG',
    fileSize: '680 KB',
    uploadStatus: 'uploaded',
    processingStatus: 'processed',
    uploadedAt: '2026-10-06 09:01',
  },
];

const case3Facts: EvidenceFact[] = [
  {
    id: 'c3-fact-1',
    fact: 'Product',
    value: 'FitZone Smart Watch Pro',
    status: 'Document supported',
    source: 'order_screenshot.png',
    sourceLocation: 'Cart summary',
    originalValue: 'FitZone Smart Watch Pro',
    isCorrected: false,
  },
  {
    id: 'c3-fact-2',
    fact: 'Amount Paid',
    value: '₹12,499',
    status: 'Document supported',
    source: 'upi_sms.jpg',
    sourceLocation: 'SMS body',
    originalValue: '₹12,499',
    isCorrected: false,
  },
  {
    id: 'c3-fact-3',
    fact: 'Order Date',
    value: '20 September 2026',
    status: 'Document supported',
    source: 'order_screenshot.png',
    sourceLocation: 'Header',
    originalValue: '20 September 2026',
    isCorrected: false,
  },
  {
    id: 'c3-fact-4',
    fact: 'Promised Delivery Date',
    value: '25 September 2026',
    status: 'Consumer reported',
    source: 'order_screenshot.png',
    sourceLocation: 'Delivery estimate',
    originalValue: '25 September 2026',
    isCorrected: false,
  },
  {
    id: 'c3-fact-5',
    fact: 'Actual Delivery Status',
    value: 'Not delivered — no tracking update since 23 Sep',
    status: 'Consumer reported',
    source: 'Consumer Intake Narrative',
    sourceLocation: 'Story',
    originalValue: 'Not delivered — no tracking update since 23 Sep',
    isCorrected: false,
  },
  {
    id: 'c3-fact-6',
    fact: 'Seller Name',
    value: 'WearLife Official Store',
    status: 'Document supported',
    source: 'order_screenshot.png',
    sourceLocation: 'Merchant name',
    originalValue: 'WearLife Official Store',
    isCorrected: false,
  },
];

const case3Conflicts: EvidenceConflict[] = [];

const case3Input: any = {
  id: 'CASE-NS-2026-303',
  orderId: 'ORD-FZ-99332',
  purchaseDate: '2026-09-20',
  platform: 'BigDeal',
  seller: 'WearLife Official Store',
  amount: '12,499',
  currency: 'INR (₹)',
  story: 'I ordered a FitZone Smart Watch Pro from BigDeal on 20 Sep, paid via UPI. The delivery was promised by 25 Sep. Since 23 Sep the courier tracking has not updated, and the seller is not responding to messages. The product was never delivered.',
  issueCategory: 'product_not_delivered',
  remedies: ['Refund', 'Delivery'],
  parties: {
    marketplace: 'BigDeal',
    seller: 'WearLife Official Store',
    paymentProvider: 'UPI (ExamplePay)',
    logistics: 'RapidX Couriers',
  },
  consentGiven: true,
  createdAt: '2026-10-06',
};

export const case3Record: CaseRecord = buildFullCaseRecord(case3Input, case3Docs, case3Facts, case3Conflicts);
case3Record.review!.reviewStatus = 'Evidence Review';
case3Record.review!.reviewerNotes = [
  {
    id: 'c3-note-1',
    author: 'Demo Reviewer',
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    note: 'Evidence of payment is present, but evidence of non-delivery is based on consumer report only. Courier tracking screenshot is recommended.',
    relatedCaseElement: 'Delivery Evidence',
  },
];
case3Record.review!.flaggedEvidence = [
  {
    evidenceId: 'c3-doc-1',
    flagged: true,
    flagReason: 'Order screenshot does not show tracking number or courier partner. Need courier tracking page screenshot.',
    status: 'Needs verification',
    flaggedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    flaggedBy: 'Demo Reviewer',
  },
];
case3Record.review!.activityLog.push(
  {
    id: 'c3-act-1',
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    actor: 'Demo Reviewer',
    event: 'Case opened for evidence review',
    category: 'Reviewer opened',
  },
  {
    id: 'c3-act-2',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    actor: 'Demo Reviewer',
    event: 'Flagged order screenshot — tracking evidence missing',
    category: 'Evidence flagged',
  }
);

export const case3QueueItem: ReviewerCaseRecord = {
  caseId: 'CASE-NS-2026-303',
  issue: 'Product not delivered',
  consumer: 'Demo Consumer (S. Iyer)',
  seller: 'WearLife Official Store',
  marketplace: 'BigDeal',
  dateCreated: '2026-10-06',
  lastUpdated: new Date(Date.now() - 3600000 * 18).toISOString(),
  recordCompleteness: 54,
  evidenceStatus: 'Partial',
  reviewStatus: 'Evidence Review',
  amount: '₹12,499',
  issueCategory: 'product_not_delivered',
  consumerCaseId: 'CASE-NS-2026-303',
};

// Full queue
export const reviewerCaseQueue: ReviewerCaseRecord[] = [
  case1QueueItem,
  case2QueueItem,
  case3QueueItem,
];

export const reviewerCaseRecords: Record<string, CaseRecord> = {
  [case1Record.id]: case1Record,
  [case2Record.id]: case2Record,
  [case3Record.id]: case3Record,
};

export function getReviewerCaseById(id: string): CaseRecord | undefined {
  return reviewerCaseRecords[id];
}

export function isReviewerCase(id: string): boolean {
  return !!reviewerCaseRecords[id];
}
