import React from 'react';
import { Check } from 'lucide-react';
import { RemedyType } from '../types';

interface RemedySelectorProps {
  selectedRemedies: RemedyType[];
  onChange: (remedies: RemedyType[]) => void;
}

export const RemedySelector: React.FC<RemedySelectorProps> = ({
  selectedRemedies,
  onChange,
}) => {
  const remedyOptions: { id: RemedyType; label: string; desc: string }[] = [
    { id: 'Refund', label: 'Refund', desc: 'Full or partial money back to source payment method' },
    { id: 'Replacement', label: 'Replacement', desc: 'Fresh undamaged unit sent without extra charge' },
    { id: 'Delivery', label: 'Delivery Fulfillment', desc: 'Expedited dispatch of undelivered consignment' },
    { id: 'Repair', label: 'Authorized Repair', desc: 'Authorized service centre repair under warranty' },
    { id: 'Compensation', label: 'Compensation', desc: 'Damages for delay, deficiency of service, or harassment' },
    { id: 'Other', label: 'Other Remedy', desc: 'Custom clarification or account-level correction' },
  ];

  const toggleRemedy = (remedy: RemedyType) => {
    if (selectedRemedies.includes(remedy)) {
      onChange(selectedRemedies.filter((r) => r !== remedy));
    } else {
      onChange([...selectedRemedies, remedy]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {remedyOptions.map((item) => {
          const isSelected = selectedRemedies.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleRemedy(item.id)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 select-none flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-500/30 text-indigo-950'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold">{item.label}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <span className="text-[11px] text-slate-500 leading-snug">{item.desc}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400 mt-1 italic">
        * Note: Selecting desired remedies clarifies your goals. It does not constitute a guaranteed legal entitlement.
      </p>
    </div>
  );
};
