import React from 'react';
import { User, ShieldCheck, Check, ArrowRight, Lock } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

interface RoleSelectionProps {
  onSelectConsumer: () => void;
  onSelectReviewer: () => void;
  onBackToLanding: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  onSelectConsumer,
  onSelectReviewer,
  onBackToLanding,
}) => {
  return (
    <div className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <button
          onClick={onBackToLanding}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 inline-flex items-center gap-1 transition-colors"
        >
          ← Back to home
        </button>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How are you using NyayaSetu?
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Select your workflow entry point to begin case preparation or review.
        </p>
      </div>

      {/* Two Large Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Role 1: Consumer */}
        <div className="bg-white rounded-2xl border-2 border-indigo-600 p-6 sm:p-8 shadow-card flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            Primary Flow
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <User className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">CONSUMER</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
              Prepare and understand your consumer dispute.
            </p>

            <div className="space-y-2.5">
              {[
                'Submit your complaint in plain language',
                'Upload receipts, invoices & chat evidence',
                'Review extracted facts & timeline',
                'Understand what documentation may be missing',
                'Prepare a structured complaint dossier'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <PrimaryButton
              fullWidth
              size="lg"
              onClick={onSelectConsumer}
              icon={<ArrowRight className="w-4 h-4" />}
              className="bg-indigo-600 hover:bg-indigo-700 font-semibold"
            >
              Continue as Consumer
            </PrimaryButton>
          </div>
        </div>

        {/* Role 2: Official / Reviewer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">OFFICIAL / REVIEWER</h3>
              <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Demo
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
              Review a prepared case using an authorised workflow.
            </p>

            <div className="space-y-2.5">
              {[
                'Open a structured case brief dossier',
                'Review reconstructed chronological timeline',
                'Inspect multi-party evidence attachments',
                'Review statutory legal references',
                'Add reviewer assessment notes'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
            <SecondaryButton
              fullWidth
              size="lg"
              onClick={onSelectReviewer}
              icon={<Lock className="w-3.5 h-3.5" />}
              className="font-medium"
            >
              Reviewer Demo
            </SecondaryButton>
            <p className="text-[11px] text-slate-400 text-center leading-tight">
              Reviewer access is restricted in real deployment. This hackathon prototype uses synthetic demo cases.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
