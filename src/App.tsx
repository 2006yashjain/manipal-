import React, { useState } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { RoleSelection } from './pages/RoleSelection';
import { ReviewerGate } from './pages/ReviewerGate';
import { EligibilityChecker } from './pages/EligibilityChecker';
import { ConsumerIntake } from './pages/ConsumerIntake';
import { EvidenceUpload } from './pages/EvidenceUpload';
import { EvidenceProcessing } from './pages/EvidenceProcessing';
import { FactVerification } from './pages/FactVerification';
import { EvidenceSummary } from './pages/EvidenceSummary';
import { CaseReconstructionPlaceholder } from './pages/CaseReconstructionPlaceholder';
import { emptyCaseInput } from './data/demoCase';
import { syntheticDemoDocuments, syntheticExtractedFacts, syntheticConflicts } from './data/demoEvidence';
import { ConsumerCaseInput } from './types';
import { EligibilityResult } from './types/eligibility';
import { EvidenceDocument, EvidenceFact, EvidenceConflict } from './types/evidence';

export const App: React.FC = () => {
  // Navigation states:
  // 'landing' | 'role-selection' | 'eligibility-checker' | 'consumer-intake' | 'reviewer-gate'
  // | 'evidence-upload' | 'evidence-processing' | 'fact-verification' | 'evidence-summary' | 'case-reconstruction'
  const [currentView, setCurrentView] = useState<string>('landing');
  const [caseData, setCaseData] = useState<ConsumerCaseInput>(emptyCaseInput);
  const [documents, setDocuments] = useState<EvidenceDocument[]>(syntheticDemoDocuments);
  const [facts, setFacts] = useState<EvidenceFact[]>(syntheticExtractedFacts);
  const [conflicts] = useState<EvidenceConflict[]>(syntheticConflicts);

  // Navigation handlers
  const handleStartCase = () => {
    setCurrentView('role-selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectConsumer = () => {
    setCurrentView('eligibility-checker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReviewer = () => {
    setCurrentView('reviewer-gate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setCurrentView('consumer-intake');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToEvidence = () => {
    setCurrentView('evidence-upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartProcessing = () => {
    setCurrentView('evidence-processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessingComplete = () => {
    setCurrentView('fact-verification');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToSummary = () => {
    setCurrentView('evidence-summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToReconstruction = () => {
    setCurrentView('case-reconstruction');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHowItWorksClick = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetCase = () => {
    setCaseData({
      ...emptyCaseInput,
      id: `CASE-NS-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setDocuments(syntheticDemoDocuments);
    setFacts(syntheticExtractedFacts);
    setCurrentView('eligibility-checker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Top Persistent Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 2. Main Header Navbar */}
      <Navbar
        onStartCase={handleStartCase}
        onNavigateHome={handleNavigateHome}
        onNavigateHowItWorks={handleHowItWorksClick}
        onNavigateRoleSelect={() => {
          setCurrentView('role-selection');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateReviewerDemo={() => {
          setCurrentView('reviewer-gate');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={currentView}
      />

      {/* 3. Dynamic Page View */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <Landing
            onStartCase={handleStartCase}
            onHowItWorksClick={handleHowItWorksClick}
          />
        )}

        {currentView === 'role-selection' && (
          <RoleSelection
            onSelectConsumer={handleSelectConsumer}
            onSelectReviewer={handleSelectReviewer}
            onBackToLanding={handleNavigateHome}
          />
        )}

        {currentView === 'reviewer-gate' && (
          <ReviewerGate
            onBack={() => {
              setCurrentView('role-selection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'eligibility-checker' && (
          <EligibilityChecker
            initialData={caseData.consumerEligibility?.rawInput || null}
            onProceedToCase={handleProceedFromEligibility}
            onBackToRoles={() => {
              setCurrentView('role-selection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'consumer-intake' && (
          <ConsumerIntake
            caseData={caseData}
            onChangeCaseData={setCaseData}
            onContinueToEvidence={handleContinueToEvidence}
            onBackToRoles={() => {
              setCurrentView('role-selection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToEligibility={() => {
              setCurrentView('eligibility-checker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'evidence-upload' && (
          <EvidenceUpload
            documents={documents}
            onUpdateDocuments={setDocuments}
            onProceedToProcessing={handleStartProcessing}
            onBackToIntake={() => {
              setCurrentView('consumer-intake');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'evidence-processing' && (
          <EvidenceProcessing
            documentCount={documents.length}
            onComplete={handleProcessingComplete}
          />
        )}

        {currentView === 'fact-verification' && (
          <FactVerification
            facts={facts}
            conflicts={conflicts}
            onUpdateFacts={setFacts}
            onProceedToSummary={handleProceedToSummary}
            onBackToUpload={() => {
              setCurrentView('evidence-upload');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'evidence-summary' && (
          <EvidenceSummary
            caseData={caseData}
            documents={documents}
            facts={facts}
            conflicts={conflicts}
            onProceedToReconstruction={handleProceedToReconstruction}
            onBackToFacts={() => {
              setCurrentView('fact-verification');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'case-reconstruction' && (
          <CaseReconstructionPlaceholder
            onBackToSummary={() => {
              setCurrentView('evidence-summary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReset={handleResetCase}
          />
        )}
      </main>

    </div>
  );
};

export default App;
