import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';

interface ProgressStepperProps {
  currentStep?: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep = 1 }) => {
  const steps = [
    { number: '01', title: 'Your Story + Evidence', desc: 'Narrative & documents' },
    { number: '02', title: 'Reconstruct + Analyze', desc: 'Truth graph & legal context' },
    { number: '03', title: 'Build Your Case', desc: 'Dossier & complaint' },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-subtle mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {steps.map((step, idx) => {
          const isActive = idx + 1 === currentStep;
          const isCompleted = idx + 1 < currentStep;
          const isLocked = idx + 1 > currentStep;

          return (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-indigo-500/30'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200/80'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isLocked ? (
                    <div className="flex items-center gap-0.5">
                      <span>{step.number}</span>
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                    </div>
                  ) : (
                    step.number
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold tracking-tight ${
                        isActive
                          ? 'text-slate-900'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    {isActive && (
                      <span className="text-[9px] uppercase font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-100">
                        Current
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-[9px] uppercase font-medium text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {step.desc}
                  </span>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden sm:block flex-1 h-[1px] bg-slate-200 mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
