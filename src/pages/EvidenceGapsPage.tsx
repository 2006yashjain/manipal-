import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertOctagon, AlertTriangle, Info, FileSearch, ChevronDown, ChevronUp } from 'lucide-react';
import { EvidenceGapReport, EvidenceGap, EvidenceGapPriority } from '../types/gaps';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressStepper } from '../components/ProgressStepper';

interface EvidenceGapsPageProps {
  gapReport: EvidenceGapReport;
  onContinueToLegal: () => void;
  onBackToTimeline: () => void;
}

const priorityConfig: Record<EvidenceGapPriority, {
  label: string;
  icon: React.ReactNode;
  containerClass: string;
  badgeClass: string;
  dotClass: string;
}> = {
  Critical: {
    label: 'Critical',
    icon: <AlertOctagon className="w-4 h-4 text-red-600" />,
    containerClass: 'border-red-200 bg-red-50/40',
    badgeClass: 'text-red-700 bg-red-50 border-red-200',
    dotClass: 'bg-red-500',
  },
  Important: {
    label: 'Important',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    containerClass: 'border-amber-200 bg-amber-50/30',
    badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  Informational: {
    label: 'Informational',
    icon: <Info className="w-4 h-4 text-slate-500" />,
    containerClass: 'border-slate-200 bg-white',
    badgeClass: 'text-slate-600 bg-slate-50 border-slate-200',
    dotClass: 'bg-slate-400',
  },
};

const GapCard: React.FC<{ gap: EvidenceGap }> = ({ gap }) => {
  const [expanded, setExpanded] = useState(gap.priority !== 'Informational');
  const config = priorityConfig[gap.priority];

  return (
    <div className={`rounded-xl border p-4 ${config.containerClass}`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold border rounded-full px-2 py-0.5 ${config.badgeClass}`}>
              {config.label}
            </span>
            <h3 className="text-sm font-bold text-slate-800">{gap.title}</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{gap.description}</p>

          {expanded && (
            <div className="mt-3 space-y-3">
              {/* Available evidence */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Evidence</p>
                {gap.availableEvidence.length > 0 ? (
                  <ul className="space-y-0.5">
                    {gap.availableEvidence.map((e, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">None currently in record</p>
                )}
              </div>

              {/* Missing evidence */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Missing Evidence</p>
                <div className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1" />
                  <p className="text-xs text-red-700">{gap.missingEvidence}</p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-white/70 rounded-lg border border-slate-200 p-2.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recommendation</p>
                <p className="text-xs text-slate-700 leading-relaxed">{gap.recommendation}</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 p-1 rounded-lg hover:bg-white/60 text-slate-400 transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export const EvidenceGapsPage: React.FC<EvidenceGapsPageProps> = ({
  gapReport,
  onContinueToLegal,
  onBackToTimeline,
}) => {
  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Progress */}
      <ProgressStepper currentStep={3} />

      {/* Header */}
      <div className="mt-8 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
          Stage 3 — Case Reconstruction
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Evidence Gap Analysis
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
          The following gaps were identified by comparing the facts available in the record against what would typically be expected to support each claimed event.
          Gaps are not a measure of case strength — they indicate what evidence is currently missing from the record.
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Critical', count: gapReport.criticalCount, cls: 'border-red-200 bg-red-50 text-red-700', dot: 'bg-red-500' },
          { label: 'Important', count: gapReport.importantCount, cls: 'border-amber-200 bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
          { label: 'Informational', count: gapReport.informationalCount, cls: 'border-slate-200 bg-white text-slate-600', dot: 'bg-slate-400' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 flex items-center gap-3 ${s.cls}`}>
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
            <div>
              <div className="text-xl font-extrabold">{s.count}</div>
              <div className="text-[11px] font-semibold">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mb-6 flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
        <FileSearch className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Gap classification is based on the expected evidentiary record for a consumer dispute of this type. Classification as "Critical" does not mean the case is invalid — it means the record is currently incomplete in that area. Providing the missing evidence may address the gap.
        </p>
      </div>

      {/* Critical gaps */}
      {gapReport.criticalCount > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-3">Critical Gaps</p>
          <div className="space-y-3">
            {gapReport.gaps
              .filter(g => g.priority === 'Critical')
              .map(g => <GapCard key={g.id} gap={g} />)}
          </div>
        </div>
      )}

      {/* Important gaps */}
      {gapReport.importantCount > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Important Gaps</p>
          <div className="space-y-3">
            {gapReport.gaps
              .filter(g => g.priority === 'Important')
              .map(g => <GapCard key={g.id} gap={g} />)}
          </div>
        </div>
      )}

      {/* Informational gaps */}
      {gapReport.informationalCount > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Informational Gaps</p>
          <div className="space-y-3">
            {gapReport.gaps
              .filter(g => g.priority === 'Informational')
              .map(g => <GapCard key={g.id} gap={g} />)}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SecondaryButton
          onClick={onBackToTimeline}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Timeline
        </SecondaryButton>
        <button
          onClick={onContinueToLegal}
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
        >
          Continue: Legal Analysis
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
