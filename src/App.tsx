import React, { useState } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { RoleSelection } from './pages/RoleSelection';
import { ReviewerGate } from './pages/ReviewerGate';
import { ConsumerIntake } from './pages/ConsumerIntake';
import { EvidenceUpcoming } from './pages/EvidenceUpcoming';
import { emptyCaseInput } from './data/demoCase';
import { ConsumerCaseInput } from './types';

export const App: React.FC = () => {
  // Navigation states: 'landing' | 'role-selection' | 'consumer-intake' | 'reviewer-gate' | 'evidence-upcoming'
  const [currentView, setCurrentView] = useState<string>('landing');
  const [caseData, setCaseData] = useState<ConsumerCaseInput>(emptyCaseInput);

  // Navigation handlers
  const handleStartCase = () => {
    setCurrentView('role-selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectConsumer = () => {
    setCurrentView('consumer-intake');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReviewer = () => {
    setCurrentView('reviewer-gate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToEvidence = () => {
    setCurrentView('evidence-upcoming');
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
    setCurrentView('consumer-intake');
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

        {currentView === 'consumer-intake' && (
          <ConsumerIntake
            caseData={caseData}
            onChangeCaseData={setCaseData}
            onContinueToEvidence={handleContinueToEvidence}
            onBackToRoles={() => {
              setCurrentView('role-selection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'evidence-upcoming' && (
          <EvidenceUpcoming
            caseData={caseData}
            onBackToIntake={() => {
              setCurrentView('consumer-intake');
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
