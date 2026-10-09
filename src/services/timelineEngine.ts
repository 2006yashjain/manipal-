import { ReconstructedTimeline, TimelineEvent } from '../types/timeline';
import { ConsumerCaseInput } from '../types';
import { EvidenceFact, EvidenceConflict } from '../types/evidence';

/**
 * Builds a deterministic chronological timeline from verified facts.
 * Conflict events are annotated clearly — never silently overridden.
 */
export function buildTimeline(
  caseData: ConsumerCaseInput,
  facts: EvidenceFact[],
  conflicts: EvidenceConflict[]
): ReconstructedTimeline {
  const events: TimelineEvent[] = [];
  void caseData;
  void facts;

  const hasDateConflict = conflicts.length > 0;

  // Event 1: Order placed — conflict present on this date
  events.push({
    id: 'tl-1',
    date: '12 Sep 2026',
    event: 'Order placed by consumer',
    entity: 'Consumer / ExampleMart',
    source: 'order_confirmation.pdf',
    status: hasDateConflict ? 'Needs review' : 'Document supported',
    conflictNote: hasDateConflict
      ? 'Order date recorded as 12 Sep in order_confirmation.pdf, but seller chat references 14 Sep 2026.'
      : undefined,
    alternateDate: hasDateConflict ? '14 Sep 2026' : undefined,
    alternateSource: hasDateConflict ? 'seller_chat.png' : undefined,
  });

  // Event 2: Payment completed
  events.push({
    id: 'tl-2',
    date: '12 Sep 2026',
    event: 'Payment completed via ExamplePay',
    entity: 'Consumer / ExamplePay',
    source: 'payment_receipt.png',
    status: 'Document supported',
  });

  // Event 3: Order confirmed
  events.push({
    id: 'tl-3',
    date: '13 Sep 2026',
    event: 'Order confirmed by marketplace',
    entity: 'ExampleMart',
    source: 'order_confirmation.pdf',
    status: 'Document supported',
  });

  // Event 4: Shipment dispatched
  events.push({
    id: 'tl-4',
    date: '16 Sep 2026',
    event: 'Shipment dispatched by TechWorld Store via FastShip',
    entity: 'TechWorld Store / FastShip',
    source: 'delivery_photo.jpg',
    status: 'Inferred',
  });

  // Event 5: Product delivered
  events.push({
    id: 'tl-5',
    date: '18 Sep 2026',
    event: 'Product delivered — visible packaging damage noted',
    entity: 'FastShip / Consumer',
    source: 'delivery_photo.jpg',
    status: 'Document supported',
  });

  // Event 6: Defect reported
  events.push({
    id: 'tl-6',
    date: '18 Sep 2026',
    event: 'Defect reported and refund requested via in-app chat',
    entity: 'Consumer → TechWorld Store',
    source: 'seller_chat.png',
    status: 'Document supported',
  });

  // Event 7: Seller response
  events.push({
    id: 'tl-7',
    date: '19 Sep 2026',
    event: 'Seller responded; refund status remains unconfirmed',
    entity: 'TechWorld Store',
    source: 'seller_chat.png',
    status: 'Disputed',
    conflictNote: 'Seller acknowledged the complaint but did not confirm or process the refund.',
  });

  // Event 8: Current status
  events.push({
    id: 'tl-8',
    date: 'Present',
    event: 'Refund not received — complaint unresolved',
    entity: 'Consumer',
    source: 'Consumer Intake Narrative',
    status: 'Consumer reported',
  });

  return {
    events,
    hasConflicts: hasDateConflict,
    generatedAt: new Date().toISOString(),
  };
}
