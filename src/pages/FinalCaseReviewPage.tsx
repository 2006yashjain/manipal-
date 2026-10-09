import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  FileCheck2,
  ShieldAlert,
  Check,
  ClipboardCheck,
} from 'lucide-react';
import { CompletenessSummary } from '../types/reviewer';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressStepper } from '../components/ProgressStepper';
import { LegalSafetyBanner } from '../components/LegalSafetyBanner';

interface FinalCaseReviewPageProps {
  summary: CompletenessSummary;
  onBackToComplaint: () => void;
  onFinalize: () => void;
}

export const FinalCaseReviewPage: React.FC<FinalCaseReviewPageProps> = ({
  summary,
  onBackToComplaint,
  onFinalize,
}) => {
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [confirm3, setConfirm3] = useState(false);
  const allConfirmed = confirm1 && confirm2 && confirm3;

  return (
    <div className="py-10 md:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      <ProgressStepper currentStep={5} />

      <LegalSafetyBanner />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-900 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Final Case Review
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-1">
                <ShieldCheck className="w-3 h-3" /> Pre-submission
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Review your record completeness and limitations before finalising this complaint draft.
            </p>
          </div>
        </div>

        {/* Completeness scores */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CompletenessCard
            label="Record Completeness"
            score={summary.recordCompleteness}
            hint="Core data fields captured"
          />
          <CompletenessCard
            label="Evidence Completeness"
            score={summary.evidenceCompleteness}
            hint="Documented supporting material"
          />
        </div>
      </div>

      {/* 1. Missing items */}
      <Section num="01" title="Missing Information">
        {summary.missingItems.length ? (
          <ul className="space-y-2">
            {summary.missingItems.map((it, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-amber-800">{it}</span>
              </li>
            ))}
          </ul>
        ) : (
          <GoodHint text="No core data fields are currently missing." />
        )}
      </Section>

      {/* 2. Evidence conflicts */}
      <Section num="02" title="Evidence Conflicts">
        {summary.evidenceConflicts.length ? (
          <ul className="space-y-2">
            {summary.evidenceConflicts.map((it, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/60 p-3 text-sm">
                <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-red-800">{it}</span>
              </li>
            ))}
          </ul>
        ) : (
          <GoodHint text="No conflicts detected between evidence sources." />
        )}
      </Section>

      {/* 3. Timeline inconsistencies */}
      <Section num="03" title="Timeline Inconsistencies">
        {summary.timelineInconsistencies.length ? (
          <ul className="space-y-2">
            {summary.timelineInconsistencies.map((it, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-amber-800">{it}</span>
              </li>
            ))}
          </ul>
        ) : (
          <GoodHint text="No timeline inconsistencies detected." />
        )}
      </Section>

      {/* 4. Legal review points */}
      <Section num="04" title="Legal Review Points">
        {summary.legalReviewPoints.length ? (
          <ul className="space-y-2">
            {summary.legalReviewPoints.map((it, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-indigo-200 bg-indigo-50/60 p-3 text-sm">
                <Info className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-800">{it}</span>
              </li>
            ))}
          </ul>
        ) : (
          <GoodHint text="No specific legal review points flagged." />
        )}
      </Section>

      {/* 5. Complaint limitations */}
      <Section num="05" title="Complaint Limitations">
        <ul className="space-y-2">
          {summary.complaintLimitations.map((it, i) => (
            <li key={i} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <ShieldAlert className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">{it}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Confirmations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm mt-6">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <FileCheck2 className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
            Comfirmation & Declaration
          </h3>
        </div>

        <div className="space-y-3">
          <ConfirmRow
            checked={confirm1}
            onChange={setConfirm1}
            label="All information provided in this draft is accurate to the best of my knowledge."
          />
          <ConfirmRow
            checked={confirm2}
            onChange={setConfirm2}
            label="I have reviewed the generated complaint draft section-by-section."
          />
          <ConfirmRow
            checked={confirm3}
            onChange={setConfirm3}
            label="I acknowledge that missing information, evidence gaps, and conflicts have been identified and require my attention before any formal filing."
          />
        </div>

        <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-indigo-800 leading-relaxed">
              <strong className="font-semibold">No legal certification is expressed or implied.</strong> This draft was prepared for organisational purposes only with a prototype tool. You should consult a qualified advocate before initiating any formal proceedings. Statutory requirements (jurisdiction, limitation, court fees, forms and formats) must be verified independently.
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <SecondaryButton onClick={onBackToComplaint} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Complaint Draft
        </SecondaryButton>
        <button
          onClick={onFinalize}
          disabled={!allConfirmed}
          className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all ${
            allConfirmed
              ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Check className="w-4 h-4" />
          Finalise Complaint Draft
        </button>
      </div>
    </div>
  );
};

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm mt-4 first:mt-0">
      <div className="mb-4 flex items-baseline gap-3 border-b border-slate-100 pb-3">
        <span className="text-xs font-mono font-bold text-slate-400">{num}</span>
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function CompletenessCard({
  label,
  score,
  hint,
}: {
  label: string;
  score: number;
  hint: string;
}) {
  const tone =
    score >= 80
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : score >= 60
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-red-600 bg-red-50 border-red-200';
  return (
    <div className={`rounded-xl border p-4 ${tone.split(' ').slice(1).join(' ')}`}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">{label}</div>
          <div className="text-xs text-slate-500 mt-0.5">{hint}</div>
        </div>
        <div className={`text-3xl font-extrabold ${tone.split(' ')[0]}`}>{score}%</div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/70 border border-current/20 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function GoodHint({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-sm flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
      <span className="text-emerald-800">{text}</span>
    </div>
  );
}

function ConfirmRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all select-none ${
        checked
          ? 'border-emerald-300 bg-emerald-50/70'
          : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
          checked ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" />}
      </button>
      <span className={`text-sm leading-relaxed ${checked ? 'text-emerald-900' : 'text-slate-700'}`}>
        {label}
      </span>
    </label>
  );
}
