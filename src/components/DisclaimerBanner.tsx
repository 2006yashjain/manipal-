import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside aria-label="Legal and Prototype Disclaimer" className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="font-medium">
            <strong className="text-amber-300 font-semibold">Prototype only:</strong> AI-generated information is preliminary and does not determine legal liability.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-slate-400 text-[11px]">
            Not a court, lawyer, or automated adjudicator.
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 text-[10px] font-semibold tracking-wider uppercase">
            Hackathon Demo
          </span>
        </div>
      </div>
    </aside>
  );
};
