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
}

export interface CaseCompletenessItem {
  id: string;
  label: string;
  isComplete: boolean;
  isUpcoming?: boolean;
}
