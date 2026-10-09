import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Inbox,
  Eye,
  Clock,
  AlertCircle,
  FileCheck2,
  ClipboardList,
  FileSignature,
  Archive,
  RefreshCw,
  ChevronDown,
  Lock,
  KeyRound,
  Building2,
  Calendar,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { ReviewerCaseRecord, ReviewStatus } from '../types/reviewer';
import { SecondaryButton } from '../components/SecondaryButton';

interface ReviewerDashboardProps {
  queue: ReviewerCaseRecord[];
  onBack: () => void;
  onOpenCase: (caseId: string) => void;
}

const statusOrder: ReviewStatus[] = [
  'New',
  'Under Review',
  'Needs Clarification',
  'Evidence Review',
  'Ready for Assessment',
  'Complaint Drafted',
  'Closed',
];

const statusMeta: Record<
  ReviewStatus,
  { tone: string; dot: string; icon: React.ReactNode }
> = {
  New: {
    tone: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
    icon: <Inbox className="w-3 h-3" />,
  },
  'Under Review': {
    tone: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    icon: <Eye className="w-3 h-3" />,
  },
  'Needs Clarification': {
    tone: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  'Evidence Review': {
    tone: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
    icon: <Layers className="w-3 h-3" />,
  },
  'Ready for Assessment': {
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: <FileCheck2 className="w-3 h-3" />,
  },
  'Complaint Drafted': {
    tone: 'bg-teal-50 text-teal-700 border-teal-200',
    dot: 'bg-teal-500',
    icon: <FileSignature className="w-3 h-3" />,
  },
  Closed: {
    tone: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    icon: <Archive className="w-3 h-3" />,
  },
};

const issueColors: Record<string, string> = {
  defective_not_as_described: 'bg-rose-50 text-rose-700 border-rose-200',
  payment_refund_unresolved: 'bg-orange-50 text-orange-700 border-orange-200',
  product_not_delivered: 'bg-purple-50 text-purple-700 border-purple-200',
};

export const ReviewerDashboard: React.FC<ReviewerDashboardProps> = ({
  queue,
  onBack,
  onOpenCase,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'All'>('All');
  const [issueFilter, setIssueFilter] = useState<string>('All');
  const [sellerFilter, setSellerFilter] = useState<string>('All');
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>('All');

  const counts = useMemo(() => {
    const base: Record<string, number> = { All: queue.length };
    statusOrder.forEach(s => (base[s] = 0));
    queue.forEach(q => (base[q.reviewStatus] = (base[q.reviewStatus] || 0) + 1));
    return base;
  }, [queue]);

  const sellers = useMemo(
    () => ['All', ...Array.from(new Set(queue.map(q => q.seller)).values())],
    [queue]
  );
  const marketplaces = useMemo(
    () => ['All', ...Array.from(new Set(queue.map(q => q.marketplace).filter(Boolean) as string[]))],
    [queue]
  );
  const issues = useMemo(
    () => ['All', ...Array.from(new Set(queue.map(q => q.issueCategory)))],
    [queue]
  );

  const filtered = useMemo(() => {
    return queue.filter(q => {
      if (statusFilter !== 'All' && q.reviewStatus !== statusFilter) return false;
      if (issueFilter !== 'All' && q.issueCategory !== issueFilter) return false;
      if (sellerFilter !== 'All' && q.seller !== sellerFilter) return false;
      if (marketplaceFilter !== 'All' && q.marketplace !== marketplaceFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !q.caseId.toLowerCase().includes(s) &&
          !q.consumer.toLowerCase().includes(s) &&
          !q.seller.toLowerCase().includes(s) &&
          !q.issue.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [queue, statusFilter, issueFilter, sellerFilter, marketplaceFilter, search]);

  return (
    <div className="py-8 md:py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Access banner */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 mb-6 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-white/60 border border-amber-200 px-2 py-0.5 rounded-full">
              <KeyRound className="w-3 h-3 inline mr-1" /> Restricted Demo Workspace
            </span>
          </div>
          <p className="mt-1.5 text-sm text-amber-800 leading-relaxed">
            Reviewer authentication and RBAC are demoed here with a <strong>Demo Reviewer</strong> account.
            All cases shown are synthetic. This environment does not connect to any real case-management system.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-slate-700" />
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Reviewer Dashboard
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Review consumer complaint dossiers, inspect evidence, add reviewer notes, and update case status.
            </p>
          </div>
          <SecondaryButton onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Role Selection
          </SecondaryButton>
        </div>

        {/* KPI tiles */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <KpiTile
            label="All"
            count={counts.All}
            tone={statusFilter === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800 border-slate-200'}
            onClick={() => setStatusFilter('All')}
            active={statusFilter === 'All'}
          />
          {statusOrder.map(s => (
            <KpiTile
              key={s}
              label={s}
              count={counts[s] || 0}
              tone={
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : statusMeta[s].tone
              }
              icon={statusMeta[s].icon}
              onClick={() => setStatusFilter(s)}
              active={statusFilter === s}
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search case, consumer, seller…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <FilterSelect
            label="Issue"
            icon={<ClipboardList className="w-3.5 h-3.5" />}
            value={issueFilter}
            onChange={setIssueFilter}
            options={issues.map(i => ({ value: i, label: i === 'All' ? 'All issues' : issueLabel(i) }))}
          />
          <FilterSelect
            label="Status"
            icon={<Filter className="w-3.5 h-3.5" />}
            value={statusFilter}
            onChange={v => setStatusFilter(v as any)}
            options={['All', ...statusOrder].map(s => ({ value: s, label: s }))}
          />
          <FilterSelect
            label="Seller"
            icon={<Building2 className="w-3.5 h-3.5" />}
            value={sellerFilter}
            onChange={setSellerFilter}
            options={sellers.map(s => ({ value: s, label: s === 'All' ? 'All sellers' : s }))}
          />
          <FilterSelect
            label="Marketplace"
            icon={<Building2 className="w-3.5 h-3.5" />}
            value={marketplaceFilter}
            onChange={setMarketplaceFilter}
            options={marketplaces.map(m => ({ value: m, label: m === 'All' ? 'All platforms' : m }))}
          />
        </div>
      </div>

      {/* Case queue table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">
            Case Queue{' '}
            <span className="text-slate-400 font-normal">
              · {filtered.length} of {queue.length}
            </span>
          </div>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setIssueFilter('All');
              setSellerFilter('All');
              setMarketplaceFilter('All');
            }}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-50"
          >
            <RefreshCw className="w-3 h-3" />
            Clear filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/60 border-b border-slate-200">
                <th className="px-5 py-3 font-semibold">Case ID</th>
                <th className="px-3 py-3 font-semibold">Issue</th>
                <th className="px-3 py-3 font-semibold">Consumer</th>
                <th className="px-3 py-3 font-semibold">Seller / Platform</th>
                <th className="px-3 py-3 font-semibold">Created</th>
                <th className="px-3 py-3 font-semibold">Completeness</th>
                <th className="px-3 py-3 font-semibold">Evidence</th>
                <th className="px-3 py-3 font-semibold">Review Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const sMeta = statusMeta[c.reviewStatus];
                return (
                  <tr
                    key={c.caseId}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-bold text-slate-800">{c.caseId}</div>
                      {c.amount && (
                        <div className="text-[11px] text-slate-500 mt-0.5">Amount: {c.amount}</div>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center text-[11px] font-semibold px-2 py-1 rounded-md border ${
                          issueColors[c.issueCategory] || 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {c.issue}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-slate-800 text-sm">{c.consumer}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-slate-800 text-sm">{c.seller}</div>
                      {c.marketplace && (
                        <div className="text-[11px] text-slate-500 mt-0.5">via {c.marketplace}</div>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(c.dateCreated)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated {formatAgo(c.lastUpdated)}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <CompletenessMini value={c.recordCompleteness} />
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          c.evidenceStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : c.evidenceStatus === 'Submitted'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {c.evidenceStatus}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${sMeta.tone}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${sMeta.dot}`} />
                        {c.reviewStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onOpenCase(c.caseId)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                      <Inbox className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="text-sm font-semibold text-slate-700">No cases match the current filters.</div>
                    <div className="text-xs text-slate-500 mt-1">Try adjusting the search or filters above.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-5 text-center text-[11px] text-slate-400">
        Cases shown are synthetic demo data generated for hackathon demonstration purposes.
      </div>
    </div>
  );
};

function KpiTile({
  label,
  count,
  tone,
  onClick,
  active,
  icon,
}: {
  label: string;
  count: number;
  tone: string;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border px-3 py-3 transition-all ${tone} ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-[0.98]' : 'cursor-default'
      } ${active ? 'ring-2 ring-indigo-400/60' : ''}`}
    >
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-bold opacity-90 truncate">{label}</span>
      </div>
      <div className="text-2xl font-extrabold mt-1">{count}</div>
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">
        {icon ? <span className="inline-flex items-center gap-1">{icon}{label}</span> : label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none text-sm px-3 py-2 pr-8 rounded-lg border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function CompletenessMini({ value }: { value: number }) {
  const tone = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div className={`h-full ${tone}`} style={{ width: `${value}%` }} />
        </div>
        <span className="text-xs font-bold text-slate-600 w-9 text-right">{value}%</span>
      </div>
    </div>
  );
}

function issueLabel(cat: string): string {
  if (cat === 'defective_not_as_described') return 'Defective / not as described';
  if (cat === 'payment_refund_unresolved') return 'Refund unresolved';
  if (cat === 'product_not_delivered') return 'Product not delivered';
  return cat;
}

function formatDate(s: string): string {
  try {
    return new Date(s).toLocaleDateString();
  } catch {
    return s;
  }
}

function formatAgo(s: string): string {
  const ms = Date.now() - new Date(s).getTime();
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
