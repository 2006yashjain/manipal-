export type PurchasedType = 
  | 'goods' 
  | 'service' 
  | 'something_else' 
  | 'not_sure';

export type ConsiderationType = 
  | 'paid_in_full' 
  | 'partially_paid' 
  | 'promised' 
  | 'deferred' 
  | 'completely_free' 
  | 'not_sure';

export type PurposeType = 
  | 'personal_use' 
  | 'household_use' 
  | 'resale' 
  | 'commercial_purpose' 
  | 'self_employment_livelihood' 
  | 'mixed_purpose' 
  | 'not_sure';

export type SelfEmploymentFollowup = 
  | 'yes' 
  | 'no' 
  | 'partly' 
  | 'not_sure' 
  | null;

export type PurchaserType = 
  | 'self' 
  | 'authorised_user' 
  | 'beneficiary_user' 
  | 'someone_else' 
  | 'not_sure';

export type ChannelType = 
  | 'online_electronic' 
  | 'physical_offline' 
  | 'both' 
  | 'other' 
  | 'not_sure';

export type EligibilityStatus = 
  | 'potentially_within_definition' 
  | 'further_review_required' 
  | 'potential_statutory_exclusion';

export interface EligibilityInput {
  purchasedType: PurchasedType | null;
  purchasedDescription?: string;
  consideration: ConsiderationType | null;
  purpose: PurposeType | null;
  selfEmploymentFollowup: SelfEmploymentFollowup;
  secondaryPurposeConflicting?: PurposeType | null;
  purchaser: PurchaserType | null;
  channel: ChannelType | null;
  sellerName?: string;
  platformName?: string;
  transactionDate?: string;
  orderId?: string;
  approximateAmount?: string;
  supportingDocumentsAvailable?: boolean;
}

export interface EligibilityReasoningItem {
  dimension: string;
  fact: string;
  observation: string;
  status: 'positive' | 'neutral' | 'caution';
}

export interface EligibilityResult {
  status: EligibilityStatus;
  statusLabel: string;
  summary: string;
  legalBasis: string;
  officialSource: string;
  reasons: string[];
  reasoningItems: EligibilityReasoningItem[];
  flags: string[];
  missingInformation: string[];
  unresolvedQuestions: string[];
  rawInput: EligibilityInput;
}
