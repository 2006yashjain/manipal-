import {
  CaseBrief,
  CaseBriefReference,
  BriefParty,
  BriefVerifiedFact,
  BriefDisputedFact,
  BriefEvidenceIndexItem,
  BriefEvidenceGap,
  BriefInconsistency,
  BriefLegalProvision,
} from '../types/caseBrief';
import { ConsumerCaseInput } from '../types';
import { EvidenceFact, EvidenceConflict, EvidenceDocument } from '../types/evidence';
import { EvidenceGapReport } from '../types/gaps';
import { LegalMapping, PreliminaryAssessment, LegalProvision } from '../types/legal';
import { ReconstructedTimeline } from '../types/timeline';
import { EligibilityResult } from '../types/eligibility';

function generateReferenceId(): string {
  const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const seqPart = Math.floor(1 + Math.random() * 999).toString().padStart(3, '0');
  return `NYA-${datePart}-${seqPart}`;
}

export function buildCaseBrief(
  caseData: ConsumerCaseInput,
  eligibility: EligibilityResult | undefined,
  facts: EvidenceFact[],
  conflicts: EvidenceConflict[],
  documents: EvidenceDocument[],
  timeline: ReconstructedTimeline | null,
  gaps: EvidenceGapReport | null,
  legalMappings: LegalMapping[],
  legalSources: LegalProvision[],
  assessment: PreliminaryAssessment | null
): CaseBrief {
  const reference: CaseBriefReference = {
    id: generateReferenceId(),
    generatedAt: new Date().toISOString(),
    format: 'NyayaSetu AI Case Brief v1.0',
  };

  const consumer: BriefParty = {
    role: 'Complainant',
    name: 'Demo Consumer (User-reported)',
    identifier: 'Self-registered complainant',
    relationship: 'Purchaser and end-user of the product',
  };

  const oppositeParties: BriefParty[] = [];
  if (caseData.parties.seller) {
    oppositeParties.push({
      role: 'Opposite Party',
      name: caseData.parties.seller,
      identifier: 'Merchant of Record',
      relationship: 'Seller / supplier of the goods',
    });
  }
  if (caseData.parties.marketplace) {
    oppositeParties.push({
      role: 'Intermediary',
      name: caseData.parties.marketplace,
      identifier: 'E-commerce platform / marketplace',
      relationship: 'Hosted the listing and processed the order',
    });
  }
  if (caseData.parties.paymentProvider) {
    oppositeParties.push({
      role: 'Intermediary',
      name: caseData.parties.paymentProvider,
      identifier: 'Payment gateway',
      relationship: 'Processed the payment transaction',
    });
  }

  const productFact = facts.find(f => f.fact.toLowerCase().includes('product model'));
  const transaction = {
    productService: productFact?.value || caseData.story.slice(0, 60) || 'Goods purchased (user-reported)',
    amount: caseData.amount ? `₹${caseData.amount}` : '[Information required]',
    marketplace: caseData.parties.marketplace || caseData.platform || undefined,
    orderId: caseData.orderId || undefined,
    purchaseDate: caseData.purchaseDate || undefined,
  };

  const eligibilityBlock = {
    status: eligibility?.statusLabel || 'Further review required',
    summary:
      eligibility?.summary ||
      'Eligibility screening not completed. Preliminary consumer status — further review recommended.',
  };

  const chronology = timeline
    ? timeline.events.map(e => ({
        date: e.date,
        event: e.event,
        source: e.source,
      }))
    : [];

  const verifiedFacts: BriefVerifiedFact[] = facts
    .filter(f => f.status === 'Document supported' || f.status === 'User corrected')
    .map(f => ({
      fact: f.fact,
      value: f.isCorrected ? f.correctedValue || f.value : f.value,
      status: f.isCorrected ? 'User corrected' : f.status,
      evidenceRefs: docNameToRefIds(documents, [f.source]),
    }));

  const userReportedFacts: BriefVerifiedFact[] = facts
    .filter(f => f.status === 'Consumer reported')
    .map(f => ({
      fact: f.fact,
      value: f.value,
      status: f.status,
      evidenceRefs: [],
    }));

  const disputedFacts: BriefDisputedFact[] = conflicts.map(c => ({
    fact: c.factName,
    valueA: c.valueA,
    sourceA: c.sourceA,
    valueB: c.valueB,
    sourceB: c.sourceB,
    note: c.neutralObservation,
  }));

  const evidenceIndex: BriefEvidenceIndexItem[] = documents.map((d, i) => {
    const refs = docRef(i + 1);
    const supportedFactIds = facts
      .filter(f => f.source && f.source === d.filename)
      .map(f => f.fact);
    return {
      refId: refs,
      filename: d.filename,
      type: d.category,
      source: `Uploaded ${d.uploadedAt}`,
      supportsFacts: supportedFactIds.length ? supportedFactIds : ['No extracted facts currently linked'],
      reviewStatus: d.processingStatus === 'processed' ? 'Accepted' : 'Needs review',
    };
  });

  const evidenceGaps: BriefEvidenceGap[] = gaps
    ? gaps.gaps.map(g => ({
        priority: g.priority,
        title: g.title,
        description: g.description,
        missingEvidence: g.missingEvidence,
        recommendation: g.recommendation,
      }))
    : [];

  const inconsistencies: BriefInconsistency[] = conflicts.map(c => ({
    title: c.factName,
    description: c.neutralObservation,
    sources: [c.sourceA, c.sourceB],
  }));

  const legalProvisions: BriefLegalProvision[] = legalMappings.map(m => {
    const src = legalSources.find(l => l.id === m.provisionId);
    return {
      provision: src?.provision || m.provisionId,
      title: src?.title || m.factorLabel,
      act: src?.act || 'Consumer Protection Act, 2019 (provisional reference)',
      relevance: m.relevanceReason,
    };
  });

  const requestedRemedy = caseData.remedies && caseData.remedies.length
    ? caseData.remedies.join(', ')
    : '[Information required — remedy not specified]';

  const limitations = [
    'Preliminary screening only. This result is based on the information provided and does not determine legal status or liability.',
    'Draft generated for review. This is not an automatically filed complaint.',
    'This case brief is produced by a prototype tool using deterministic local data. No real OCR, LLM, or court system integration was used.',
    'The complainant must independently verify all facts, figures, and references before use.',
    ...(assessment?.limitations || []),
  ];

  return {
    reference,
    consumer,
    oppositeParties,
    transaction,
    eligibility: eligibilityBlock,
    chronology,
    verifiedFacts,
    userReportedFacts,
    disputedFacts,
    evidenceIndex,
    evidenceGaps,
    inconsistencies,
    legalProvisions,
    preliminaryAssessment:
      assessment?.summary ||
      'Preliminary assessment pending — further review of facts and evidence is recommended.',
    requestedRemedy,
    limitations,
    generatedAt: new Date().toISOString(),
  };
}

function docRef(index: number): string {
  return `[E-${String(index).padStart(2, '0')}]`;
}

function docNameToRefIds(
  documents: EvidenceDocument[],
  names: string[]
): string[] {
  const result: string[] = [];
  names.forEach(n => {
    const idx = documents.findIndex(d => d.filename === n);
    if (idx >= 0) result.push(docRef(idx + 1));
  });
  return result;
}
