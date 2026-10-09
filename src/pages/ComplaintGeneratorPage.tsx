import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Pencil,
  Save,
  RotateCcw,
  Copy,
  Download,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { ComplaintDraft } from '../types/complaint';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressStepper } from '../components/ProgressStepper';
import { LegalSafetyBanner } from '../components/LegalSafetyBanner';

interface ComplaintGeneratorPageProps {
  complaint: ComplaintDraft;
  onUpdateSection: (sectionId: string, content: string) => void;
  onRegenerateSection: (sectionId: string) => void;
  onBackToBrief: () => void;
  onContinueToFinal: () => void;
}

export const ComplaintGeneratorPage: React.FC<ComplaintGeneratorPageProps> = ({
  complaint,
  onUpdateSection,
  onRegenerateSection,
  onBackToBrief,
  onContinueToFinal,
}) => {
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState<string>('');
  const [allCopied, setAllCopied] = useState(false);

  const fullText = useMemo(() => {
    return complaint.sections
      .map(s => `${s.title}\n\n${s.content}`)
      .join('\n\n————————\n\n');
  }, [complaint]);

  const startEdit = (sectionId: string, content: string) => {
    setEditingSectionId(sectionId);
    setDraftContent(content);
  };

  const cancelEdit = () => {
    setEditingSectionId(null);
    setDraftContent('');
  };

  const saveEdit = () => {
    if (editingSectionId) {
      onUpdateSection(editingSectionId, draftContent);
      setEditingSectionId(null);
      setDraftContent('');
    }
  };

  const copyAll = () => {
    navigator.clipboard?.writeText(`${complaint.title}\n\n${complaint.disclaimer}\n\n${fullText}`);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 1800);
  };

  const printAll = () => window.print();

  const infoPlaceholderCount = countPlaceholders(fullText);

  return (
    <div className="py-10 md:py-12 max-w-5xl mx-auto px-4 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <ProgressStepper currentStep={5} />

      <LegalSafetyBanner />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Complaint Draft
                </h2>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border ${complaint.isEdited ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {complaint.isEdited ? (
                    <><Pencil className="w-3 h-3" /> Edited</>
                  ) : (
                    <><CheckCircle2 className="w-3 h-3" /> Draft</>
                  )}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Draft ID: <span className="font-mono font-semibold text-slate-800">{complaint.id}</span>
                {' • '}
                Generated {new Date(complaint.generatedAt).toLocaleString()}
                {complaint.isEdited && (
                  <>
                    {' • '}
                    Last edited {new Date(complaint.lastEditedAt).toLocaleString()}
                  </>
                )}
              </p>
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 max-w-2xl">
                <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Draft generated for review.</strong> This is not an automatically filed complaint.
                  Review every section carefully — [Information required] placeholders indicate missing data.
                  Preliminary screening only.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              {allCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {allCopied ? 'Copied' : 'Copy all'}
            </button>
            <button
              onClick={printAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Placeholder summary */}
        {infoPlaceholderCount > 0 && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-red-700">
                {infoPlaceholderCount} placeholder(s) remain
              </div>
              <div className="text-xs text-red-600 mt-0.5">
                Fill in [Information required] blocks before considering this complaint complete.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {complaint.sections.map(section => {
          const isEditing = editingSectionId === section.id;
          const placeholders = findPlaceholders(section.content);
          return (
            <section
              key={section.id}
              className={`bg-white rounded-2xl border shadow-sm transition-all ${
                isEditing ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200'
              }`}
            >
              <header className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    {section.title}
                  </h3>
                  {placeholders.length > 0 && (
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {placeholders.length} placeholder{placeholders.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => onRegenerateSection(section.id)}
                        title="Reset section content"
                        className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>
                      <button
                        onClick={() => startEdit(section.id, section.content)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <EyeOff className="w-3 h-3" />
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                    </>
                  )}
                </div>
              </header>
              <div className="px-5 sm:px-6 py-4">
                {!isEditing ? (
                  <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {highlightPlaceholders(section.content)}
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={draftContent}
                      onChange={e => setDraftContent(e.target.value)}
                      rows={Math.max(6, draftContent.split('\n').length + 2)}
                      className="w-full font-mono text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none resize-y"
                    />
                    <div className="mt-2 text-[11px] text-slate-500">
                      Tip: Keep [Information required] markers for content the complainant must still provide.
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Disclaimer footer */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-500 leading-relaxed">
        <strong className="text-slate-700 font-semibold">Draft disclaimer: </strong>
        {complaint.disclaimer}
      </div>

      {/* Nav */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <SecondaryButton onClick={onBackToBrief} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Case Brief
        </SecondaryButton>
        <button
          onClick={onContinueToFinal}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          Continue to Final Review
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

function findPlaceholders(content: string): string[] {
  return (content.match(/\[Information required[^\]]*\]/g) || []) as string[];
}

function countPlaceholders(content: string): number {
  return findPlaceholders(content).length;
}

function highlightPlaceholders(content: string): React.ReactNode {
  const parts = content.split(/(\[Information required[^\]]*\])/g);
  return parts.map((p, i) => {
    if (p.startsWith('[Information required')) {
      return (
        <span
          key={i}
          className="inline-block px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-semibold align-baseline mx-0.5"
        >
          <Eye className="w-2.5 h-2.5 inline mr-1 opacity-70" />
          {p}
        </span>
      );
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}
