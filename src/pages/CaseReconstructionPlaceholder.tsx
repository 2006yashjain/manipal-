import React from 'react';
import { Layers, ArrowLeft, CheckCircle2, Compass, FileCheck2, GitFork } from 'lucide-react';
import { SecondaryButton } from '../components/SecondaryButton';

interface CaseReconstructionPlaceholderProps {
  onBackToSummary: () => void;
  onReset: () => void;
}

export const CaseReconstructionPlaceholder: React.FC<CaseReconstructionPlaceholderProps> = ({
  onBackToSummary,
  onReset,
}) => {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-card text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Stage 2 Complete: Evidence Verified</span>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-subtle">
          <GitFork className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready for Stage 3: Case Reconstruction
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            All transaction metadata, plain-language stories, and multi-party evidence files are now verified with traceable provenance.
          </p>
        </div>

        {/* Feature roadmap cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2.5">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Transaction Truth Graph
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Multi-party relationship mapping linking Marketplace, Seller, Gateway, and Courier.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2.5">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Redressal Route Matrix
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Maps which specific grievance channel applies to which party and which issue.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2.5">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Notice & Complaint Dossier
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Generates formal consumer notice drafts with evidence citations and timeline.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SecondaryButton
            size="md"
            onClick={onBackToSummary}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Review Evidence Summary
          </SecondaryButton>
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-slate-600 underline px-3 py-2 transition-colors"
          >
            Start Another Test Case
          </button>
        </div>

      </div>
    </div>
  );
};
