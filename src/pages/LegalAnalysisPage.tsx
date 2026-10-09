import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, AlertTriangle,
  ExternalLink, Info, ChevronDown, ChevronUp, Scale,
  ShieldCheck, ClipboardList
} from 'lucide-react';
import { LegalProvision, LegalMapping, PreliminaryAssessment } from '../types/legal';
import { EvidenceGap } from '../types/gaps';
import { EvidenceFact } from '../types/evidence';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressStepper } from '../components/ProgressStepper';

interface LegalAnalysisPageProps {
  provisions: LegalProvision[];
  mappings: LegalMapping[];
  assessment: PreliminaryAssessment;
  gaps: EvidenceGap[];
  facts: EvidenceFact[];
  onContinueToBrief: () => void;
  onBackToGaps: () => void;
}

// A single provision + mapping card
const ProvisionCard: React.FC<{
  provision: LegalProvision;
  mapping: LegalMapping | undefined;
  facts: EvidenceFact[];
}> = ({ provision, mapping, facts }) => {
  const [open, setOpen] = useState(true);

  const relatedFacts = mapping
    ? facts.filter(f => mapping.factIds.includes(f.id))
    : [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        className="w-full text-left flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5">
              {provision.provision}
            </span>
            <span className="text-[10px] text-slate-400">{provision.act}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">{provision.title}</h3>
          {mapping && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{mapping.factorLabel}</p>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100">

          {/* Provision text */}
          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Provision Summary</p>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{provision.summary}"
            </p>
            <a
              href={provision.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:underline"
            >
              <ExternalLink className="w-2.5 h-2.5" /> {provision.sourceName}
            </a>
          </div>

          {/* Case fact */}
          {mapping && (
            <>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Relevant Case Fact</p>
                <p className="text-xs text-slate-800 leading-relaxed bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                  {mapping.caseFact}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Why This May Be Relevant</p>
                <p className="text-xs text-slate-700 leading-relaxed">{mapping.relevanceReason}</p>
              </div>

              {/* Evidence supporting facts */}
              {relatedFacts.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Evidence Supporting Facts</p>
                  <div className="space-y-1.5">
                    {relatedFacts.map(f => (
                      <div key={f.id} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{f.fact}:</span>
                        <span>{f.isCorrected ? f.correctedValue : f.value}</span>
                        <span className="text-slate-400 italic ml-auto">({f.source})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing information */}
              {mapping.missingInformation.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Missing Information</p>
                  <div className="space-y-1">
                    {mapping.missingInformation.map((m, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conflicts */}
              {mapping.conflicts.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Conflicting Information</p>
                  <div className="space-y-1">
                    {mapping.conflicts.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-2">
                        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const LegalAnalysisPage: React.FC<LegalAnalysisPageProps> = ({
  provisions,
  mappings,
  assessment,
  gaps: _gaps,
  facts,
  onContinueToBrief,
  onBackToGaps,
}) => {
  const [activeTab, setActiveTab] = useState<'provisions' | 'assessment'>('assessment');

  const getMappingForProvision = (provisionId: string) =>
    mappings.find(m => m.provisionId === provisionId);

  return (
    <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Progress */}
      <ProgressStepper currentStep={4} />

      {/* Header */}
      <div className="mt-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
          Stage 4 — Legal Analysis
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Preliminary Legal Analysis
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
          This section maps the verified facts of this case to potentially relevant legal provisions and principles.
          This is not legal advice and does not determine liability or predict any outcome.
        </p>
      </div>

      {/* Legal disclaimer banner */}
      <div className="mb-6 flex items-start gap-3 bg-slate-900 text-white rounded-xl px-4 py-4">
        <Scale className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Legal Disclaimer</p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Preliminary legal information only. This analysis is based on the information and sources available in this prototype.
            It does not constitute legal advice, determine liability, or predict the outcome of a dispute.
            Consult an advocate or legal professional for advice specific to your situation.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { id: 'assessment', label: 'Preliminary Assessment', icon: <ClipboardList className="w-3.5 h-3.5" /> },
          { id: 'provisions', label: 'Legal Provisions', icon: <BookOpen className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ASSESSMENT TAB */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          {/* Assessment summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-900">Preliminary Assessment</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-4">
              {assessment.summary}
            </p>
          </div>

          {/* Supported facts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Evidence-Supported Facts ({assessment.supportedFacts.length})
            </h2>
            <div className="space-y-2">
              {assessment.supportedFacts.map(sf => (
                <div key={sf.factId} className="flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">{sf.fact}:</span>{' '}
                    <span className="text-slate-600">{sf.value}</span>
                    <span className="text-slate-400 ml-2">— {sf.evidenceSource}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unsupported claims */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Facts Not Currently Evidenced ({assessment.unsupportedClaims.length})
            </h2>
            <div className="space-y-3">
              {assessment.unsupportedClaims.map((uc, i) => (
                <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-800">{uc.claim}</p>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">{uc.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant provisions — summary list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Potentially Relevant Legal Provisions
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              See the "Legal Provisions" tab for full fact-to-law mapping with sources.
            </p>
            <div className="space-y-2">
              {provisions
                .filter(p => assessment.relevantProvisionIds.includes(p.id))
                .map(p => (
                  <div key={p.id} className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 shrink-0 mt-0.5">
                      {p.provision}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{p.title}</p>
                      <p className="text-[10px] text-slate-400">{p.act}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Limitations */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Analysis Limitations
            </h2>
            <ul className="space-y-1.5">
              {assessment.limitations.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-slate-300 mt-0.5 shrink-0">—</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* PROVISIONS TAB */}
      {activeTab === 'provisions' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="font-semibold text-slate-700">Fact-to-law mapping:</span> Each provision below is shown alongside the specific case fact that makes it potentially relevant,
            the evidence supporting that fact, and any missing information. This is preliminary only.
          </p>
          {provisions.map(provision => (
            <ProvisionCard
              key={provision.id}
              provision={provision}
              mapping={getMappingForProvision(provision.id)}
              facts={facts}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SecondaryButton
          onClick={onBackToGaps}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Evidence Gaps
        </SecondaryButton>
        <button
          onClick={onContinueToBrief}
          className="inline-flex items-center gap-2 bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-indigo-800 transition-colors"
        >
          Prepare Case Brief
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
