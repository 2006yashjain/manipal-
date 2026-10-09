import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { ConsumerCaseInput } from '../types';

interface CaseCompletenessProps {
  caseData: ConsumerCaseInput;
}

export const CaseCompleteness: React.FC<CaseCompletenessProps> = ({ caseData }) => {
  const isStoryComplete = caseData.story.trim().length > 10;
  const isTransactionComplete = !!caseData.platform && !!caseData.amount;
  const isIssueComplete = !!caseData.issueCategory;
  const isRemedyComplete = caseData.remedies.length > 0;

  const items = [
    { label: 'Story & Narrative', complete: isStoryComplete },
    { label: 'Transaction details', complete: isTransactionComplete },
    { label: 'Issue category', complete: isIssueComplete },
    { label: 'Requested remedy', complete: isRemedyComplete },
    { label: 'Evidence documents', complete: false, upcoming: true },
  ];

  const completedCount = [isStoryComplete, isTransactionComplete, isIssueComplete, isRemedyComplete].filter(Boolean).length;
  const percentage = Math.round((completedCount / 5) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Record Completeness</h4>
          <p className="text-[11px] text-slate-500">Checklist of required case sections</p>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {percentage}% intake
        </span>
      </div>

      <div className="space-y-2 mt-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
            <span className={item.complete ? 'text-slate-800 font-medium' : 'text-slate-500'}>
              {item.label}
            </span>
            {item.complete ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Complete
              </span>
            ) : item.upcoming ? (
              <span className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                <Clock className="w-3 h-3" /> Upcoming (Stage 2)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 font-medium text-[11px]">
                <AlertCircle className="w-3 h-3" /> Pending
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 leading-tight">
          * Record completeness measures document readiness, not legal probability or outcome certainty.
        </p>
      </div>
    </div>
  );
};
