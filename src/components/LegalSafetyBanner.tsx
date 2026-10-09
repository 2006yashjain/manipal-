import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface LegalSafetyBannerProps {
  compact?: boolean;
}

export const LegalSafetyBanner: React.FC<LegalSafetyBannerProps> = ({ compact = false }) => {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="font-medium tracking-wide">
            Prototype guidance. Based on information provided. Not legal advice.
          </span>
        </div>
        {!compact && (
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            ONE RESOLVE does not determine legal liability or guarantee outcomes.
          </span>
        )}
      </div>
    </div>
  );
};
