import React, { useState } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { RoleSelection } from './pages/RoleSelection';
import { ReviewerGate } from './pages/ReviewerGate';
import { EligibilityChecker } from './pages/EligibilityChecker';

import { Step1StoryEvidence } from './pages/consolidated/Step1StoryEvidence';
import { Step2ReconstructionIntelligence } from './pages/consolidated/Step2ReconstructionIntelligence';
import { Step3BuildCase } from './pages/consolidated/Step3BuildCase';

import { ReviewerDashboard } from './pages/ReviewerDashboard';
import { ReviewerCaseDetail } from './pages/ReviewerCaseDetail';

// Data
import { emptyCaseInput } from './data/demoCase';
import { syntheticDemoDocuments, syntheticExtractedFacts, syntheticConflicts } from './data/demoEvidence';
import { legalSources } from './data/legalSources';

// Types
import { ConsumerCaseInput, CaseRecord } from './types';
import { EligibilityResult } from './types/eligibility';
import { EvidenceDocument, EvidenceFact, EvidenceConflict } from './types/evidence';
import { TruthGraph } from './types/graph';
import { ReconstructedTimeline } from './types/timeline';
import { EvidenceGapReport } from './types/gaps';
import { LegalMapping, PreliminaryAssessment } from './types/legal';
import { ReviewerCaseRecord } from './types/reviewer';

// Engines
import { buildTruthGraph } from './services/truthGraphEngine';
import { buildTimeline } from './services/timelineEngine';
import { detectEvidenceGaps } from './services/evidenceGapEngine';
import { mapLegalFactors, generatePreliminaryAssessment } from './services/legalAnalysisEngine';

// Views type
type ViewName =
  | 'landing'
  | 'role-selection'
  | 'eligibility-checker'
  | 'reviewer-gate'
  | 'step-1'
  | 'step-2'
  | 'step-3'
  | 'finalised-success'
  | 'reviewer-dashboard'
  | 'reviewer-case-detail';

// Mock reviewer queue
const reviewerQueue: CaseRecord[] = [];

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewName>('landing');
  const [caseData, setCaseData] = useState<ConsumerCaseInput>(emptyCaseInput);
  const [documents, setDocuments] = useState<EvidenceDocument[]>(syntheticDemoDocuments);
  const [facts, setFacts] = useState<EvidenceFact[]>(syntheticExtractedFacts);
  const [conflicts] = useState<EvidenceConflict[]>(syntheticConflicts);

  // Computed state for Step 2
  const [truthGraph, setTruthGraph] = useState<TruthGraph | null>(null);
  const [timeline, setTimeline] = useState<ReconstructedTimeline | null>(null);
  const [gapReport, setGapReport] = useState<EvidenceGapReport | null>(null);
  const [legalMappings, setLegalMappings] = useState<LegalMapping[]>([]);
  const [assessment, setAssessment] = useState<PreliminaryAssessment | null>(null);

  // Reviewer state
  const [currentReviewerCase, setCurrentReviewerCase] = useState<CaseRecord | null>(null);
  const [lastFinalisedCaseId, setLastFinalisedCaseId] = useState<string | null>(null);

  const nav = (view: ViewName) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCase = () => nav('role-selection');
  const handleNavigateHome = () => nav('landing');

  const handleHowItWorksClick = () => {
    if (currentView !== 'landing') {
      nav('landing');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProceedFromEligibility = (eligibilityResult: EligibilityResult) => {
    setCaseData((prev) => ({
      ...prev,
      consumerEligibility: eligibilityResult,
      platform: prev.platform || eligibilityResult.rawInput.platformName || (eligibilityResult.rawInput.purchasedDescription?.includes('Dell') ? 'ExampleMart' : ''),
      seller: prev.seller || eligibilityResult.rawInput.sellerName || (eligibilityResult.rawInput.purchasedDescription?.includes('Dell') ? 'TechWorld Store' : ''),
      amount: prev.amount || eligibilityResult.rawInput.approximateAmount || (eligibilityResult.rawInput.purchasedDescription?.includes('Dell') ? '54,999' : ''),
      parties: {
        ...prev.parties,
        marketplace: prev.parties.marketplace || eligibilityResult.rawInput.platformName || '',
        seller: prev.parties.seller || eligibilityResult.rawInput.sellerName || '',
      }
    }));
    nav('step-1');
  };

  const handleProceedToStep2 = () => {
    const graph = buildTruthGraph(caseData, facts);
    const tl = buildTimeline(caseData, facts, conflicts);
    const gaps = detectEvidenceGaps(facts, conflicts);
    const mappings = mapLegalFactors(facts, caseData, gaps.gaps);
    const prelim = generatePreliminaryAssessment(facts, mappings, gaps.gaps, conflicts, caseData);
    
    setTruthGraph(graph);
    setTimeline(tl);
    setGapReport(gaps);
    setLegalMappings(mappings);
    setAssessment(prelim);
    
    nav('step-2');
  };

  const handleProceedToStep3 = () => nav('step-3');

  const handleFinalizeDraft = () => {
    setLastFinalisedCaseId(caseData.id);
    nav('finalised-success');
  };

  const handleResetCase = () => {
    setCaseData({
      ...emptyCaseInput,
      id: `CASE-NS-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setDocuments(syntheticDemoDocuments);
    setFacts(syntheticExtractedFacts);
    setTruthGraph(null);
    setTimeline(null);
    setGapReport(null);
    setLegalMappings([]);
    setAssessment(null);
    nav('eligibility-checker');
  };

  // Reviewer Handlers
  const handleReviewerOpenCase = (caseId: string) => {
    // If it's the current case, mock a CaseRecord out of it
    if (caseId === lastFinalisedCaseId || caseId === caseData.id) {
      setCurrentReviewerCase({
        ...caseData,
        evidenceDocuments: documents,
        evidenceFacts: facts,
        evidenceConflicts: conflicts,
        timelineEvents: timeline,
        truthGraph,
        evidenceGapReport: gapReport,
        legalMappings,
        preliminaryAssessment: assessment,
        caseBrief: null,
        complaint: null,
        review: null,
      });
    } else {
      const c = reviewerQueue.find(c => c.id === caseId) || null;
      setCurrentReviewerCase(c);
    }
    nav('reviewer-case-detail');
  };
  const handleReviewerBack = () => {
    setCurrentReviewerCase(null);
    nav('reviewer-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <DisclaimerBanner />
      <Navbar
        onStartCase={handleStartCase}
        onNavigateHome={handleNavigateHome}
        onNavigateHowItWorks={handleHowItWorksClick}
        onNavigateRoleSelect={() => nav('role-selection')}
        onNavigateReviewerDemo={() => nav('reviewer-gate')}
        currentView={currentView}
      />

      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <Landing onStartCase={handleStartCase} onHowItWorksClick={handleHowItWorksClick} />
        )}

        {currentView === 'role-selection' && (
          <RoleSelection
            onSelectConsumer={() => nav('eligibility-checker')}
            onSelectReviewer={() => nav('reviewer-gate')}
            onBackToLanding={handleNavigateHome}
          />
        )}

        {currentView === 'reviewer-gate' && (
          <ReviewerGate onBack={() => nav('role-selection')} />
        )}

        {currentView === 'eligibility-checker' && (
          <EligibilityChecker
            initialData={caseData.consumerEligibility?.rawInput || null}
            onProceedToCase={handleProceedFromEligibility}
            onBackToRoles={() => nav('role-selection')}
          />
        )}

        {currentView === 'step-1' && (
          <Step1StoryEvidence
            caseData={caseData}
            onChangeCaseData={setCaseData}
            documents={documents}
            onUpdateDocuments={setDocuments}
            facts={facts}
            onUpdateFacts={setFacts}
            conflicts={conflicts}
            onContinue={handleProceedToStep2}
          />
        )}

        {currentView === 'step-2' && truthGraph && timeline && gapReport && assessment && (
          <Step2ReconstructionIntelligence
            caseData={caseData}
            facts={facts}
            conflicts={conflicts}
            truthGraph={truthGraph}
            timeline={timeline}
            gapReport={gapReport}
            legalMappings={legalMappings}
            assessment={assessment}
            provisions={legalSources}
            onContinue={handleProceedToStep3}
            onBack={() => nav('step-1')}
          />
        )}

        {currentView === 'step-3' && assessment && gapReport && (
          <Step3BuildCase
            caseData={caseData}
            documents={documents}
            facts={facts}
            legalMappings={legalMappings}
            assessment={assessment}
            gapReport={gapReport}
            onFinalize={handleFinalizeDraft}
            onBack={() => nav('step-2')}
          />
        )}

        {currentView === 'finalised-success' && (
          <SuccessFinalisedView
            caseId={lastFinalisedCaseId}
            onReset={handleResetCase}
            onOpenReviewer={() => nav('reviewer-dashboard')}
          />
        )}

        {currentView === 'reviewer-dashboard' && (
          <ReviewerDashboard
            queue={reviewerQueue as unknown as ReviewerCaseRecord[]}
            onBack={() => nav('role-selection')}
            onOpenCase={handleReviewerOpenCase}
          />
        )}

        {currentView === 'reviewer-case-detail' && currentReviewerCase && (
          <ReviewerCaseDetail
            caseRec={currentReviewerCase}
            onBack={handleReviewerBack}
            onUpdateNotes={() => {}}
            onUpdateActivity={() => {}}
            onUpdateFlagged={() => {}}
            onUpdateClarifications={() => {}}
            onUpdateStatus={() => {}}
          />
        )}
      </main>
    </div>
  );
};

const SuccessFinalisedView: React.FC<{
  caseId: string | null;
  onReset: () => void;
  onOpenReviewer: () => void;
}> = ({ caseId, onReset, onOpenReviewer }) => {
  return (
    <div className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-emerald-600">
            <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            Case Dossier Ready
          </div>
          <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Case {caseId || '—'} Finalized
          </h2>
          <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Your structured case brief and complaint draft have been finalized and added to your dossier.
            You can now proceed to the Reviewer Workspace to see how this case appears to case handlers.
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-left text-xs text-amber-800 leading-relaxed max-w-md mx-auto">
          <strong className="font-semibold">Reminder:</strong> This is a draft generated for review. It is not an
          automatically filed complaint and does not determine liability or any legal outcome.
          Always consult a qualified advocate before formal filing.
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenReviewer}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm"
          >
            Open Reviewer Workspace →
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 px-3 py-2"
          >
            Start Another Test Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
