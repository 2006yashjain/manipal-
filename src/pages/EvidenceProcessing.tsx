import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';

interface EvidenceProcessingProps {
  documentCount: number;
  onComplete: () => void;
}

export const EvidenceProcessing: React.FC<EvidenceProcessingProps> = ({
  documentCount,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    { title: 'Uploading & validating documents...', desc: `Verified ${documentCount} multi-party evidence attachments` },
    { title: 'Reading document text & metadata...', desc: 'Parsing invoices, timestamps, order IDs, and payment references' },
    { title: 'Extracting multi-party transaction facts...', desc: 'Correlating Marketplace, Seller, Payment Gateway & Courier entities' },
    { title: 'Cross-referencing evidence sources...', desc: 'Checking consistency between narrative, invoice, and chat logs' },
    { title: 'Preparing provenance & fact verification...', desc: 'Building traceable document-supported dossier' },
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const autoProceedTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(autoProceedTimer);
    }
  }, [currentStep, steps.length, onComplete]);

  const isFinished = currentStep >= steps.length;
  const progressPercent = Math.min(100, Math.round((currentStep / steps.length) * 100));

  return (
    <div className="py-16 md:py-24 max-w-2xl mx-auto px-4 sm:px-6 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-card">
        
        {/* Prototype Processing Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Prototype Processing Simulation</span>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-6 shadow-subtle">
          {isFinished ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          ) : (
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isFinished ? 'Facts Extracted & Linked' : 'Extracting Evidence & Facts...'}
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
          NyayaSetu AI is structuring facts from {documentCount} uploaded documents with complete provenance tracking.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 my-8 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Checklist */}
        <div className="space-y-3.5 text-left max-w-md mx-auto mb-8">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5 flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 bg-slate-50" />
                  )}
                </div>
                <div>
                  <span className={`font-bold block ${
                    isDone ? 'text-slate-900' : isCurrent ? 'text-indigo-600' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                  <span className="text-[11px] text-slate-500">{step.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice & Manual Bypass */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 text-[11px]">
            Simulating local OCR and deterministic evidence matching.
          </span>
          <PrimaryButton
            size="md"
            onClick={onComplete}
            icon={<ArrowRight className="w-4 h-4" />}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            View Extracted Facts
          </PrimaryButton>
        </div>

      </div>
    </div>
  );
};
