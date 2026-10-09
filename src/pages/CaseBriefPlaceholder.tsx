import React from 'react';
import { CheckCircle2, Lock, FileText, ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressStepper } from '../components/ProgressStepper';

interface CaseBriefPlaceholderProps {
  onBackToLegal: () => void;
  onReset: () => void;
}

export const CaseBriefPlaceholder: React.FC<CaseBriefPlaceholderProps> = ({
  onBackToLegal,
  onReset,
}) => {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
      <ProgressStepper currentStep={5} />

      <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Stage 4 Complete: Legal Analysis Ready
        </div>

        <div className="w-16 h-16 rounded-2xl bg-indigo-900 flex items-center justify-center mx-auto shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ready to Prepare Case Brief
          </h2>
          <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Your verified facts, transaction truth graph, reconstructed timeline, evidence gap report, and preliminary legal analysis are all ready.
            The next stage will compile these into a structured case brief for formal complaint preparation.
          </p>
        </div>

        {/* Summary of what's been built */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mt-6 max-w-lg mx-auto">
          {[
            'Eligibility screening completed',
            'Consumer case structured',
            'Evidence verified with provenance',
            'Facts extracted and annotated',
            'Transaction truth graph built',
            'Timeline reconstructed',
            'Evidence gaps identified',
            'Legal provisions mapped',
            'Preliminary assessment generated',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* Coming next */}
        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-start gap-4 text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Stage 5 — Case Brief (Coming)</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              The final stage will generate a structured consumer complaint dossier — including a formal complaint draft, supporting evidence bundle, and suggested redressal route — ready for filing with the Consumer Disputes Redressal Commission or NCH.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-center bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-md mx-auto">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed text-left">
            <span className="font-bold">Reminder:</span> NyayaSetu AI does not determine liability, predict outcomes, or provide legal advice. Always consult a qualified advocate before taking legal action.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SecondaryButton
            onClick={onBackToLegal}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Review Legal Analysis
          </SecondaryButton>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors px-3 py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Another Test Case
          </button>
        </div>
      </div>
    </div>
  );
};
