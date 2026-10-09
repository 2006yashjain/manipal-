import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ConsentBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ConsentBox: React.FC<ConsentBoxProps> = ({ checked, onChange }) => {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      checked ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <input
            id="legal-consent"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
          />
        </div>
        <label htmlFor="legal-consent" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
          <span className="font-bold text-slate-900 block mb-0.5">Before continuing</span>
          I understand that the information I provide will be used to organise my case and generate preliminary AI-assisted information. I understand that this prototype does not determine legal liability or provide a binding legal decision.
        </label>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
        <span>Your information is processed locally for prototype structuring. No data is sent to external legal bodies.</span>
      </div>
    </div>
  );
};
