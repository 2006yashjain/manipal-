import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, HelpCircle, Info, Clock } from 'lucide-react';
import { ReconstructedTimeline, TimelineEvent } from '../types/timeline';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressStepper } from '../components/ProgressStepper';

interface TimelinePageProps {
  timeline: ReconstructedTimeline;
  onContinueToGaps: () => void;
  onBackToGraph: () => void;
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'Document supported':
      return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
    case 'Needs review':
      return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
    case 'Disputed':
      return <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />;
    case 'Inferred':
      return <HelpCircle className="w-4 h-4 text-violet-400 shrink-0" />;
    default:
      return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
  }
};

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'Document supported': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'Needs review': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'Disputed': return 'text-red-700 bg-red-50 border-red-200';
    case 'Inferred': return 'text-violet-700 bg-violet-50 border-violet-200';
    default: return 'text-indigo-700 bg-indigo-50 border-indigo-200';
  }
};

export const TimelinePage: React.FC<TimelinePageProps> = ({
  timeline,
  onContinueToGaps,
  onBackToGraph,
}) => {
  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Progress */}
      <ProgressStepper currentStep={3} />

      {/* Header */}
      <div className="mt-8 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
          Stage 3 — Case Reconstruction
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Timeline Reconstruction
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
          Events are ordered chronologically based on verified facts and evidence.
          Date conflicts are shown explicitly — no date is silently chosen over another.
        </p>
      </div>

      {/* Conflict banner */}
      {timeline.hasConflicts && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <span className="font-bold">Possible date inconsistency detected.</span>{' '}
            One or more events have conflicting dates across evidence sources. These are marked below and require review.
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'Document supported', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Consumer reported', cls: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
          { label: 'Needs review', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Inferred', cls: 'text-violet-700 bg-violet-50 border-violet-200' },
          { label: 'Disputed', cls: 'text-red-700 bg-red-50 border-red-200' },
        ].map(l => (
          <span key={l.label} className={`text-[10px] font-semibold border rounded-full px-2.5 py-1 ${l.cls}`}>
            {l.label}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[76px] top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />

        <div className="space-y-0">
          {timeline.events.map((event: TimelineEvent) => (
            <div key={event.id} className="relative flex gap-0 sm:gap-6 items-stretch">
              {/* Date column */}
              <div className="hidden sm:flex flex-col items-end justify-start pt-4 w-[76px] shrink-0">
                <span className={`text-xs font-bold text-slate-700 text-right leading-tight ${event.status === 'Needs review' ? 'text-amber-700' : ''}`}>
                  {event.date}
                </span>
              </div>

              {/* Dot */}
              <div className="hidden sm:flex flex-col items-center relative">
                <div className={`w-3 h-3 rounded-full border-2 mt-[18px] z-10 shrink-0 ${
                  event.status === 'Document supported'
                    ? 'bg-emerald-400 border-emerald-500'
                    : event.status === 'Needs review'
                    ? 'bg-amber-400 border-amber-500'
                    : event.status === 'Disputed'
                    ? 'bg-red-400 border-red-500'
                    : event.status === 'Inferred'
                    ? 'bg-violet-400 border-violet-500'
                    : 'bg-indigo-400 border-indigo-500'
                }`} />
              </div>

              {/* Event card */}
              <div className={`flex-1 mb-3 rounded-xl border p-4 transition-all ${
                event.status === 'Needs review' || event.status === 'Disputed'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}>
                {/* Mobile date */}
                <div className="sm:hidden flex items-center gap-2 mb-2">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{event.date}</span>
                </div>

                <div className="flex items-start gap-2">
                  {statusIcon(event.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{event.event}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] text-slate-500">{event.entity}</span>
                      <span className="text-slate-200">·</span>
                      <span className="text-[10px] text-slate-400 italic">{event.source}</span>
                      <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${statusBadgeClass(event.status)}`}>
                        {event.status}
                      </span>
                    </div>

                    {/* Conflict annotation */}
                    {event.conflictNote && (
                      <div className="mt-2 flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-lg p-2">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-amber-800 mb-0.5">Possible inconsistency</p>
                          <p className="text-[11px] text-amber-700 leading-relaxed">{event.conflictNote}</p>
                          {event.alternateDate && (
                            <p className="text-[10px] text-amber-600 mt-1">
                              Alternate date: <strong>{event.alternateDate}</strong> per <em>{event.alternateSource}</em>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SecondaryButton
          onClick={onBackToGraph}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Truth Graph
        </SecondaryButton>
        <button
          onClick={onContinueToGaps}
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
        >
          Continue: Evidence Gaps
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
