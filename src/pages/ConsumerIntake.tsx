import React from 'react';
import { Sparkles, ArrowLeft, RotateCcw, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { ConsumerCaseInput, IssueCategoryType, RemedyType, InvolvedPartiesInput } from '../types';
import { syntheticDemoCase, emptyCaseInput } from '../data/demoCase';
import { ProgressStepper } from '../components/ProgressStepper';
import { FormField } from '../components/FormField';
import { IssueCard } from '../components/IssueCard';
import { RemedySelector } from '../components/RemedySelector';
import { PartySelector } from '../components/PartySelector';
import { ConsentBox } from '../components/ConsentBox';
import { CaseCompleteness } from '../components/CaseCompleteness';
import { CasePreview } from '../components/CasePreview';

interface ConsumerIntakeProps {
  caseData: ConsumerCaseInput;
  onChangeCaseData: (data: ConsumerCaseInput) => void;
  onContinueToEvidence: () => void;
  onBackToRoles: () => void;
  onBackToEligibility?: () => void;
}

export const ConsumerIntake: React.FC<ConsumerIntakeProps> = ({
  caseData,
  onChangeCaseData,
  onContinueToEvidence,
  onBackToRoles,
  onBackToEligibility,
}) => {
  // Helpers to update specific fields
  const handleFieldChange = (field: keyof ConsumerCaseInput, value: any) => {
    onChangeCaseData({
      ...caseData,
      [field]: value,
    });
  };

  const handlePartiesChange = (parties: InvolvedPartiesInput) => {
    onChangeCaseData({
      ...caseData,
      parties,
    });
  };

  // Demo autofill
  const handleFillDemo = () => {
    onChangeCaseData({
      ...syntheticDemoCase,
      id: caseData.id || syntheticDemoCase.id,
      consumerEligibility: caseData.consumerEligibility || null,
    });
  };

  const handleClearForm = () => {
    onChangeCaseData({
      ...emptyCaseInput,
      id: caseData.id,
      consumerEligibility: caseData.consumerEligibility || null,
    });
  };

  // Validation for continuing
  const canContinue = 
    caseData.story.trim().length >= 10 &&
    caseData.issueCategory !== null &&
    caseData.consentGiven;

  const elig = caseData.consumerEligibility;

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToEligibility || onBackToRoles}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Eligibility Screening
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your case
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stage 1: Capture transaction facts, incident story, and desired remedies.
          </p>
        </div>

        {/* Demo Helper Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-subtle"
            title="Populate with the Dell Inspiron hackathon scenario"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Load Demo Data</span>
          </button>

          <button
            onClick={handleClearForm}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Reset form fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Eligibility Screening Status Badge Banner */}
      {elig && (
        <div className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
          elig.status === 'potentially_within_definition'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : elig.status === 'potential_statutory_exclusion'
            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start gap-2.5">
            {elig.status === 'potentially_within_definition' && <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {elig.status === 'further_review_required' && <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
            {elig.status === 'potential_statutory_exclusion' && <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />}
            <div>
              <span className="font-bold block">
                Statutory Screening: {elig.statusLabel} (Section 2(7), CPA 2019)
              </span>
              <span className="opacity-90">{elig.summary}</span>
            </div>
          </div>
          {onBackToEligibility && (
            <button
              onClick={onBackToEligibility}
              className="text-[11px] font-bold underline whitespace-nowrap self-end sm:self-center"
            >
              Re-screen
            </button>
          )}
        </div>
      )}

      {/* Progress Stepper */}
      <ProgressStepper currentStep={1} />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Transaction Details */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Step 1.1
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                Tell us about the transaction
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Basic purchase details to locate records and establish merchant identity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Platform / Marketplace" required hint="Where the purchase was made">
                <input
                  type="text"
                  value={caseData.platform}
                  onChange={(e) => handleFieldChange('platform', e.target.value)}
                  placeholder="e.g. ExampleMart, Flipkart, Amazon"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </FormField>

              <FormField label="Seller / Business Name" optional hint="Merchant on the receipt">
                <input
                  type="text"
                  value={caseData.seller}
                  onChange={(e) => handleFieldChange('seller', e.target.value)}
                  placeholder="e.g. TechWorld Store"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </FormField>

              <FormField label="Order / Transaction ID" optional hint="Reference from invoice or app">
                <input
                  type="text"
                  value={caseData.orderId}
                  onChange={(e) => handleFieldChange('orderId', e.target.value)}
                  placeholder="e.g. ORD-78291"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </FormField>

              <FormField label="Purchase Date" optional hint="Approximate or exact date">
                <input
                  type="date"
                  value={caseData.purchaseDate}
                  onChange={(e) => handleFieldChange('purchaseDate', e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </FormField>

              <FormField label="Amount Paid" required hint="Total sum transacted">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 text-sm font-semibold">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={caseData.amount}
                    onChange={(e) => handleFieldChange('amount', e.target.value)}
                    placeholder="54,999"
                    className="w-full text-xs sm:text-sm pl-8 pr-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  />
                </div>
              </FormField>

              <FormField label="Currency" optional>
                <select
                  value={caseData.currency}
                  onChange={(e) => handleFieldChange('currency', e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </FormField>
            </div>
          </section>

          {/* Section 2: What happened? */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Step 1.2
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                What happened? <span className="text-rose-500 font-normal">*</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Describe the sequence of events in your own words. Don't worry about formal or legal language.
              </p>
            </div>

            <textarea
              rows={5}
              value={caseData.story}
              onChange={(e) => handleFieldChange('story', e.target.value)}
              placeholder="Describe what happened in your own words. Don't worry about legal terminology. Example: I ordered a laptop from an online marketplace. It was delivered damaged. I contacted the seller and requested a refund, but the refund has not been processed..."
              className="w-full text-xs sm:text-sm p-4 bg-slate-50/50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors leading-relaxed"
            />
            
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Plain narrative intake</span>
              <span>{caseData.story.length} characters</span>
            </div>
          </section>

          {/* Section 3: Issue Category */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Step 1.3
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                What best describes your issue? <span className="text-rose-500 font-normal">*</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the primary MVP dispute category that best matches your situation.
              </p>
            </div>

            <IssueCard
              selectedCategory={caseData.issueCategory}
              onSelectCategory={(cat: IssueCategoryType) => handleFieldChange('issueCategory', cat)}
            />
          </section>

          {/* Section 4: Desired Remedy */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Step 1.4
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                What would you like resolved?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your preferred redressal outcomes. You can choose one or multiple.
              </p>
            </div>

            <RemedySelector
              selectedRemedies={caseData.remedies}
              onChange={(remedies: RemedyType[]) => handleFieldChange('remedies', remedies)}
            />
          </section>

          {/* Section 5: Involved Parties */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  Step 1.5
                </span>
                <span className="text-[11px] font-medium text-slate-400">Optional</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                Who was involved?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add any known entities to help map multi-party responsibilities.
              </p>
            </div>

            <PartySelector
              parties={caseData.parties}
              onChange={handlePartiesChange}
            />
          </section>

          {/* Section 6: Consent */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <ConsentBox
              checked={caseData.consentGiven}
              onChange={(checked: boolean) => handleFieldChange('consentGiven', checked)}
            />
          </section>

        </div>

        {/* Right Sticky Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          
          {/* Record Completeness */}
          <CaseCompleteness caseData={caseData} />

          {/* Case Preview Card */}
          <CasePreview
            caseData={caseData}
            onContinueToEvidence={onContinueToEvidence}
            canContinue={canContinue}
          />

        </div>

      </div>

    </div>
  );
};
