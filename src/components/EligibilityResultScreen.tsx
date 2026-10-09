import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  RotateCcw, 
  ExternalLink,
  ShieldAlert,
  Scale
} from 'lucide-react';
import { EligibilityResult } from '../types/eligibility';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface EligibilityResultScreenProps {
  result: EligibilityResult;
  onContinueToCase: () => void;
  onModifyAnswers: () => void;
}

export const EligibilityResultScreen: React.FC<EligibilityResultScreenProps> = ({
  result,
  onContinueToCase,
  onModifyAnswers,
}) => {
  const getStatusBadge = () => {
    switch (result.status) {
      case 'potentially_within_definition':
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Potentially within definition</span>
          </div>
        );
      case 'further_review_required':
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Further review required</span>
          </div>
        );
      case 'potential_statutory_exclusion':
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Potential statutory exclusion</span>
          </div>
        );
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Top Banner */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-indigo-600" /> Preliminary Transaction Screening
        </span>
        <button
          onClick={onModifyAnswers}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Modify Answers
        </button>
      </div>

      {/* Main Result Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Status Header */}
        <div className="border-b border-slate-100 pb-6">
          <div className="mb-3">{getStatusBadge()}</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {result.status === 'potentially_within_definition' && 'Transaction appears consistent with consumer statutory criteria.'}
            {result.status === 'further_review_required' && 'Additional facts are required to determine consumer applicability.'}
            {result.status === 'potential_statutory_exclusion' && 'Stated transaction purpose may fall within a statutory exclusion.'}
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* Legal Basis Callout (India Code) */}
        <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Legal Basis: {result.legalBasis}</span>
              <span className="text-slate-500">
                Statutory concept of "consumer" defining buyers of goods and hirers/availers of services.
              </span>
            </div>
          </div>
          <a
            href="https://www.indiacode.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap"
          >
            <span>Official India Code</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Legal Reasoning Panel: "How we reached this result" */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              How we reached this result
            </h2>
            <span className="text-[11px] text-slate-400">Structured Statutory Breakdown</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.reasoningItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/40 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{item.dimension}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      item.status === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'caution' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.fact}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug mt-1.5">
                    {item.observation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flags & Unresolved Questions */}
        {(result.flags.length > 0 || result.unresolvedQuestions.length > 0) && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Items for Case File Documentation</span>
            </div>

            {result.flags.map((flag, i) => (
              <div key={i} className="text-amber-800 flex items-start gap-2">
                <span className="font-bold">• Flag:</span> {flag}
              </div>
            ))}

            {result.unresolvedQuestions.map((q, i) => (
              <div key={i} className="text-amber-800 flex items-start gap-2">
                <span className="font-bold">• Clarification needed:</span> {q}
              </div>
            ))}
          </div>
        )}

        {/* Legal Safety Notice */}
        <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Preliminary screening only:</strong> This screening is based solely on the information you entered. It does not constitute a binding legal verdict or guarantee case admissibility. You may continue to create your case file regardless of the preliminary status.
          </span>
        </div>

        {/* CTAs */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <SecondaryButton size="md" onClick={onModifyAnswers}>
            Review Answers
          </SecondaryButton>

          <PrimaryButton
            size="lg"
            onClick={onContinueToCase}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
          >
            Continue to Consumer Case Intake
          </PrimaryButton>
        </div>

      </div>

    </div>
  );
};
