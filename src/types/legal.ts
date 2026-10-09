export interface LegalProvision {
  id: string;
  title: string;
  provision: string;          // E.g. "Section 2(7)"
  act: string;                // E.g. "Consumer Protection Act, 2019"
  sourceName: string;         // E.g. "India Code"
  sourceUrl: string;
  summary: string;
  relevantFactors: string[];  // Factor labels that trigger this provision
}

export interface LegalMapping {
  id: string;
  provisionId: string;
  factIds: string[];
  evidenceIds: string[];
  factorLabel: string;        // Which factor this mapping covers
  caseFact: string;           // The specific fact from this case
  relevanceReason: string;    // Why this provision may be relevant
  missingInformation: string[];
  conflicts: string[];
}

export interface SupportedFact {
  factId: string;
  fact: string;
  value: string;
  evidenceSource: string;
  status: string;
}

export interface UnsupportedClaim {
  claim: string;
  reason: string;
  relatedGap?: string;
}

export interface PreliminaryAssessment {
  summary: string;
  relevantProvisionIds: string[];
  supportedFacts: SupportedFact[];
  unsupportedClaims: UnsupportedClaim[];
  evidenceGapIds: string[];
  conflicts: string[];
  limitations: string[];
  generatedAt: string;
}
