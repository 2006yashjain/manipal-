import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Info,
  Copy,
  Download,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { CaseBrief } from '../types/caseBrief';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressStepper } from '../components/ProgressStepper';
import { LegalSafetyBanner } from '../components/LegalSafetyBanner';

interface CaseBriefPageProps {
  brief: CaseBrief;
  onBackToLegal: () => void;
  onContinueToComplaint: () => void;
}

const priorityStyles: Record<string, string> = {
  Critical: 'bg-red-50 border-red-200 text-red-700',
  Important: 'bg-amber-50 border-amber-200 text-amber-700',
  Informational: 'bg-sky-50 border-sky-200 text-sky-700',
};

export const CaseBriefPage: React.FC<CaseBriefPageProps> = ({
  brief,
  onBackToLegal,
  onContinueToComplaint,
}) => {
  const [copied, setCopied] = useState(false);

  const copyBrief = () => {
    const text = buildTextBrief(brief);
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const printBrief = () => {
    window.print();
  };

  return (
    <div className="py-10 md:py-12 max-w-5xl mx-auto px-4 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <ProgressStepper currentStep={5} />

      <LegalSafetyBanner />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-900 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Case Brief</h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1">
                  <CheckCircle2 className="w-3 h-3" /> Generated
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Reference: <span className="font-mono font-semibold text-slate-800">{brief.reference.id}</span>
                {' • '}
                Generated {new Date(brief.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyBrief}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy text'}
            </button>
            <button
              onClick={printBrief}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1-3 Parties & Transaction */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <SectionHeader num="01–03" title="Parties & Transaction" />
          <div className="grid md:grid-cols-2 gap-5">
            <BriefCard label="Complainant (Consumer)">
              <div className="font-semibold text-slate-900">{brief.consumer.name}</div>
              <div className="text-xs text-slate-500 mt-1">{brief.consumer.relationship}</div>
            </BriefCard>

            <BriefCard label="Opposite Parties">
              <ul className="space-y-1.5">
                {brief.oppositeParties.length ? (
                  brief.oppositeParties.map((p, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-semibold text-slate-800">{p.name}</span>
                      <span className="text-xs text-slate-500 ml-1.5">({p.role} · {p.relationship})</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500">[Information required]</li>
                )}
              </ul>
            </BriefCard>

            <BriefCard label="Product / Service">
              <div className="text-sm font-semibold text-slate-800">{brief.transaction.productService}</div>
              <div className="text-xs text-slate-500 mt-1">
                {brief.transaction.orderId && <>Order: <span className="font-mono">{brief.transaction.orderId}</span> · </>}
                {brief.transaction.purchaseDate && <>Date: {brief.transaction.purchaseDate}</>}
              </div>
            </BriefCard>

            <BriefCard label="Consideration & Platform">
              <div className="text-sm font-semibold text-slate-800">{brief.transaction.amount}</div>
              <div className="text-xs text-slate-500 mt-1">
                {brief.transaction.marketplace || '[Platform not specified]'}
              </div>
            </BriefCard>

            <BriefCard label="Eligibility Screening">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                {brief.eligibility.status}
              </div>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">{brief.eligibility.summary}</p>
            </BriefCard>

            <BriefCard label="Requested Remedy">
              <div className="text-sm font-semibold text-slate-800">{brief.requestedRemedy}</div>
            </BriefCard>
          </div>
        </section>

        {/* 09 Chronology */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <SectionHeader num="09" title="Chronology" />
          {brief.chronology.length ? (
            <ol className="relative border-l border-slate-200 ml-3 space-y-4">
              {brief.chronology.map((e, i) => (
                <li key={i} className="ml-5">
                  <span className="absolute -left-1.5 flex w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white"></span>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{e.date}</div>
                  <div className="text-sm text-slate-800 mt-0.5">{e.event}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Source: {e.source}</div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyHint text="[Chronology unavailable]" />
          )}
        </section>

        {/* 10-12 Facts */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <SectionHeader num="10–12" title="Facts — Verified · User-Reported · Disputed" />
          <div className="grid lg:grid-cols-2 gap-5">
            <FactGroup
              title="Verified Facts (Document Supported)"
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              items={brief.verifiedFacts.map(f => ({
                head: f.fact,
                value: f.value + (f.evidenceRefs.length ? `  ·  ${f.evidenceRefs.join(' ')}` : ''),
                status: f.status,
                tone: 'green',
              }))}
            />
            <FactGroup
              title="User-Reported Facts"
              icon={<Info className="w-3.5 h-3.5 text-indigo-600" />}
              items={brief.userReportedFacts.map(f => ({
                head: f.fact,
                value: f.value,
                status: 'Consumer reported',
                tone: 'indigo',
              }))}
            />
          </div>
          {brief.disputedFacts.length > 0 && (
            <div className="mt-5">
              <FactGroup
                title="Possible Inconsistencies (Disputed Facts)"
                icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                items={brief.disputedFacts.map(d => ({
                  head: d.fact,
                  value: `${d.sourceA}: ${d.valueA}\n${d.sourceB}: ${d.valueB}`,
                  status: d.note,
                  tone: 'amber',
                }))}
              />
            </div>
          )}
        </section>

        {/* 13 Evidence Index */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <SectionHeader num="13" title="Evidence Index" />
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="pb-2 pl-2 pr-3 font-semibold">Ref</th>
                  <th className="pb-2 pr-3 font-semibold">Document</th>
                  <th className="pb-2 pr-3 font-semibold">Type</th>
                  <th className="pb-2 pr-3 font-semibold">Supports</th>
                  <th className="pb-2 pr-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {brief.evidenceIndex.map(e => (
                  <tr key={e.refId} className="border-b border-slate-100 last:border-0">
                    <td className="py-2.5 pl-2 pr-3">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {e.refId}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-slate-800">{e.filename}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{e.type}</td>
                    <td className="py-2.5 pr-3 text-slate-600 text-xs max-w-xs">
                      {e.supportsFacts.slice(0, 2).join('; ')}
                      {e.supportsFacts.length > 2 && <span className="text-slate-400"> · +{e.supportsFacts.length - 2}</span>}
                    </td>
                    <td className="py-2.5 pr-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                          e.reviewStatus === 'Accepted'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : e.reviewStatus === 'Reviewed'
                            ? 'bg-sky-50 border-sky-200 text-sky-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        {e.reviewStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 14-15 Gaps & Inconsistencies */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <SectionHeader num="14–15" title="Evidence Gaps & Possible Inconsistencies" />
          {brief.evidenceGaps.length ? (
            <div className="grid md:grid-cols-2 gap-3 mb-5">
              {brief.evidenceGaps.map(g => (
                <div
                  key={g.title}
                  className={`rounded-xl border p-4 ${priorityStyles[g.priority]}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-sm font-bold">{g.title}</div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-white/60 border border-current/20">
                      {g.priority}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{g.description}</p>
                  <p className="text-xs mt-2 font-semibold">Missing: {g.missingEvidence}</p>
                  <p className="text-xs mt-1 opacity-80">→ {g.recommendation}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyHint text="No unresolved evidence gaps detected." />
          )}
          {brief.inconsistencies.length > 0 && (
            <div className="mt-2 space-y-2">
              {brief.inconsistencies.map((inc, i) => (
                <div key={i} className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <div className="text-sm font-bold">{inc.title}</div>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">{inc.description}</p>
                  <p className="text-xs mt-1 opacity-80">Sources: {inc.sources.join(' · ')}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 16-17 Legal & Assessment */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <SectionHeader num="16–17" title="Relevant Legal Provisions & Preliminary Assessment" />
          {brief.legalProvisions.length ? (
            <div className="space-y-3 mb-5">
              {brief.legalProvisions.map((p, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {p.provision}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{p.title}</span>
                    <span className="text-xs text-slate-500">— {p.act}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.relevance}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <div className="text-sm font-bold text-slate-800">Preliminary Assessment</div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{brief.preliminaryAssessment}</p>
          </div>
        </section>

        {/* 19 Limitations */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
          <SectionHeader num="19" title="Limitations & Missing Information" />
          <ul className="space-y-1.5">
            {brief.limitations.map((l, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <XCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Nav */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <SecondaryButton onClick={onBackToLegal} icon={<ArrowLeft className="w-4 h-4" />}>
          Review Legal Analysis
        </SecondaryButton>
        <button
          onClick={onContinueToComplaint}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          Continue to Complaint Draft
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-slate-100 pb-3">
      <span className="text-xs font-mono font-bold text-slate-400">{num}</span>
      <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h3>
    </div>
  );
}

function BriefCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="text-sm text-slate-400 italic text-center py-4 border border-dashed border-slate-200 rounded-xl">
      {text}
    </div>
  );
}

function FactGroup({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: { head: string; value: string; status: string; tone: 'green' | 'indigo' | 'amber' }[];
}) {
  const tone = {
    green: 'border-emerald-200 bg-emerald-50/50',
    indigo: 'border-indigo-200 bg-indigo-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
  };
  return (
    <div className={`rounded-xl border p-4 ${tone[items[0]?.tone || 'indigo']}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <div className="text-sm font-bold text-slate-800">{title}</div>
        <div className="ml-auto text-xs text-slate-500">{items.length}</div>
      </div>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="bg-white/70 rounded-lg border border-slate-200 p-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{it.head}</div>
              <div className="text-sm text-slate-800 mt-0.5 whitespace-pre-wrap break-words">{it.value}</div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">{it.status}</div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyHint text="No items in this section." />
      )}
    </div>
  );
}

function buildTextBrief(brief: CaseBrief): string {
  const parts: string[] = [];
  parts.push(`NYAYASETU AI — CASE BRIEF`);
  parts.push(`Reference: ${brief.reference.id}`);
  parts.push(`Generated: ${new Date(brief.generatedAt).toLocaleString()}`);
  parts.push('');
  parts.push(`Consumer: ${brief.consumer.name}`);
  parts.push(`Opposite parties: ${brief.oppositeParties.map(p => `${p.name} (${p.role})`).join('; ')}`);
  parts.push(`Transaction: ${brief.transaction.productService} · ${brief.transaction.amount}`);
  parts.push('');
  parts.push('VERIFIED FACTS');
  brief.verifiedFacts.forEach(f => parts.push(`- ${f.fact}: ${f.value}`));
  parts.push('');
  parts.push('PRELIMINARY ASSESSMENT');
  parts.push(brief.preliminaryAssessment);
  return parts.join('\n');
}
