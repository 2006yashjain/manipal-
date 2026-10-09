import React, { useState } from 'react';
import { 
  FileText, 
  Edit3, 
  Check, 
  X, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';
import { EvidenceFact, EvidenceConflict } from '../types/evidence';
import { ProgressStepper } from '../components/ProgressStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

interface FactVerificationProps {
  facts: EvidenceFact[];
  conflicts: EvidenceConflict[];
  onUpdateFacts: (facts: EvidenceFact[]) => void;
  onProceedToSummary: () => void;
  onBackToUpload: () => void;
}

export const FactVerification: React.FC<FactVerificationProps> = ({
  facts,
  conflicts,
  onUpdateFacts,
  onProceedToSummary,
  onBackToUpload,
}) => {
  const [editingFactId, setEditingFactId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const startEdit = (fact: EvidenceFact) => {
    setEditingFactId(fact.id);
    setEditValue(fact.value);
  };

  const cancelEdit = () => {
    setEditingFactId(null);
    setEditValue('');
  };

  const saveEdit = (id: string) => {
    onUpdateFacts(
      facts.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            value: editValue,
            correctedValue: editValue,
            isCorrected: editValue !== f.originalValue,
            status: editValue !== f.originalValue ? 'User corrected' : f.status,
          };
        }
        return f;
      })
    );
    setEditingFactId(null);
  };

  const revertFact = (id: string) => {
    onUpdateFacts(
      facts.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            value: f.originalValue,
            correctedValue: undefined,
            isCorrected: false,
            status: 'Document supported',
          };
        }
        return f;
      })
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Document supported':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Document supported
          </span>
        );
      case 'Consumer reported':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Info className="w-3 h-3 text-indigo-600" /> Consumer reported
          </span>
        );
      case 'User corrected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
            <Edit3 className="w-3 h-3 text-purple-600" /> User corrected
          </span>
        );
      case 'Disputed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Disputed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const correctedCount = facts.filter(f => f.isCorrected).length;

  return (
    <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToUpload}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Evidence Upload
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verify & Correct Extracted Facts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stage 2: Review facts extracted from your documents. You remain in full control to adjust any field.
          </p>
        </div>

        {correctedCount > 0 && (
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-purple-600" />
            <span>{correctedCount} fact{correctedCount > 1 ? 's' : ''} edited by you</span>
          </div>
        )}
      </div>

      {/* Progress Stepper - Step 03 Review Active */}
      <ProgressStepper currentStep={3} />

      {/* Synthetic Conflict Warning Section */}
      {conflicts.length > 0 && (
        <div className="mb-8 space-y-3">
          {conflicts.map((conf) => (
            <div
              key={conf.id}
              className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 shadow-subtle space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-amber-950">
                      Possible Inconsistency: {conf.factName}
                    </h3>
                    <span className="text-[11px] text-amber-800 font-medium">Status: {conf.status}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                  Cross-Source Flag
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                    Source A: {conf.sourceA}
                  </span>
                  <span className="font-semibold text-slate-900">{conf.valueA}</span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                    Source B: {conf.sourceB}
                  </span>
                  <span className="font-semibold text-slate-900">{conf.valueB}</span>
                </div>
              </div>

              <p className="text-[11px] text-amber-900/90 leading-relaxed pt-1 border-t border-amber-200">
                <strong className="font-semibold text-amber-950">Neutral Observation:</strong> {conf.neutralObservation}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Facts Table / Card List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Extracted Facts with Traceable Provenance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Every fact is grounded in specific source documents and coordinates.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Total {facts.length} Facts
          </span>
        </div>

        {/* List of Facts */}
        <div className="space-y-3.5">
          {facts.map((fact) => {
            const isEditing = editingFactId === fact.id;

            return (
              <div
                key={fact.id}
                className={`p-4 rounded-2xl border transition-all ${
                  fact.isCorrected
                    ? 'bg-purple-50/40 border-purple-300'
                    : fact.hasConflict
                    ? 'bg-amber-50/30 border-amber-200'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  
                  {/* Fact Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        {fact.fact}
                      </span>
                      {getStatusBadge(fact.status)}
                    </div>

                    {/* Value or Inline Edit Box */}
                    {isEditing ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-xl border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => saveEdit(fact.id)}
                          className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-3 py-2 bg-white text-slate-600 border border-slate-300 rounded-xl text-xs font-medium hover:bg-slate-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {fact.value}
                        </p>

                        {/* If user corrected, show preserved original history */}
                        {fact.isCorrected && (
                          <div className="text-[11px] text-purple-700 flex items-center gap-2 mt-1">
                            <span>Original Extracted: <span className="line-through">{fact.originalValue}</span></span>
                            <span>•</span>
                            <span className="font-bold">Corrected by User</span>
                            <button
                              type="button"
                              onClick={() => revertFact(fact.id)}
                              className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-0.5 text-[10px] ml-1"
                              title="Revert to original"
                            >
                              <RotateCcw className="w-2.5 h-2.5" /> Revert
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Provenance Coordinates */}
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span className="font-medium text-slate-700">Source: {fact.source}</span>
                      <span>({fact.sourceLocation})</span>
                    </div>

                  </div>

                  {/* Edit Action Button */}
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => startEdit(fact)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs self-start"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Safety Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Provenance Guarantee:</strong> Every fact maintains verifiable grounding in specific document pages and chat logs. User corrections are explicitly tagged to preserve auditability.
          </span>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <SecondaryButton size="md" onClick={onBackToUpload}>
            Back to Evidence Vault
          </SecondaryButton>

          <PrimaryButton
            size="lg"
            onClick={onProceedToSummary}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 font-semibold"
          >
            Confirm Facts & View Evidence Summary
          </PrimaryButton>
        </div>

      </div>

    </div>
  );
};
