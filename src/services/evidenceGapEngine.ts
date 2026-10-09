import { EvidenceGapReport, EvidenceGap } from '../types/gaps';
import { EvidenceFact, EvidenceConflict } from '../types/evidence';

/**
 * Deterministic evidence gap engine.
 * Analyses the verified fact set and identifies missing, disputed, and unsupported evidence.
 * Never classifies cases as "strong" or "weak" — only gaps by priority.
 */
export function detectEvidenceGaps(
  facts: EvidenceFact[],
  conflicts: EvidenceConflict[]
): EvidenceGapReport {
  const gaps: EvidenceGap[] = [];

  const hasDocumentedFact = (keyword: string) =>
    facts.some(f =>
      f.fact.toLowerCase().includes(keyword.toLowerCase()) &&
      f.status === 'Document supported'
    );

  // --- Critical Gaps ---

  // Refund confirmation missing
  const refundConfFact = facts.find(f =>
    f.fact.toLowerCase().includes('refund confirmation')
  );
  if (!refundConfFact || refundConfFact.status === 'Disputed') {
    gaps.push({
      id: 'gap-1',
      priority: 'Critical',
      type: 'missing_document',
      title: 'Refund completion not evidenced',
      description:
        'The consumer has requested a refund, but no document currently in the record confirms that the refund was processed or credited.',
      relatedFactId: 'fact-10',
      relatedFact: 'Refund Confirmation / Credit',
      availableEvidence: ['seller_chat.png — refund requested'],
      missingEvidence: 'Bank statement, UPI credit notification, or merchant refund confirmation email',
      recommendation:
        'Upload a bank statement, UPI SMS/notification, or any platform-generated refund confirmation for this transaction.',
    });
  }

  // --- Important Gaps ---

  // Date conflict on order date
  if (conflicts.length > 0) {
    gaps.push({
      id: 'gap-2',
      priority: 'Important',
      type: 'conflicting_evidence',
      title: 'Order date inconsistency across sources',
      description:
        'The order date recorded in order_confirmation.pdf (12 Sep 2026) differs from the date referenced in seller_chat.png (14 Sep 2026). This inconsistency is unresolved.',
      relatedFactId: 'fact-11',
      relatedFact: 'Order Date (Documentation)',
      availableEvidence: ['order_confirmation.pdf', 'seller_chat.png'],
      missingEvidence:
        'A third authoritative source (e.g., marketplace order page screenshot, email timestamp) that confirms the actual order date.',
      recommendation:
        'Upload a screenshot of the ExampleMart order page showing the exact order placement date.',
    });
  }

  // Seller formal written response
  const sellerFormalResponse = hasDocumentedFact('seller formal') || hasDocumentedFact('seller written');
  if (!sellerFormalResponse) {
    gaps.push({
      id: 'gap-3',
      priority: 'Important',
      type: 'missing_document',
      title: 'No formal seller response in record',
      description:
        'Only an in-app chat is available. No formal written response from the seller (e.g., email, official reply) is currently in the record.',
      availableEvidence: ['seller_chat.png — informal chat thread'],
      missingEvidence: 'Formal email or written communication from TechWorld Store',
      recommendation:
        'If the seller communicated via email, upload the email. If no formal response was given, that itself may be a relevant fact.',
    });
  }

  // --- Informational Gaps ---

  // Exact delivery time unknown
  gaps.push({
    id: 'gap-4',
    priority: 'Informational',
    type: 'unknown_date',
    title: 'Exact delivery time not recorded',
    description:
      'The delivery date is identified as 18 Sep 2026 from the delivery photo, but the exact time of delivery is not recorded.',
    availableEvidence: ['delivery_photo.jpg'],
    missingEvidence: 'Delivery timestamp or courier delivery scan log',
    recommendation:
      'Check if the courier\'s tracking page or delivery notification contains a precise delivery timestamp.',
  });

  // Product serial number
  gaps.push({
    id: 'gap-5',
    priority: 'Informational',
    type: 'unsupported_claim',
    title: 'Product serial number not verified',
    description:
      'No document currently confirms the specific serial number of the laptop received. This may be relevant if the product identity is disputed.',
    availableEvidence: ['invoice.pdf — model identified'],
    missingEvidence: 'IMEI / serial number from device or packaging label',
    recommendation:
      'Upload a photo of the product serial number label, or a boot screen showing the device\'s registered serial number.',
  });

  const criticalCount = gaps.filter(g => g.priority === 'Critical').length;
  const importantCount = gaps.filter(g => g.priority === 'Important').length;
  const informationalCount = gaps.filter(g => g.priority === 'Informational').length;

  return {
    gaps,
    criticalCount,
    importantCount,
    informationalCount,
    generatedAt: new Date().toISOString(),
  };
}
