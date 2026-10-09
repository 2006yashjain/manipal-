import React from 'react';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck, 
  Sparkles
} from 'lucide-react';
import { EvidenceDocument, EvidenceFact, EvidenceConflict } from '../types/evidence';
import { ConsumerCaseInput } from '../types';
import { ProgressStepper } from '../components/ProgressStepper';
import { PrimaryButton } from '../components/PrimaryButton';

interface EvidenceSummaryProps {
  caseData: ConsumerCaseInput;
  documents: EvidenceDocument[];
  facts: EvidenceFact[];
  conflicts: EvidenceConflict[];
  onProceedToReconstruction: () => void;
  onBackToFacts: () => void;
}

export const EvidenceSummary: React.FC<EvidenceSummaryProps> = ({
  caseData,
  documents,
  facts,
  conflicts,
  onProceedToReconstruction,
  onBackToFacts,
}) => {
  const documentSupportedCount = facts.filter(f => f.status === 'Document supported').length;
  const consumerReportedCount = facts.filter(f => f.status === 'Consumer reported').length;
  const userCorrectedCount = facts.filter(f => f.isCorrected || f.status === 'User corrected').length;

  // Record Completeness Checklist items
  const completenessItems = [
    { label: 'Transaction & Merchant identified', complete: true, note: `${caseData.platform || 'ExampleMart'} • ${caseData.seller || 'TechWorld Store'}` },
    { label: 'Payment evidence available', complete: true, note: 'ExamplePay receipt with UPI ref verified' },
    { label: 'Order confirmation record available', complete: true, note: 'Order #ORD-78291 corroborated' },
    { label: 'Dispute story & requested remedies captured', complete: true, note: 'Defective product • Refund requested' },
    { label: 'Delivery evidence & package condition', complete: true, note: 'Delivery photo with casing fracture attached' },
    { label: 'Refund acknowledgment / credit status', complete: false, isWarning: true, note: 'Disputed • Refund not confirmed by seller' },
    { label: 'Transaction date chronology', complete: false, isWarning: true, note: 'Inconsistency between order doc & seller chat' },
  ];

  return (
    <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToFacts}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Fact Verification
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Evidence Processing Summary
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Stage 2 Complete
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of structured facts, source corroboration, and record completeness for Case #{caseData.id}.
          </p>
        </div>
      </div>

      {/* Progress Stepper - Step 03 Review Active */}
      <ProgressStepper currentStep={3} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Metrics & Record Completeness (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Extraction Metrics Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Evidence Extraction Breakdown
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block">Evidence Received</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">{documents.length} docs</span>
                <span className="text-[10px] text-slate-400">PDFs, PNGs, JPGs</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-500 block">Facts Extracted</span>
                <span className="text-xl font-bold text-indigo-600 mt-0.5 block">{facts.length} facts</span>
                <span className="text-[10px] text-slate-400">Structured data points</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[11px] font-medium text-emerald-800 block">Document Supported</span>
                <span className="text-xl font-bold text-emerald-700 mt-0.5 block">{documentSupportedCount}</span>
                <span className="text-[10px] text-emerald-600">Corroborated by files</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                <span className="text-[11px] font-medium text-indigo-800 block">Consumer Reported</span>
                <span className="text-xl font-bold text-indigo-700 mt-0.5 block">{consumerReportedCount}</span>
                <span className="text-[10px] text-indigo-600">Narrative statements</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200">
                <span className="text-[11px] font-medium text-purple-800 block">User Corrected</span>
                <span className="text-xl font-bold text-purple-700 mt-0.5 block">{userCorrectedCount}</span>
                <span className="text-[10px] text-purple-600">Manual adjustments</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="text-[11px] font-medium text-amber-800 block">Inconsistencies</span>
                <span className="text-xl font-bold text-amber-700 mt-0.5 block">{conflicts.length}</span>
                <span className="text-[10px] text-amber-600">Needs review flag</span>
              </div>
            </div>
          </div>

          {/* Record Completeness Checklist */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Record Completeness Checklist
                </h3>
                <p className="text-[11px] text-slate-500">
                  Measures case documentation readiness across statutory requirements.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                85% Complete
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              {completenessItems.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    item.complete
                      ? 'bg-slate-50/50 border-slate-200'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {item.complete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`font-bold block ${item.complete ? 'text-slate-900' : 'text-amber-950'}`}>
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.note}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded flex-shrink-0 ${
                    item.complete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {item.complete ? 'Ready' : 'Needs Review'}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 italic pt-2">
              * Note: Record completeness measures documentary sufficiency, not legal probability or case strength.
            </p>
          </div>

        </div>

        {/* Right Column: Next Steps & Case Reconstruction CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dossier Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-elevated border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/40 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Case Dossier</h3>
                  <span className="text-[11px] text-slate-400 font-mono">#{caseData.id}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-[10px] font-semibold">
                Verified Stage 2
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Transaction:</span>
                <span className="font-semibold text-slate-200">{caseData.platform || 'ExampleMart'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Seller:</span>
                <span className="font-semibold text-slate-200">{caseData.seller || 'TechWorld Store'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Verified Amount:</span>
                <span className="font-bold text-slate-100 text-sm">₹{caseData.amount || '54,999'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Primary Dispute:</span>
                <span className="font-medium text-right text-indigo-300">Defective / not-as-described</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target Remedy:</span>
                <span className="font-medium text-slate-200">Full Refund</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Statutory Screening:</span>
                <span className="font-bold text-emerald-400">
                  {caseData.consumerEligibility?.statusLabel || 'Potentially within definition'}
                </span>
              </div>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Next Stage Capabilities
              </div>
              <p className="text-slate-400 leading-relaxed">
                Stage 3 will synthesize these verified facts into the <strong>Transaction Truth Graph</strong>, Chronological Event Timeline, and multi-party grievance routes.
              </p>
            </div>

            <div className="pt-2">
              <PrimaryButton
                size="lg"
                fullWidth
                onClick={onProceedToReconstruction}
                icon={<ArrowRight className="w-4 h-4" />}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
              >
                Ready for Case Reconstruction
              </PrimaryButton>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
