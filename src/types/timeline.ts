export type TimelineEventStatus =
  | 'Document supported'
  | 'Consumer reported'
  | 'Inferred'
  | 'Disputed'
  | 'Needs review';

export interface TimelineEvent {
  id: string;
  date: string;           // ISO date or human readable (e.g. "12 Sep 2026")
  event: string;
  entity: string;
  source: string;
  status: TimelineEventStatus;
  conflictNote?: string;  // If the date/event is disputed
  alternateDate?: string; // Alternate date from conflicting source
  alternateSource?: string;
}

export interface ReconstructedTimeline {
  events: TimelineEvent[];
  hasConflicts: boolean;
  generatedAt: string;
}
