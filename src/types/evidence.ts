import { ProvenanceStatus } from './index';

export type EvidenceCategory = 
  | 'Invoice'
  | 'Payment receipt'
  | 'Order confirmation'
  | 'Delivery record'
  | 'Product photo'
  | 'Chat / message'
  | 'Email'
  | 'Refund / cancellation record'
  | 'Other';

export type FileFormat = 'PDF' | 'PNG' | 'JPG' | 'JPEG';

export type ProcessingStatus = 'uploaded' | 'processing' | 'processed' | 'needs_review';

export interface EvidenceDocument {
  id: string;
  filename: string;
  category: EvidenceCategory;
  fileType: FileFormat;
  fileSize: string;
  uploadStatus: 'uploaded' | 'pending';
  processingStatus: ProcessingStatus;
  uploadedAt: string;
}

export interface EvidenceSource {
  documentId: string;
  filename: string;
  page?: string | number;
  location?: string;
}

export interface EvidenceFact {
  id: string;
  fact: string;
  value: string;
  status: ProvenanceStatus | 'User corrected';
  source: string;
  sourceLocation: string;
  originalValue: string;
  correctedValue?: string;
  isCorrected: boolean;
  hasConflict?: boolean;
  conflictDetails?: string;
}

export interface EvidenceConflict {
  id: string;
  factName: string;
  sourceA: string;
  valueA: string;
  sourceB: string;
  valueB: string;
  status: 'Needs review';
  description: string;
  neutralObservation: string;
}

export interface EvidenceState {
  documents: EvidenceDocument[];
  facts: EvidenceFact[];
  conflicts: EvidenceConflict[];
  isProcessing: boolean;
  currentStepIndex: number;
}
