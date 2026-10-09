import React from 'react';
import { Lock, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { SecondaryButton } from '../components/SecondaryButton';

interface ReviewerGateProps {
  onBack: () => void;
}

export const ReviewerGate: React.FC<ReviewerGateProps> = ({ onBack }) => {
  return (
    <div className="py-16 md:py-24 max-w-2xl mx-auto px-4 sm:px-6 text-center">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-card">
        
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center mx-auto mb-6 shadow-subtle">
          <Lock className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200">
          <KeyRound className="w-3.5 h-3.5 text-slate-500" />
          Restricted Demo Environment
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reviewer Workspace
        </h2>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Reviewer authentication and case-level authorisation will be implemented in a later stage. Official reviewer workflows require role-based access controls (RBAC) and cannot be self-registered.
        </p>

        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-800 font-semibold">Hackathon Scope Notice:</strong> Stage 1 focuses on the Consumer Intake journey. Case brief review tools will be activated in subsequent stages with synthetic dossiers.
          </p>
        </div>

        <div className="pt-2">
          <SecondaryButton
            size="md"
            onClick={onBack}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Role Selection
          </SecondaryButton>
        </div>

      </div>
    </div>
  );
};
