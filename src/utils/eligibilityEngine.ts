import {
  EligibilityInput,
  EligibilityResult,
  EligibilityStatus,
  EligibilityReasoningItem
} from '../types/eligibility';

export const initialEligibilityInput: EligibilityInput = {
  purchasedType: null,
  purchasedDescription: '',
  consideration: null,
  purpose: null,
  selfEmploymentFollowup: null,
  secondaryPurposeConflicting: null,
  purchaser: null,
  channel: null,
  sellerName: '',
  platformName: '',
  transactionDate: '',
  orderId: '',
  approximateAmount: '',
  supportingDocumentsAvailable: true,
};

export function evaluateConsumerEligibility(input: EligibilityInput): EligibilityResult {
  const reasons: string[] = [];
  const flags: string[] = [];
  const missingInformation: string[] = [];
  const unresolvedQuestions: string[] = [];
  const reasoningItems: EligibilityReasoningItem[] = [];

  let status: EligibilityStatus = 'potentially_within_definition';

  // 1. Evaluate Purchased Item
  if (!input.purchasedType || input.purchasedType === 'not_sure') {
    missingInformation.push('Nature of purchased item/service');
    unresolvedQuestions.push('Whether the subject matter constitutes goods or services under Section 2(7).');
    reasoningItems.push({
      dimension: 'Subject Matter',
      fact: input.purchasedType === 'not_sure' ? "Uncertain (Not sure)" : 'Not specified',
      observation: 'Section 2(7) applies to buyers of goods or hirers/availers of services. Clarification needed.',
      status: 'neutral'
    });
  } else if (input.purchasedType === 'something_else') {
    reasons.push('Item described as non-standard goods/service.');
    unresolvedQuestions.push('Classification of the transaction subject matter under statutory definitions.');
    reasoningItems.push({
      dimension: 'Subject Matter',
      fact: 'Other / Non-standard',
      observation: 'Further factual clarification required to ascertain whether it meets the definition of goods or service.',
      status: 'caution'
    });
  } else {
    const isGoods = input.purchasedType === 'goods';
    reasons.push(isGoods ? 'Transaction involves purchase of goods.' : 'Transaction involves hiring or availing of services.');
    reasoningItems.push({
      dimension: 'Subject Matter',
      fact: isGoods ? 'Goods' : 'Service',
      observation: isGoods 
        ? 'Appears consistent with "buys any goods" under Section 2(7)(i).'
        : 'Appears consistent with "hires or avails of any service" under Section 2(7)(ii).',
      status: 'positive'
    });
  }

  // 2. Evaluate Consideration
  if (!input.consideration || input.consideration === 'not_sure') {
    missingInformation.push('Consideration / payment arrangement');
    unresolvedQuestions.push('Whether consideration was paid, promised, partly paid, or deferred.');
    reasoningItems.push({
      dimension: 'Consideration',
      fact: input.consideration === 'not_sure' ? 'Uncertain' : 'Not specified',
      observation: 'Statutory definition requires consideration paid, promised, partly paid, or deferred.',
      status: 'neutral'
    });
  } else if (input.consideration === 'completely_free') {
    flags.push('No consideration reported');
    reasons.push('The transaction appears to involve no consideration.');
    unresolvedQuestions.push('Whether any promised or deferred consideration existed, or if statutory exception applies.');
    reasoningItems.push({
      dimension: 'Consideration',
      fact: 'Completely free (Zero consideration)',
      observation: 'Section 2(7) explicitly requires consideration. Purely gratuitous services/goods typically fall outside consumer protection jurisdiction unless tied to commercial consideration.',
      status: 'caution'
    });
  } else {
    let considerationLabel = 'Paid in full';
    if (input.consideration === 'partially_paid') considerationLabel = 'Partially paid';
    if (input.consideration === 'promised') considerationLabel = 'Payment promised';
    if (input.consideration === 'deferred') considerationLabel = 'Deferred payment / installment';

    reasons.push(`Consideration present (${considerationLabel.toLowerCase()}).`);
    reasoningItems.push({
      dimension: 'Consideration',
      fact: considerationLabel,
      observation: 'Satisfies statutory consideration criteria (paid, partly paid, promised, or under deferred payment system).',
      status: 'positive'
    });
  }

  // 3. Evaluate Purpose & Commercial/Resale Exclusions
  const isConflictPresent = input.secondaryPurposeConflicting && input.purpose && input.purpose !== input.secondaryPurposeConflicting;
  if (isConflictPresent) {
    flags.push('Possible conflicting information on transaction purpose');
    unresolvedQuestions.push(`Conflicting statements provided: reported "${input.purpose}" but also indicated "${input.secondaryPurposeConflicting}".`);
    reasoningItems.push({
      dimension: 'Purpose Consistency',
      fact: `Conflicting (${input.purpose} vs ${input.secondaryPurposeConflicting})`,
      observation: 'Answers contain conflicting purpose assertions. Factual clarification required to determine predominant usage.',
      status: 'caution'
    });
  }

  if (!input.purpose || input.purpose === 'not_sure') {
    missingInformation.push('Primary purpose of transaction');
    unresolvedQuestions.push('Whether goods/services were obtained for personal, household, or commercial use.');
    reasoningItems.push({
      dimension: 'Purpose',
      fact: input.purpose === 'not_sure' ? 'Uncertain' : 'Not specified',
      observation: 'Purpose is critical under Section 2(7) to exclude commercial transactions.',
      status: 'neutral'
    });
  } else if (input.purpose === 'resale') {
    flags.push('Potential statutory exclusion: Resale');
    reasons.push('Goods obtained for resale generally fall outside the statutory definition of consumer under Section 2(7).');
    unresolvedQuestions.push('Whether the goods were obtained for direct commercial resale.');
    reasoningItems.push({
      dimension: 'Purpose',
      fact: 'Resale',
      observation: 'Section 2(7)(i) explicitly excludes a person who obtains goods for resale. Potential statutory exclusion applies.',
      status: 'caution'
    });
  } else if (input.purpose === 'commercial_purpose') {
    if (input.selfEmploymentFollowup === 'yes') {
      flags.push('Livelihood through self-employment exception may apply');
      reasons.push('Commercial purpose indicated, but user reported exclusive use for earning livelihood by means of self-employment.');
      unresolvedQuestions.push('Factual verification of whether usage was exclusively for earning livelihood through self-employment.');
      reasoningItems.push({
        dimension: 'Purpose (Self-Employment Exception)',
        fact: 'Commercial — Exclusively for livelihood via self-employment',
        observation: 'Explanation to Section 2(7) provides that "commercial purpose" does not include use by a person of goods bought and used exclusively for earning livelihood by means of self-employment.',
        status: 'neutral'
      });
    } else if (input.selfEmploymentFollowup === 'no') {
      flags.push('Potential statutory exclusion: Commercial purpose');
      reasons.push('Goods/services obtained for commercial purpose without self-employment exception.');
      unresolvedQuestions.push('Whether transaction was in the course of large-scale commercial business.');
      reasoningItems.push({
        dimension: 'Purpose',
        fact: 'Commercial purpose (Non-self employment)',
        observation: 'Section 2(7) excludes transactions for commercial purpose unless the statutory self-employment livelihood exception is substantiated.',
        status: 'caution'
      });
    } else {
      flags.push('Commercial purpose clarification needed');
      unresolvedQuestions.push('Whether commercial equipment was used exclusively for self-employment livelihood.');
      reasoningItems.push({
        dimension: 'Purpose',
        fact: 'Commercial purpose (Self-employment status unclear)',
        observation: 'Further review required to assess if the self-employment exception under Explanation to Section 2(7) is applicable.',
        status: 'neutral'
      });
    }
  } else if (input.purpose === 'self_employment_livelihood') {
    reasons.push('Goods/service used to earn livelihood through self-employment.');
    reasoningItems.push({
      dimension: 'Purpose',
      fact: 'Livelihood through self-employment',
      observation: 'Falls within the Explanation to Section 2(7), which excludes such usage from "commercial purpose".',
      status: 'positive'
    });
  } else if (input.purpose === 'mixed_purpose') {
    flags.push('Mixed personal and business purpose');
    unresolvedQuestions.push('Predominant purpose and commercial scale of the transaction.');
    reasoningItems.push({
      dimension: 'Purpose',
      fact: 'Mixed purpose',
      observation: 'Requires factual review of dominant intention and operational use.',
      status: 'neutral'
    });
  } else {
    // personal_use or household_use
    const isPersonal = input.purpose === 'personal_use';
    reasons.push(`Acquired for ${isPersonal ? 'personal' : 'household'} use.`);
    reasoningItems.push({
      dimension: 'Purpose',
      fact: isPersonal ? 'Personal use' : 'Household use',
      observation: 'Meets consumer requirement; not obtained for commercial purpose or resale.',
      status: 'positive'
    });
  }

  // 4. Evaluate Purchaser / Beneficiary Relationship
  if (!input.purchaser || input.purchaser === 'not_sure') {
    missingInformation.push('Purchaser / user relationship');
    unresolvedQuestions.push('Whether the user is the original buyer or an authorised beneficiary.');
    reasoningItems.push({
      dimension: 'Purchaser Identity',
      fact: input.purchaser === 'not_sure' ? 'Uncertain' : 'Not specified',
      observation: 'Beneficiary status requires confirmation of approval from original buyer.',
      status: 'neutral'
    });
  } else if (input.purchaser === 'self') {
    reasons.push('Purchased directly by the complainant.');
    reasoningItems.push({
      dimension: 'Purchaser Identity',
      fact: 'Direct Purchaser (Self)',
      observation: 'Direct privity of transaction established under Section 2(7).',
      status: 'positive'
    });
  } else if (input.purchaser === 'authorised_user' || input.purchaser === 'beneficiary_user' || input.purchaser === 'someone_else') {
    reasons.push('Complainant is an authorised user or beneficiary of the transaction.');
    unresolvedQuestions.push('Documentation of consent/approval from the primary purchaser.');
    reasoningItems.push({
      dimension: 'Purchaser Identity',
      fact: input.purchaser === 'someone_else' ? 'Purchased by someone else for user' : 'Authorised User / Beneficiary',
      observation: 'Section 2(7) explicitly includes any user of goods or beneficiary of services when used with the approval of the person who paid consideration.',
      status: 'neutral'
    });
  }

  // 5. Evaluate Transaction Channel
  if (input.channel) {
    let channelLabel = 'Online / Electronic';
    if (input.channel === 'physical_offline') channelLabel = 'Physical / Offline store';
    if (input.channel === 'both') channelLabel = 'Omnichannel (Online & Offline)';
    if (input.channel === 'other') channelLabel = 'Other channel';

    reasoningItems.push({
      dimension: 'Transaction Channel',
      fact: channelLabel,
      observation: 'Section 2(7) explicitly recognizes transactions through offline or online modes, electronic means, teleshopping, or direct selling.',
      status: 'positive'
    });
  }

  // 6. Compute Final Overall Status
  if (flags.some(f => f.includes('Potential statutory exclusion'))) {
    status = 'potential_statutory_exclusion';
  } else if (
    missingInformation.length > 0 ||
    flags.length > 0 ||
    input.purchasedType === 'something_else' ||
    input.consideration === 'completely_free' ||
    input.purpose === 'mixed_purpose' ||
    input.purchaser === 'authorised_user' ||
    input.purchaser === 'beneficiary_user' ||
    input.purchaser === 'someone_else' ||
    (input.purpose === 'commercial_purpose' && input.selfEmploymentFollowup === 'yes')
  ) {
    status = 'further_review_required';
  } else {
    status = 'potentially_within_definition';
  }

  let statusLabel = 'Potentially within definition';
  let summary = 'Your answers appear consistent with the statutory definition of a consumer.';

  if (status === 'potential_statutory_exclusion') {
    statusLabel = 'Potential statutory exclusion';
    summary = 'The stated transaction purpose (such as commercial resale or non-exempt business purpose) may fall within a statutory exclusion under Section 2(7).';
  } else if (status === 'further_review_required') {
    statusLabel = 'Further review required';
    summary = 'Additional factual clarification or documentation may be needed to determine statutory consumer status.';
  }

  return {
    status,
    statusLabel,
    summary,
    legalBasis: 'Section 2(7), Consumer Protection Act, 2019',
    officialSource: 'India Code (https://www.indiacode.nic.in)',
    reasons,
    reasoningItems,
    flags,
    missingInformation,
    unresolvedQuestions,
    rawInput: input
  };
}
