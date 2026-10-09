import { ComplaintDraft, ComplaintSection } from '../types/complaint';
import { CaseBrief } from '../types/caseBrief';
import { ConsumerCaseInput } from '../types';

export function buildComplaintDraft(
  brief: CaseBrief,
  caseData: ConsumerCaseInput
): ComplaintDraft {
  const title = `Consumer Complaint — ${brief.transaction.productService.slice(0, 40)} — ${brief.reference.id}`;

  const sections: ComplaintSection[] = [];

  sections.push({
    id: 'sec-title',
    title: '1. Complaint Title',
    editable: true,
    content:
      `Complaint before the appropriate Consumer Disputes Redressal Commission under the Consumer Protection Act, 2019.\n\n` +
      `Case Reference: ${brief.reference.id}\n` +
      `Complainant: ${brief.consumer.name}\n` +
      `Subject: Grievance regarding ${brief.transaction.productService || '[Information required]'}.`,
  });

  const oppositePartiesList = brief.oppositeParties
    .map((p, i) => `${i + 1}. ${p.name} — ${p.role} (${p.relationship})`)
    .join('\n') || '[Information required — opposite parties not listed]';

  sections.push({
    id: 'sec-consumer',
    title: '2. Complainant (Consumer) Details',
    editable: true,
    content:
      `Name: ${brief.consumer.name}\n` +
      `Role: ${brief.consumer.relationship}\n` +
      `Contact: [Information required — contact details redacted from prototype]\n` +
      `Status: ${brief.eligibility.status}`,
  });

  sections.push({
    id: 'sec-opposite',
    title: '3. Opposite Parties / Intermediaries',
    editable: true,
    content: oppositePartiesList,
  });

  const transactionBlock =
    `Product / Service: ${brief.transaction.productService || '[Information required]'}\n` +
    `Transaction value: ${brief.transaction.amount}\n` +
    (brief.transaction.marketplace ? `Marketplace / platform: ${brief.transaction.marketplace}\n` : '') +
    (brief.transaction.orderId ? `Order reference: ${brief.transaction.orderId}\n` : '') +
    (brief.transaction.purchaseDate ? `Purchase date: ${brief.transaction.purchaseDate}\n` : '') +
    `Currency: ${caseData.currency || 'INR (₹)'}`;

  sections.push({
    id: 'sec-transaction',
    title: '4. Transaction Details',
    editable: true,
    content: transactionBlock,
  });

  const statementOfFacts = buildStatementOfFacts(brief, caseData);
  sections.push({
    id: 'sec-facts',
    title: '5. Statement of Facts',
    editable: true,
    content: statementOfFacts,
    placeholders: ['[Information required]'],
  });

  const chronologyBlock = brief.chronology.length
    ? brief.chronology
        .map((e, i) => `${i + 1}. ${e.date} — ${e.event} (Source: ${e.source})`)
        .join('\n')
    : '[Information required — chronology unavailable]';

  sections.push({
    id: 'sec-chronology',
    title: '6. Chronology of Events',
    editable: true,
    content: chronologyBlock,
  });

  const issueLabels: Record<string, string> = {
    defective_not_as_described: 'Defective product / not as described',
    payment_refund_unresolved: 'Payment / refund issue — unresolved',
    product_not_delivered: 'Product not delivered / delivery failure',
  };

  const grievance =
    `Nature of grievance: ${caseData.issueCategory ? issueLabels[caseData.issueCategory] : '[Information required — issue category]'}\n\n` +
    `Complainant's account:\n${caseData.story || '[Information required — complainant statement not provided]'}\n\n` +
    (brief.disputedFacts.length
      ? `\nDisputed / inconsistent facts requiring review:\n` +
        brief.disputedFacts.map((d, i) => `${i + 1}. ${d.fact}: ${d.note}`).join('\n')
      : '');

  sections.push({
    id: 'sec-grievance',
    title: '7. Nature of Grievance',
    editable: true,
    content: grievance,
  });

  const evidenceRefs = brief.evidenceIndex
    .map(
      e =>
        `${e.refId}  ${e.filename} — ${e.type} (supports: ${e.supportsFacts.slice(0, 2).join(', ')}${e.supportsFacts.length > 2 ? ', ...' : ''})`
    )
    .join('\n') || '[Information required — no evidence documents]';

  sections.push({
    id: 'sec-evidence',
    title: '8. Evidence References (Attachments Index)',
    editable: true,
    content:
      `The complainant proposes to rely on the following documents (see attachments index below):\n\n${evidenceRefs}`,
  });

  const legalBlock = brief.legalProvisions.length
    ? brief.legalProvisions
        .map(
          (p, i) =>
            `${i + 1}. ${p.provision} — ${p.title} (${p.act})\n   Relevance: ${p.relevance.slice(0, 200)}${p.relevance.length > 200 ? '...' : ''}`
        )
        .join('\n\n')
    : '[Information required — legal provisions mapping incomplete]';

  sections.push({
    id: 'sec-legal',
    title: '9. Relevant Legal Provisions (Preliminary)',
    editable: true,
    content:
      `The following provisions may be relevant based on a preliminary screening of the available record. These are for review purposes only and do not constitute legal advice.\n\n${legalBlock}`,
  });

  sections.push({
    id: 'sec-remedy',
    title: '10. Relief / Remedy Requested',
    editable: true,
    content:
      `Requested relief (as indicated by the complainant):\n` +
      `- ${brief.requestedRemedy}\n\n` +
      `Specific prayers (draft — to be reviewed and confirmed by the complainant):\n` +
      `1. [To be reviewed] Appropriate direction to opposite parties regarding the above-stated grievance.\n` +
      `2. [To be reviewed] Any further relief(s) the Hon'ble Commission may deem fit in the facts and circumstances of the case.`,
  });

  sections.push({
    id: 'sec-declaration',
    title: '11. Declaration / Confirmation',
    editable: true,
    content:
      `I, the complainant named above, hereby state and confirm that the facts stated in this complaint are true and correct to the best of my knowledge, information, and belief.\n\n` +
      `I understand that this draft has been generated with the assistance of a prototype tool for organisational purposes only, and that I am responsible for verifying every statement before any filing.\n\n` +
      `[Signature of Complainant]\n` +
      `[Name]\n` +
      `[Date]`,
  });

  sections.push({
    id: 'sec-attachments',
    title: '12. Attachments Index',
    editable: true,
    content:
      brief.evidenceIndex.length
        ? brief.evidenceIndex
            .map(
              e =>
                `${e.refId}  ${e.filename}\n     Type: ${e.type}\n     Status: ${e.reviewStatus}`
            )
            .join('\n\n')
        : '[Information required — no attachments]',
  });

  return {
    id: `CMP-${brief.reference.id}`,
    title,
    sections,
    generatedAt: new Date().toISOString(),
    lastEditedAt: new Date().toISOString(),
    isEdited: false,
    disclaimer:
      'Draft generated for review. This is not an automatically filed complaint. Preliminary screening only — this result is based on the information provided and does not determine legal status or liability.',
  };
}

function buildStatementOfFacts(
  brief: CaseBrief,
  caseData: ConsumerCaseInput
): string {
  const lines: string[] = [];

  lines.push(
    `The complainant entered into a transaction for ${brief.transaction.productService || '[Information required]'}, through ${brief.transaction.marketplace || 'the named opposite party'}, with a total consideration of ${brief.transaction.amount}.`
  );
  lines.push('');

  if (brief.verifiedFacts.length) {
    lines.push('Verified / document-supported facts drawn from the record:');
    brief.verifiedFacts.slice(0, 6).forEach((f, i) => {
      const refs = f.evidenceRefs.length ? ` (${f.evidenceRefs.join(', ')})` : '';
      lines.push(`${i + 1}. ${f.fact}: ${f.value}${refs}`);
    });
    if (brief.verifiedFacts.length > 6) {
      lines.push(`   ... (${brief.verifiedFacts.length - 6} additional verified facts — see Case Brief)`);
    }
    lines.push('');
  }

  if (brief.userReportedFacts.length) {
    lines.push('User-reported facts (not yet independently documented):');
    brief.userReportedFacts.forEach((f, i) => {
      lines.push(`${i + 1}. ${f.fact}: ${f.value}`);
    });
    lines.push('');
  }

  if (caseData.story) {
    lines.push(`Complainant's narrative:\n${caseData.story}`);
    lines.push('');
  }

  if (brief.disputedFacts.length) {
    lines.push('Possible inconsistencies across sources (to be resolved before filing):');
    brief.disputedFacts.forEach((d, i) => {
      lines.push(`${i + 1}. ${d.fact} — ${d.note}`);
    });
    lines.push('');
  }

  if (brief.evidenceGaps.length) {
    lines.push('Known evidence gaps in the current record (to be addressed):');
    brief.evidenceGaps
      .filter(g => g.priority === 'Critical' || g.priority === 'Important')
      .forEach((g, i) => {
        lines.push(`${i + 1}. [${g.priority}] ${g.title} — ${g.missingEvidence}`);
      });
  }

  return lines.join('\n').trim() || '[Information required — statement of facts]';
}

export function updateComplaintSection(
  draft: ComplaintDraft,
  sectionId: string,
  newContent: string
): ComplaintDraft {
  return {
    ...draft,
    lastEditedAt: new Date().toISOString(),
    isEdited: true,
    sections: draft.sections.map(s =>
      s.id === sectionId
        ? { ...s, content: newContent }
        : s
    ),
  };
}

export function regenerateComplaintSection(
  draft: ComplaintDraft,
  _sectionId: string,
  fallbackContent: string
): ComplaintDraft {
  return {
    ...draft,
    lastEditedAt: new Date().toISOString(),
    isEdited: true,
    sections: draft.sections.map(s =>
      s.id === _sectionId
        ? { ...s, content: fallbackContent }
        : s
    ),
  };
}
