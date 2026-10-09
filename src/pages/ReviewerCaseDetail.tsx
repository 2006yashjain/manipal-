import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  User,
  Building2,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Flag,
  MessageSquare,
  Send,
  Clock,
  Layers,
  Gavel,
  FileText,
  FileSignature,
  Activity,
  Save,
  Plus,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  CaseRecord,
  ReviewStatus,
  ReviewerNote,
  ReviewerActivity,
  FlaggedEvidence,
  ClarificationRequest,
} from '../types';
import { SecondaryButton } from '../components/SecondaryButton';
import { canTransition, statusTransitionMatrix } from '../services/reviewEngine';

type TabId =
  | 'overview'
  | 'evidence'
  | 'facts'
  | 'graph'
  | 'timeline'
  | 'gaps'
  | 'legal'
  | 'brief'
  | 'complaint'
  | 'review';

const TAB_META: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Info className="w-3.5 h-3.5" /> },
  { id: 'evidence', label: 'Evidence', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'facts', label: 'Verified Facts', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { id: 'graph', label: 'Truth Graph', icon: <Gavel className="w-3.5 h-3.5" /> },
  { id: 'timeline', label: 'Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'gaps', label: 'Evidence Gaps', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { id: 'legal', label: 'Legal Analysis', icon: <Gavel className="w-3.5 h-3.5" /> },
  { id: 'brief', label: 'Case Brief', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'complaint', label: 'Complaint', icon: <FileSignature className="w-3.5 h-3.5" /> },
  { id: 'review', label: 'Notes & Activity', icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

const issueColors: Record<string, string> = {
  defective_not_as_described: 'bg-rose-50 text-rose-700 border-rose-200',
  payment_refund_unresolved: 'bg-orange-50 text-orange-700 border-orange-200',
  product_not_delivered: 'bg-purple-50 text-purple-700 border-purple-200',
};

const statusTone: Record<ReviewStatus, string> = {
  New: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Under Review': 'bg-sky-50 text-sky-700 border-sky-200',
  'Needs Clarification': 'bg-amber-50 text-amber-700 border-amber-200',
  'Evidence Review': 'bg-violet-50 text-violet-700 border-violet-200',
  'Ready for Assessment': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Complaint Drafted': 'bg-teal-50 text-teal-700 border-teal-200',
  Closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

interface ReviewerCaseDetailProps {
  caseRec: CaseRecord;
  onBack: () => void;
  onUpdateNotes: (notes: ReviewerNote[]) => void;
  onUpdateActivity: (activity: ReviewerActivity[]) => void;
  onUpdateFlagged: (flagged: FlaggedEvidence[]) => void;
  onUpdateClarifications: (clar: ClarificationRequest[]) => void;
  onUpdateStatus: (status: ReviewStatus) => void;
}

export const ReviewerCaseDetail: React.FC<ReviewerCaseDetailProps> = ({
  caseRec,
  onBack,
  onUpdateNotes,
  onUpdateActivity,
  onUpdateFlagged,
  onUpdateClarifications,
  onUpdateStatus,
}) => {
  const [tab, setTab] = useState<TabId>('overview');
  const [newNote, setNewNote] = useState('');
  const [noteRelated, setNoteRelated] = useState('Overview');
  const [clarSubject, setClarSubject] = useState('');
  const [clarDesc, setClarDesc] = useState('');
  const [clarRelated, setClarRelated] = useState('Evidence');
  const [flagReason, setFlagReason] = useState<Record<string, string>>({});

  const review = caseRec.review;
  const currentStatus: ReviewStatus = review?.reviewStatus || 'New';

  const addNote = () => {
    if (!newNote.trim()) return;
    const now = new Date().toISOString();
    const note: ReviewerNote = {
      id: `note-${Date.now()}`,
      author: 'Demo Reviewer',
      timestamp: now,
      note: newNote.trim(),
      relatedCaseElement: noteRelated,
    };
    onUpdateNotes([...(review?.reviewerNotes || []), note]);
    onUpdateActivity([
      ...(review?.activityLog || []),
      {
        id: `act-${Date.now()}`,
        timestamp: now,
        actor: 'Demo Reviewer',
        event: `Added reviewer note (${noteRelated})`,
        category: 'Note added',
        details: newNote.trim().slice(0, 60),
      },
    ]);
    setNewNote('');
  };

  const requestClar = () => {
    if (!clarSubject.trim() || !clarDesc.trim()) return;
    const now = new Date().toISOString();
    const item: ClarificationRequest = {
      id: `clar-${Date.now()}`,
      requestedAt: now,
      requestedBy: 'Demo Reviewer',
      subject: clarSubject.trim(),
      description: clarDesc.trim(),
      relatedTo: clarRelated,
      status: 'Pending',
    };
    onUpdateClarifications([...(review?.clarificationRequests || []), item]);
    onUpdateActivity([
      ...(review?.activityLog || []),
      {
        id: `act-${Date.now()}`,
        timestamp: now,
        actor: 'Demo Reviewer',
        event: `Requested clarification: ${item.subject}`,
        category: 'Clarification requested',
        details: clarRelated,
      },
    ]);
    setClarSubject('');
    setClarDesc('');
  };

  const toggleFlag = (evidenceId: string, filename: string) => {
    const reason = (flagReason[evidenceId] || '').trim() || 'Needs manual verification';
    const existing = (review?.flaggedEvidence || []).find(f => f.evidenceId === evidenceId);
    let nextFlagged: FlaggedEvidence[];
    let eventName: string;
    if (existing?.flagged) {
      nextFlagged = (review?.flaggedEvidence || []).map(f =>
        f.evidenceId === evidenceId
          ? { ...f, flagged: false, status: 'Accepted' as const, flagReason: undefined }
          : f
      );
      eventName = `Unflagged evidence: ${filename}`;
    } else {
      nextFlagged = [
        ...(review?.flaggedEvidence || []).filter(f => f.evidenceId !== evidenceId),
        {
          evidenceId,
          flagged: true,
          flagReason: reason,
          status: 'Flagged',
          flaggedAt: new Date().toISOString(),
          flaggedBy: 'Demo Reviewer',
        },
      ];
      eventName = `Flagged evidence: ${filename}`;
    }
    onUpdateFlagged(nextFlagged);
    onUpdateActivity([
      ...(review?.activityLog || []),
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Demo Reviewer',
        event: eventName,
        category: 'Evidence flagged',
        details: reason,
      },
    ]);
  };

  const changeStatus = (next: ReviewStatus) => {
    if (!canTransition(currentStatus, next)) return;
    onUpdateStatus(next);
    onUpdateActivity([
      ...(review?.activityLog || []),
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Demo Reviewer',
        event: `Review status changed: ${currentStatus} → ${next}`,
        category: 'Status changed',
      },
    ]);
  };

  const openActivity = () => setTab('review');

  const tabsAvailable = useMemo(() => {
    const set = new Set<TabId>(['overview', 'evidence', 'facts', 'review']);
    if (caseRec.truthGraph) set.add('graph');
    if (caseRec.timelineEvents) set.add('timeline');
    if (caseRec.evidenceGapReport) set.add('gaps');
    if (caseRec.legalMappings?.length || caseRec.preliminaryAssessment) set.add('legal');
    if (caseRec.caseBrief) set.add('brief');
    if (caseRec.complaint) set.add('complaint');
    return TAB_META.filter(t => set.has(t.id));
  }, [caseRec]);

  return (
    <div className="py-6 md:py-8 max-w-7xl mx-auto px-3 sm:px-6">
      {/* Banner */}
      <div className="rounded-xl bg-indigo-50/60 border border-indigo-200 p-3 flex items-start gap-2 mb-4 text-xs text-indigo-800">
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          <strong className="font-semibold">Reviewer Workspace (Demo).</strong> All actions are recorded in the activity log. No real adjudication controls are exposed.
        </span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              className="mt-1 inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to queue
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  {caseRec.id}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusTone[currentStatus]}`}
                >
                  {currentStatus}
                </span>
                <span
                  className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                    issueColors[caseRec.issueCategory || ''] || 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {issueLabel(caseRec.issueCategory)}
                </span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                {caseRec.story ? caseRec.story.slice(0, 90) + (caseRec.story.length > 90 ? '…' : '') : 'Consumer case review'}
              </h2>
              <div className="mt-1 text-xs text-slate-500 flex flex-wrap gap-3">
                <span><User className="w-3 h-3 inline mr-1" /> Demo Consumer</span>
                <span><Building2 className="w-3 h-3 inline mr-1" /> {caseRec.parties.seller || caseRec.seller || 'Unknown'}</span>
                {caseRec.parties.marketplace && (
                  <span><Building2 className="w-3 h-3 inline mr-1" /> {caseRec.parties.marketplace}</span>
                )}
                {caseRec.amount && (
                  <span><CreditCard className="w-3 h-3 inline mr-1" /> ₹{caseRec.amount}</span>
                )}
                <span><Calendar className="w-3 h-3 inline mr-1" /> {caseRec.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Change status</div>
            <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
              {(statusTransitionMatrix[currentStatus] || []).map(s => (
                <button
                  key={s}
                  onClick={() => changeStatus(s)}
                  className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${statusTone[s]} hover:opacity-90`}
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 overflow-x-auto -mx-2 px-2 pb-1 border-b border-slate-200">
          {tabsAvailable.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                tab === t.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm min-h-[500px]">
        {tab === 'overview' && <OverviewTab caseRec={caseRec} />}
        {tab === 'evidence' && (
          <EvidenceTab
            caseRec={caseRec}
            flagged={review?.flaggedEvidence || []}
            flagReason={flagReason}
            onFlagReasonChange={(id, v) => setFlagReason(p => ({ ...p, [id]: v }))}
            onToggleFlag={toggleFlag}
          />
        )}
        {tab === 'facts' && <FactsTab caseRec={caseRec} />}
        {tab === 'graph' && <GraphTab caseRec={caseRec} />}
        {tab === 'timeline' && <TimelineTab caseRec={caseRec} />}
        {tab === 'gaps' && <GapsTab caseRec={caseRec} />}
        {tab === 'legal' && <LegalTab caseRec={caseRec} />}
        {tab === 'brief' && <BriefTab caseRec={caseRec} />}
        {tab === 'complaint' && <ComplaintTab caseRec={caseRec} />}
        {tab === 'review' && (
          <ReviewTab
            caseRec={caseRec}
            newNote={newNote}
            setNewNote={setNewNote}
            noteRelated={noteRelated}
            setNoteRelated={setNoteRelated}
            addNote={addNote}
            clarSubject={clarSubject}
            setClarSubject={setClarSubject}
            clarDesc={clarDesc}
            setClarDesc={setClarDesc}
            clarRelated={clarRelated}
            setClarRelated={setClarRelated}
            requestClar={requestClar}
          />
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <SecondaryButton onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Queue
        </SecondaryButton>
        <button
          onClick={openActivity}
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800"
        >
          <Activity className="w-3.5 h-3.5" />
          View Activity Log ({(review?.activityLog || []).length})
        </button>
      </div>
    </div>
  );
};

// ============== TAB CONTENT ==============

function OverviewTab({ caseRec }: { caseRec: CaseRecord }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-extrabold text-slate-900">Case Overview</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard title="Consumer / Complainant" icon={<User className="w-4 h-4" />}>
          <div className="text-sm text-slate-800 font-semibold">Demo Consumer</div>
          <div className="text-xs text-slate-500 mt-0.5">Self-registered complainant</div>
        </InfoCard>
        <InfoCard title="Opposite Parties" icon={<Building2 className="w-4 h-4" />}>
          <ul className="text-xs space-y-0.5">
            <li className="text-slate-700"><strong>Seller:</strong> {caseRec.parties.seller || caseRec.seller || '—'}</li>
            <li className="text-slate-700"><strong>Marketplace:</strong> {caseRec.parties.marketplace || caseRec.platform || '—'}</li>
            <li className="text-slate-700"><strong>Payment:</strong> {caseRec.parties.paymentProvider || '—'}</li>
            <li className="text-slate-700"><strong>Logistics:</strong> {caseRec.parties.logistics || '—'}</li>
          </ul>
        </InfoCard>
        <InfoCard title="Transaction" icon={<CreditCard className="w-4 h-4" />}>
          <ul className="text-xs space-y-0.5 text-slate-700">
            <li><strong>Amount:</strong> {caseRec.amount ? `₹${caseRec.amount}` : '—'}</li>
            <li><strong>Order ID:</strong> {caseRec.orderId || '—'}</li>
            <li><strong>Purchase date:</strong> {caseRec.purchaseDate || '—'}</li>
          </ul>
        </InfoCard>
        <InfoCard title="Eligibility" icon={<ShieldCheck className="w-4 h-4" />}>
          <div className="text-xs text-slate-700">
            {caseRec.consumerEligibility ? (
              <>
                <span className="font-semibold">{caseRec.consumerEligibility.statusLabel}</span>
                <p className="mt-1 text-slate-500 leading-relaxed">{caseRec.consumerEligibility.summary}</p>
              </>
            ) : (
              <span className="text-slate-500 italic">No eligibility screening recorded for this reviewer case.</span>
            )}
          </div>
        </InfoCard>
      </div>
      <InfoCard title="Complainant's Narrative" icon={<FileText className="w-4 h-4" />}>
        <p className="text-sm text-slate-700 leading-relaxed">
          {caseRec.story || <span className="italic text-slate-400">No narrative provided.</span>}
        </p>
      </InfoCard>
    </div>
  );
}

function EvidenceTab({
  caseRec,
  flagged,
  flagReason,
  onFlagReasonChange,
  onToggleFlag,
}: {
  caseRec: CaseRecord;
  flagged: FlaggedEvidence[];
  flagReason: Record<string, string>;
  onFlagReasonChange: (id: string, v: string) => void;
  onToggleFlag: (id: string, filename: string) => void;
}) {
  const docs = caseRec.evidenceDocuments || [];
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-slate-900">Evidence Documents ({docs.length})</h3>
        <div className="text-xs text-slate-500">Flag evidence that requires manual verification.</div>
      </div>
      {docs.length === 0 ? (
        <EmptyHint text="No evidence documents uploaded." />
      ) : (
        <div className="space-y-3">
          {docs.map((d, idx) => {
            const f = flagged.find(x => x.evidenceId === d.id);
            const isFlagged = !!f?.flagged;
            const relatedFacts = (caseRec.evidenceFacts || []).filter(ff => ff.source === d.filename);
            return (
              <div
                key={d.id}
                className={`rounded-xl border p-4 transition-all ${
                  isFlagged
                    ? 'border-red-200 bg-red-50/40'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        [E-{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <div className="text-sm font-semibold text-slate-800">{d.filename}</div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {d.category}
                      </span>
                      {isFlagged && (
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          Flagged
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 flex flex-wrap gap-3">
                      <span>{d.fileType}</span>
                      <span>{d.fileSize}</span>
                      <span>Uploaded {d.uploadedAt}</span>
                      <span>Status: {d.processingStatus}</span>
                    </div>
                    {relatedFacts.length > 0 && (
                      <div className="mt-2 text-[11px] text-slate-600">
                        <div className="font-semibold text-slate-700 mb-1">Linked facts:</div>
                        <ul className="grid sm:grid-cols-2 gap-1">
                          {relatedFacts.map(rf => (
                            <li key={rf.id} className="flex items-start gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span><strong>{rf.fact}:</strong> {rf.value.slice(0, 60)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {isFlagged && f?.flagReason && (
                      <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">
                        <Flag className="w-3 h-3 inline mr-1" />
                        Reason: {f.flagReason}
                        {f.flaggedBy && <span className="opacity-75"> · by {f.flaggedBy}</span>}
                      </div>
                    )}
                  </div>
                  <div className="md:w-72 space-y-2">
                    <input
                      placeholder="Reason (optional)"
                      value={flagReason[d.id] || ''}
                      onChange={e => onFlagReasonChange(d.id, e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 focus:border-red-400 focus:ring-1 focus:ring-red-200 outline-none"
                    />
                    <button
                      onClick={() => onToggleFlag(d.id, d.filename)}
                      className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        isFlagged
                          ? 'bg-white border-red-200 text-red-700 hover:bg-red-50'
                          : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      {isFlagged ? 'Remove Flag' : 'Flag for Review'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FactsTab({ caseRec }: { caseRec: CaseRecord }) {
  const facts = caseRec.evidenceFacts || [];
  return (
    <div>
      <h3 className="text-lg font-extrabold text-slate-900 mb-4">
        Verified &amp; Reported Facts ({facts.length})
      </h3>
      {facts.length === 0 ? (
        <EmptyHint text="No facts are currently recorded." />
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {facts.map(f => {
            const tone =
              f.status === 'Document supported'
                ? 'border-emerald-200 bg-emerald-50/40'
                : f.status === 'Disputed'
                ? 'border-red-200 bg-red-50/40'
                : f.status === 'Consumer reported'
                ? 'border-indigo-200 bg-indigo-50/40'
                : 'border-slate-200 bg-slate-50/40';
            return (
              <div key={f.id} className={`rounded-xl border p-4 ${tone}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">{f.fact}</div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/70 border border-current/20 text-slate-700">
                    {f.status}
                  </span>
                </div>
                <div className="text-sm text-slate-800 font-semibold">
                  {f.isCorrected ? f.correctedValue || f.value : f.value}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  <span className="font-medium">{f.source}</span>
                  {f.sourceLocation && ` · ${f.sourceLocation}`}
                </div>
                {f.hasConflict && (
                  <div className="mt-2 text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                    Possible inconsistency: {f.conflictDetails}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GraphTab({ caseRec }: { caseRec: CaseRecord }) {
  const graph = caseRec.truthGraph;
  if (!graph) return <EmptyHint text="Truth graph unavailable for this case." />;
  return (
    <div>
      <h3 className="text-lg font-extrabold text-slate-900 mb-4">Transaction Truth Graph</h3>
      <div className="overflow-x-auto">
        <div className="relative" style={{ minWidth: 820, minHeight: 620 }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 820 620" preserveAspectRatio="xMidYMid meet">
            {graph.edges.map(e => {
              const from = graph.nodes.find(n => n.id === e.fromId);
              const to = graph.nodes.find(n => n.id === e.toId);
              if (!from || !to) return null;
              const x1 = (from.x || 0) + 70;
              const y1 = (from.y || 0) + 28;
              const x2 = (to.x || 0) + 70;
              const y2 = (to.y || 0) + 28;
              const stroke =
                e.status === 'Disputed' ? '#dc2626' : e.status === 'Inferred' ? '#d97706' : '#0f766e';
              return (
                <g key={e.id}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="2" strokeDasharray="4 3" />
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 6}
                    textAnchor="middle"
                    className="fill-slate-500"
                    style={{ fontSize: 10 }}
                  >
                    {e.label}
                  </text>
                </g>
              );
            })}
          </svg>
          {graph.nodes.map(n => (
            <div
              key={n.id}
              className={`absolute rounded-xl border-2 p-2 w-[140px] text-center bg-white shadow-md transition-transform hover:scale-105`}
              style={{ left: n.x, top: n.y }}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{n.type}</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 leading-tight">{n.label}</div>
              {n.subtitle && <div className="text-[10px] text-slate-500 mt-0.5">{n.subtitle}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-[11px] text-slate-500">
        Entity and relationship graph derived deterministically from verified facts and user-reported case data.
      </div>
    </div>
  );
}

function TimelineTab({ caseRec }: { caseRec: CaseRecord }) {
  const tl = caseRec.timelineEvents;
  if (!tl) return <EmptyHint text="Timeline unavailable for this case." />;
  return (
    <div>
      <h3 className="text-lg font-extrabold text-slate-900 mb-4">
        Reconstructed Timeline
        {tl.hasConflicts && (
          <span className="ml-2 text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
            Has conflicts
          </span>
        )}
      </h3>
      <ol className="relative border-l border-slate-200 ml-3 space-y-4">
        {tl.events.map(e => {
          const tone =
            e.status === 'Document supported' ? 'bg-emerald-600'
            : e.status === 'Disputed' ? 'bg-red-600'
            : e.status === 'Needs review' ? 'bg-amber-500'
            : e.status === 'Inferred' ? 'bg-orange-500' : 'bg-indigo-500';
          return (
            <li key={e.id} className="ml-5">
              <span className={`absolute -left-1.5 flex w-3 h-3 rounded-full ${tone} ring-4 ring-white`}></span>
              <div className="flex flex-wrap items-baseline gap-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{e.date}</div>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600`}>
                  {e.status}
                </span>
              </div>
              <div className="text-sm text-slate-800 font-semibold mt-0.5">{e.event}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{e.entity} · Source: {e.source}</div>
              {e.conflictNote && (
                <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                  <AlertTriangle className="w-3 h-3 inline mr-1" /> {e.conflictNote}
                  {e.alternateDate && <span> Alternate: {e.alternateDate} ({e.alternateSource})</span>}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function GapsTab({ caseRec }: { caseRec: CaseRecord }) {
  const gr = caseRec.evidenceGapReport;
  if (!gr || gr.gaps.length === 0) return <EmptyHint text="No unresolved evidence gaps detected." />;
  const toneByPriority: Record<string, string> = {
    Critical: 'bg-red-50 border-red-200 text-red-800',
    Important: 'bg-amber-50 border-amber-200 text-amber-800',
    Informational: 'bg-sky-50 border-sky-200 text-sky-800',
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-slate-900">Evidence Gaps ({gr.gaps.length})</h3>
        <div className="flex gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold">Critical {gr.criticalCount}</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold">Important {gr.importantCount}</span>
          <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-bold">Informational {gr.informationalCount}</span>
        </div>
      </div>
      <div className="space-y-3">
        {gr.gaps.map(g => (
          <div key={g.id} className={`rounded-xl border p-4 ${toneByPriority[g.priority]}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/60 border border-current/20">
                    {g.priority}
                  </span>
                  <div className="text-sm font-extrabold">{g.title}</div>
                </div>
                <p className="text-xs mt-1.5 leading-relaxed opacity-90">{g.description}</p>
              </div>
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-md bg-white/70 border border-white/50 p-2">
                <div className="font-bold mb-0.5">Missing evidence</div>
                {g.missingEvidence}
              </div>
              <div className="rounded-md bg-white/70 border border-white/50 p-2">
                <div className="font-bold mb-0.5">Recommendation</div>
                {g.recommendation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalTab({ caseRec }: { caseRec: CaseRecord }) {
  const mappings = caseRec.legalMappings || [];
  const assessment = caseRec.preliminaryAssessment;
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-extrabold text-slate-900">Legal Intelligence</h3>
      {assessment && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <div className="text-sm font-bold text-slate-800">Preliminary Assessment</div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{assessment.summary}</p>
          {assessment.limitations.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-slate-500">
              {assessment.limitations.map((l, i) => (
                <li key={i} className="flex items-start gap-1">
                  <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div>
        <div className="text-sm font-bold text-slate-800 mb-2">Fact-to-Law Mappings ({mappings.length})</div>
        {mappings.length === 0 ? (
          <EmptyHint text="No legal mappings recorded." />
        ) : (
          <div className="space-y-2">
            {mappings.map(m => (
              <div key={m.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                    {m.provisionId}
                  </span>
                  <div className="text-xs font-bold text-slate-700">{m.factorLabel}</div>
                </div>
                <p className="text-xs text-slate-700 mt-1"><strong>Case fact:</strong> {m.caseFact}</p>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{m.relevanceReason}</p>
                {m.missingInformation.length > 0 && (
                  <div className="mt-2 text-[11px] text-amber-700">
                    Missing information: {m.missingInformation.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BriefTab({ caseRec }: { caseRec: CaseRecord }) {
  const brief = caseRec.caseBrief;
  if (!brief) return <EmptyHint text="Case brief has not yet been generated for this case." />;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-slate-900">Case Brief</h3>
        <span className="font-mono text-xs font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          {brief.reference.id}
        </span>
      </div>
      <div className="space-y-3 text-sm">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Complainant</div>
            <div className="text-slate-800 font-semibold">{brief.consumer.name}</div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Transaction</div>
            <div className="text-slate-800 font-semibold">{brief.transaction.productService}</div>
            <div className="text-xs text-slate-500">{brief.transaction.amount}</div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Opposite parties</div>
          <ul className="text-xs space-y-0.5">
            {brief.oppositeParties.map((p, i) => (
              <li key={i} className="text-slate-700"><strong>{p.name}</strong> · {p.role} · {p.relationship}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 bg-indigo-50/40">
          <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 mb-1">Preliminary Assessment</div>
          <p className="text-sm text-slate-700 leading-relaxed">{brief.preliminaryAssessment}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Evidence Index</div>
          <ul className="text-xs space-y-0.5">
            {brief.evidenceIndex.map(e => (
              <li key={e.refId}>
                <span className="font-mono font-bold text-slate-700 mr-1">{e.refId}</span>
                {e.filename} · {e.type}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ComplaintTab({ caseRec }: { caseRec: CaseRecord }) {
  const c = caseRec.complaint;
  if (!c) return <EmptyHint text="Complaint draft has not yet been generated for this case." />;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-extrabold text-slate-900">Complaint Draft</h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {c.id}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            c.isEdited
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {c.isEdited ? 'Edited' : 'Draft'}
          </span>
        </div>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 mb-4 text-xs text-amber-800 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
        {c.disclaimer}
      </div>
      <div className="space-y-3">
        {c.sections.map(s => (
          <details key={s.id} className="rounded-xl border border-slate-200 bg-white group">
            <summary className="px-4 py-3 text-sm font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
              <span>{s.title}</span>
              <ChevronIcon />
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border-t border-slate-100 pt-3">
              {s.content}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function ReviewTab({
  caseRec,
  newNote,
  setNewNote,
  noteRelated,
  setNoteRelated,
  addNote,
  clarSubject,
  setClarSubject,
  clarDesc,
  setClarDesc,
  clarRelated,
  setClarRelated,
  requestClar,
}: {
  caseRec: CaseRecord;
  newNote: string;
  setNewNote: (v: string) => void;
  noteRelated: string;
  setNoteRelated: (v: string) => void;
  addNote: () => void;
  clarSubject: string;
  setClarSubject: (v: string) => void;
  clarDesc: string;
  setClarDesc: (v: string) => void;
  clarRelated: string;
  setClarRelated: (v: string) => void;
  requestClar: () => void;
}) {
  const notes = caseRec.review?.reviewerNotes || [];
  const activity = caseRec.review?.activityLog || [];
  const clars = caseRec.review?.clarificationRequests || [];
  const flagged = caseRec.review?.flaggedEvidence || [];
  const relatedOptions = [
    'Overview', 'Transaction', 'Evidence', 'Verified Facts', 'Truth Graph',
    'Timeline', 'Evidence Gaps', 'Legal Analysis', 'Case Brief', 'Complaint',
  ];
  return (
    <div className="space-y-6">
      {/* Add note */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Add Reviewer Note
        </h3>
        <div className="grid md:grid-cols-4 gap-2">
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">
              Related to
            </label>
            <select
              value={noteRelated}
              onChange={e => setNoteRelated(e.target.value)}
              className="w-full text-xs px-2 py-2 rounded-md border border-slate-200 outline-none"
            >
              {relatedOptions.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="md:col-span-3 flex flex-col gap-2">
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              rows={3}
              placeholder="Type your reviewer note…"
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  newNote.trim()
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3 h-3" /> <Save className="w-3 h-3" /> Add note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes list */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 mb-2">
          Reviewer Notes ({notes.length})
        </h3>
        {notes.length === 0 ? (
          <EmptyHint text="No reviewer notes yet — add one above." />
        ) : (
          <ul className="space-y-2">
            {[...notes].reverse().map(n => (
              <li key={n.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="font-bold text-slate-800">{n.author}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500 font-semibold">
                    {n.relatedCaseElement}
                  </span>
                  <span className="text-slate-400">{new Date(n.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{n.note}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Request clarification */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <Send className="w-4 h-4" /> Request Clarification
        </h3>
        <div className="grid md:grid-cols-4 gap-2">
          <div className="md:col-span-1 space-y-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">Related to</label>
              <select
                value={clarRelated}
                onChange={e => setClarRelated(e.target.value)}
                className="w-full text-xs px-2 py-2 rounded-md border border-slate-200 outline-none"
              >
                {relatedOptions.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="md:col-span-3 space-y-2">
            <input
              value={clarSubject}
              onChange={e => setClarSubject(e.target.value)}
              placeholder="Short subject (e.g. Proof of delivery)"
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            <textarea
              value={clarDesc}
              onChange={e => setClarDesc(e.target.value)}
              rows={2}
              placeholder="Describe what clarification is required from the complainant…"
              className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={requestClar}
                disabled={!clarSubject.trim() || !clarDesc.trim()}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  clarSubject.trim() && clarDesc.trim()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3 h-3" /> Send request
              </button>
            </div>
          </div>
        </div>
        {clars.length > 0 && (
          <ul className="mt-3 space-y-2">
            {[...clars].reverse().map(c => (
              <li key={c.id} className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="font-bold text-amber-800">{c.requestedBy}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-amber-200 text-amber-700 font-semibold">
                    {c.relatedTo}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    c.status === 'Pending' ? 'bg-amber-200 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-amber-600">{new Date(c.requestedAt).toLocaleString()}</span>
                </div>
                <div className="text-sm font-semibold text-amber-900 mt-1">{c.subject}</div>
                <p className="text-xs text-amber-800 mt-0.5">{c.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Flagged summary */}
      {flagged.filter(f => f.flagged).length > 0 && (
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-2">Flagged Evidence</h3>
          <ul className="space-y-2">
            {flagged.filter(f => f.flagged).map(f => {
              const doc = (caseRec.evidenceDocuments || []).find(d => d.id === f.evidenceId);
              return (
                <li key={f.evidenceId} className="rounded-xl border border-red-200 bg-red-50/60 p-3 text-xs text-red-800">
                  <strong>{doc?.filename || f.evidenceId}</strong> · {f.flagReason}
                  {f.flaggedBy && <span className="opacity-75"> · by {f.flaggedBy}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Activity */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Activity Timeline ({activity.length})
        </h3>
        {activity.length === 0 ? (
          <EmptyHint text="No activity yet." />
        ) : (
          <ol className="relative border-l border-slate-200 ml-3 space-y-3">
            {[...activity].reverse().map(a => (
              <li key={a.id} className="ml-5">
                <span className={`absolute -left-1.5 flex w-3 h-3 rounded-full ring-4 ring-white ${
                  a.category === 'Status changed' ? 'bg-indigo-600'
                  : a.category === 'Evidence flagged' ? 'bg-red-500'
                  : a.category === 'Clarification requested' ? 'bg-amber-500'
                  : a.category === 'Note added' ? 'bg-sky-500'
                  : 'bg-slate-400'
                }`}></span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <div className="text-xs font-bold text-slate-700">{a.event}</div>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500">
                    {a.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {a.actor} · {new Date(a.timestamp).toLocaleString()}
                </div>
                {a.details && <div className="text-[11px] text-slate-600 mt-0.5">{a.details}</div>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

// ============ Helpers ============
function InfoCard({
  title, icon, children,
}: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="text-sm text-slate-400 italic text-center py-10 border border-dashed border-slate-200 rounded-xl">
      {text}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function issueLabel(cat: string | null): string {
  if (cat === 'defective_not_as_described') return 'Defective / not as described';
  if (cat === 'payment_refund_unresolved') return 'Refund unresolved';
  if (cat === 'product_not_delivered') return 'Product not delivered';
  return cat ? String(cat) : 'Consumer dispute';
}
