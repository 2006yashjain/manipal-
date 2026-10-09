import { LegalMapping, PreliminaryAssessment, SupportedFact, UnsupportedClaim } from '../types/legal';
import { EvidenceFact, EvidenceConflict } from '../types/evidence';
import { EvidenceGap } from '../types/gaps';
import { ConsumerCaseInput } from '../types';

/**
 * Maps verified case facts to potentially relevant legal provisions.
 * This is a deterministic rule-based engine — NOT an LLM.
 * Output language must remain preliminary and non-conclusive.
 */
export function mapLegalFactors(
  facts: EvidenceFact[],
  caseData: ConsumerCaseInput,
  _gaps: EvidenceGap[]
): LegalMapping[] {
  const mappings: LegalMapping[] = [];

  const findFact = (kw: string) =>
    facts.find(f => f.fact.toLowerCase().includes(kw.toLowerCase()));

  const amountFact = findFact('Amount');
  const purposeFact = findFact('Usage Purpose');
  const productFact = findFact('Product Model');
  const conditionFact = findFact('Physical Condition');

  // Mapping 1: Section 2(7) — Consumer definition
  mappings.push({
    id: 'map-1',
    provisionId: 'cpa-2019-s2-7',
    factIds: ['fact-1', 'fact-12', 'fact-6'],
    evidenceIds: ['doc-1', 'doc-2'],
    factorLabel: 'Consumer status — purpose and consideration',
    caseFact:
      `Consumer purchased a ${productFact?.value || 'Dell Inspiron 15'} for ₹${caseData.amount || '54,999'} from ${caseData.parties.seller || 'TechWorld Store'} for ${purposeFact?.value || 'personal / domestic computing'}.`,
    relevanceReason:
      'The purpose of the transaction (personal use) and the payment of consideration are relevant factors when considering whether the transaction may fall within the statutory concept of a consumer transaction under Section 2(7) of the Consumer Protection Act, 2019. This is a preliminary observation based on the information provided.',
    missingInformation: [
      'Formal confirmation that the purchase was exclusively for personal/domestic use',
    ],
    conflicts: [],
  });

  // Mapping 2: Section 2(47) — Unfair trade practice
  if (conditionFact) {
    mappings.push({
      id: 'map-2',
      provisionId: 'cpa-2019-s2-34',
      factIds: ['fact-6', 'fact-8'],
      evidenceIds: ['doc-1', 'doc-4'],
      factorLabel: 'Product not as described',
      caseFact:
        `The product delivered (${productFact?.value || 'Dell Inspiron 15'}) arrived with visible outer packaging damage and display casing fracture, potentially inconsistent with the described condition at the time of sale.`,
      relevanceReason:
        'Whether goods delivered match the description at the time of sale is potentially relevant to provisions relating to unfair trade practices. The available evidence documents the physical condition of the product on arrival. Further review of the original product listing may be required.',
      missingInformation: [
        'Original product listing or description at time of sale',
        'Manufacturer warranty documentation',
      ],
      conflicts: [],
    });
  }

  // Mapping 3: Section 2(11) — Deficiency in service
  mappings.push({
    id: 'map-3',
    provisionId: 'cpa-2019-s2-11',
    factIds: ['fact-9', 'fact-10'],
    evidenceIds: ['doc-5'],
    factorLabel: 'Unresolved refund and seller non-response',
    caseFact:
      'A refund was requested by the consumer via in-app chat. The refund has not been confirmed or credited by the seller as of the current record.',
    relevanceReason:
      'The failure to process a requested refund following a reported defect may be potentially relevant to the statutory concept of deficiency in service under Section 2(11). The current record documents the request but does not contain evidence of a resolution. This is preliminary and does not determine liability.',
    missingInformation: [
      'Refund confirmation, credit note, or bank credit notification',
      'Formal written seller communication regarding the refund decision',
    ],
    conflicts: [
      'Refund status is reported as disputed — no document currently confirms or denies completion.',
    ],
  });

  // Mapping 4: Section 35 — Filing threshold
  if (amountFact) {
    mappings.push({
      id: 'map-4',
      provisionId: 'cpa-2019-s35',
      factIds: ['fact-1'],
      evidenceIds: ['doc-1'],
      factorLabel: 'Complaint forum jurisdiction — transaction value',
      caseFact: `Transaction value: ₹${caseData.amount || '54,999'} as recorded in invoice.pdf.`,
      relevanceReason:
        'The transaction value is relevant when considering which consumer disputes redressal forum may have jurisdiction. Section 35 sets the threshold for District Commission jurisdiction at ₹50 lakh. The transaction value of ₹54,999 is potentially within this threshold, though the final determination depends on the total compensation claimed.',
      missingInformation: [
        'Final claim amount (may include compensation beyond transaction value)',
      ],
      conflicts: [],
    });
  }

  // Mapping 5: Section 2(9)(i) — Right to be protected
  if (conditionFact) {
    mappings.push({
      id: 'map-5',
      provisionId: 'cpa-2019-s2-6',
      factIds: ['fact-8', 'fact-6'],
      evidenceIds: ['doc-4', 'doc-1'],
      factorLabel: 'Right to receive goods in described condition',
      caseFact:
        'The product was delivered with visible physical damage to packaging and casing, which may be inconsistent with the consumer\'s right to receive goods in the described and expected condition.',
      relevanceReason:
        'Consumer rights provisions are potentially relevant where goods are delivered in a materially different condition from what was described or reasonably expected. This is a preliminary observation only.',
      missingInformation: [
        'Product listing at time of purchase showing described condition',
      ],
      conflicts: [],
    });
  }

  return mappings;
}

/**
 * Generates an explainable preliminary assessment — NOT a legal verdict.
 * Uses language such as "currently indicates", "available evidence suggests", "further review required".
 */
export function generatePreliminaryAssessment(
  facts: EvidenceFact[],
  mappings: LegalMapping[],
  gaps: EvidenceGap[],
  conflicts: EvidenceConflict[],
  _caseData: ConsumerCaseInput
): PreliminaryAssessment {

  const supportedFacts: SupportedFact[] = facts
    .filter(f => f.status === 'Document supported' || f.status === 'User corrected')
    .map(f => ({
      factId: f.id,
      fact: f.fact,
      value: f.isCorrected ? (f.correctedValue || f.value) : f.value,
      evidenceSource: f.source,
      status: f.isCorrected ? 'User corrected' : f.status,
    }));

  const unsupportedClaims: UnsupportedClaim[] = [
    {
      claim: 'Refund was completed or credited',
      reason:
        'No document in the current record confirms that the refund requested by the consumer was processed or credited by the seller.',
      relatedGap: 'gap-1',
    },
    {
      claim: 'Seller formally acknowledged liability',
      reason:
        'The available seller chat shows a response but does not contain a formal acknowledgment of any obligation to refund or repair.',
    },
  ];

  return {
    summary:
      'The available record indicates that the transaction involved a paid purchase of goods (Dell Inspiron 15) for personal use, from TechWorld Store via ExampleMart, for ₹54,999. The available documentary evidence supports the order placement, payment completion, and delivery events. The record also documents a consumer complaint regarding the physical condition of the product on arrival and a subsequent refund request. However, the record currently lacks documentary evidence confirming the completion or processing of the requested refund. A date inconsistency has been identified between two sources and has not been resolved. These observations are preliminary and are based solely on the information and documents currently available.',
    relevantProvisionIds: mappings.map(m => m.provisionId),
    supportedFacts,
    unsupportedClaims,
    evidenceGapIds: gaps.map(g => g.id),
    conflicts: conflicts.map(c => c.neutralObservation),
    limitations: [
      'This is a prototype analysis based on structured mock data and does not use real AI or OCR.',
      'This analysis does not constitute legal advice.',
      'This analysis does not determine liability, guilt, or the outcome of any dispute.',
      'Additional facts or documents not currently in the record may materially affect the analysis.',
      'An advocate or legal professional should review the full record before any action is taken.',
    ],
    generatedAt: new Date().toISOString(),
  };
}
