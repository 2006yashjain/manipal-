import React from 'react';
import { FileUp, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { ConsumerCaseInput } from '../types';
import { SecondaryButton } from '../components/SecondaryButton';

interface EvidenceUpcomingProps {
  caseData: ConsumerCaseInput;
  onBackToIntake: () => void;
  onReset: () => void;
}

export const EvidenceUpcoming: React.FC<EvidenceUpcomingProps> = ({
  caseData,
  onBackToIntake,
  onReset,
}) => {
  return (
    <div className="py-12 md:py-20 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-card text-center">
        
        {/* Stage 1 Complete Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Stage 1 Intake Complete</span>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-subtle">
          <FileUp className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Evidence collection is the next stage.
        </h2>

        <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          Stage 2 will allow you to upload invoices, receipts, screenshots, delivery records, and seller communications to corroborate this case file.
        </p>

        {/* Case Summary Checkpoint */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-lg mx-auto space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-800 pb-2 border-b border-slate-200">
            <span>Case Reference: {caseData.id}</span>
            <span className="text-indigo-600">Dossier Initialized</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Transaction:</span>
            <span className="font-medium text-slate-800">{caseData.platform || 'ExampleMart'}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Amount:</span>
            <span className="font-medium text-slate-800">₹{caseData.amount || '54,999'}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Remedy Requested:</span>
            <span className="font-medium text-slate-800">{caseData.remedies.join(', ') || 'Refund'}</span>
          </div>
        </div>

        {/* Informational callout */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-left flex items-start gap-3 max-w-lg mx-auto">
          <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-950 leading-relaxed">
            <strong>Stage 1 Checkpoint Reached:</strong> Your dispute narrative, transaction metadata, and desired remedies are structured and ready for multi-party evidence ingestion in Stage 2.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SecondaryButton
            size="md"
            onClick={onBackToIntake}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Review & Edit Intake
          </SecondaryButton>
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-slate-600 underline px-3 py-2 transition-colors"
          >
            Start Fresh Case
          </button>
        </div>

      </div>
    </div>
  );
};
