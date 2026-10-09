import React from 'react';
import { Scale, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

interface NavbarProps {
  onStartCase: () => void;
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
  onNavigateRoleSelect: () => void;
  onNavigateReviewerDemo: () => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartCase,
  onNavigateHome,
  onNavigateHowItWorks,
  onNavigateRoleSelect,
  onNavigateReviewerDemo,
  currentView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Descriptor */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-subtle group-hover:bg-indigo-600 transition-colors">
            <Scale className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">NyayaSetu AI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Evidence Intelligence for Multi-Party Consumer Disputes
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-4 md:gap-6">
          <button
            onClick={onNavigateHowItWorks}
            className={`text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
              currentView === 'landing' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            How it works
          </button>

          <button
            onClick={onNavigateRoleSelect}
            className={`text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              currentView === 'consumer-intake' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="hidden xs:inline">For Consumers</span>
          </button>

          <button
            onClick={onNavigateReviewerDemo}
            className={`text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              currentView === 'reviewer-gate' ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span className="hidden xs:inline">For Reviewers</span>
          </button>

          <div className="pl-1 sm:pl-2 border-l border-slate-200">
            <PrimaryButton
              size="sm"
              onClick={onStartCase}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Start a Case
            </PrimaryButton>
          </div>
        </nav>

      </div>
    </header>
  );
};
