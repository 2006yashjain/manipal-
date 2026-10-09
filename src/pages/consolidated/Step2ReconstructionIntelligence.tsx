import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Scale, CheckCircle2, AlertTriangle, BookOpen, Clock, Layers } from 'lucide-react';
import { ConsumerCaseInput } from '../../types';
import { EvidenceFact, EvidenceConflict } from '../../types/evidence';
import { TruthGraph } from '../../types/graph';
import { ReconstructedTimeline } from '../../types/timeline';
import { EvidenceGapReport } from '../../types/gaps';
import { LegalMapping, PreliminaryAssessment, LegalProvision } from '../../types/legal';
import { ProgressStepper } from '../../components/ProgressStepper';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';

interface Step2ReconstructionProps {
  caseData: ConsumerCaseInput;
  facts: EvidenceFact[];
  conflicts: EvidenceConflict[];
  truthGraph: TruthGraph;
  timeline: ReconstructedTimeline;
  gapReport: EvidenceGapReport;
  legalMappings: LegalMapping[];
  assessment: PreliminaryAssessment;
  provisions: LegalProvision[];
  onContinue: () => void;
  onBack: () => void;
}

export const Step2ReconstructionIntelligence: React.FC<Step2ReconstructionProps> = ({
  caseData,
  facts: _facts,
  conflicts: _conflicts,
  truthGraph,
  timeline,
  gapReport,
  legalMappings,
  assessment,
  provisions,
  onContinue,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'timeline' | 'legal'>('graph');

  // Simple renderers for node/edge (omitted complex interactive sidebar to keep it consolidated and clean)
  const nodeColors: Record<string, string> = {
    Consumer: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    Seller: 'bg-amber-50 border-amber-300 text-amber-800',
    Marketplace: 'bg-sky-50 border-sky-300 text-sky-800',
    PaymentProvider: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    Product: 'bg-rose-50 border-rose-300 text-rose-800',
    Order: 'bg-slate-100 border-slate-300 text-slate-700',
  };
  
  const completenessScore = 82;

  return (
    <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      <ProgressStepper currentStep={2} />

      <div className="mt-8 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">02 Case Reconstruction + Legal Intelligence</h1>
        <p className="mt-2 text-sm text-slate-500">See what the evidence tells us, what remains uncertain, and why the facts may matter.</p>
      </div>

      <div className="space-y-6">
        {/* 2A: CASE SNAPSHOT */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-wrap gap-6 shadow-sm items-center justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Case ID</p>
              <p className="text-sm font-semibold text-slate-800 font-mono">{caseData.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Product</p>
              <p className="text-sm font-semibold text-slate-800">{caseData.platform || 'Dell Inspiron 15'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
              <p className="text-sm font-semibold text-slate-800">₹{caseData.amount || '54,999'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seller</p>
              <p className="text-sm font-semibold text-slate-800">{caseData.parties.seller || 'TechWorld Store'}</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Status</p>
                <p className="text-xs font-bold text-amber-600 bg-amber-50 px-2 rounded-md">Needs Review</p>
             </div>
             <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Completeness</p>
                <p className="text-sm font-bold text-slate-800">{completenessScore}%</p>
             </div>
          </div>
        </section>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl w-fit">
          <button onClick={() => setActiveTab('graph')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'graph' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Layers className="w-4 h-4" /> Truth Graph</button>
          <button onClick={() => setActiveTab('timeline')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Clock className="w-4 h-4" /> Timeline & Gaps</button>
          <button onClick={() => setActiveTab('legal')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'legal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Scale className="w-4 h-4" /> Legal Intelligence</button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          {/* 2B: TRUTH GRAPH */}
          {activeTab === 'graph' && (
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Transaction Truth Graph</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {truthGraph.nodes.map(node => (
                  <div key={node.id} className={`p-3 rounded-xl border-2 ${nodeColors[node.type] || 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <p className="text-xs font-bold leading-tight">{node.label}</p>
                    <p className="text-[10px] opacity-80 mt-1 truncate">{node.subtitle}</p>
                  </div>
                ))}
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Reconstructed Relationships</h3>
              <div className="space-y-2">
                {truthGraph.edges.map(edge => {
                   const from = truthGraph.nodes.find(n => n.id === edge.fromId)?.label;
                   const to = truthGraph.nodes.find(n => n.id === edge.toId)?.label;
                   return (
                     <div key={edge.id} className="flex items-center gap-3 text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                       <span className="font-semibold text-slate-700 w-1/4 text-right">{from}</span>
                       <span className="text-indigo-500 font-medium italic flex-1 text-center">→ {edge.label} →</span>
                       <span className="font-semibold text-slate-700 w-1/4">{to}</span>
                     </div>
                   )
                })}
              </div>
            </div>
          )}

          {/* 2C & 2D: TIMELINE & GAPS */}
          {activeTab === 'timeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Event Timeline</h2>
                <div className="space-y-4">
                  {timeline.events.map((ev) => (
                    <div key={ev.id} className="flex gap-4">
                      <div className="w-12 pt-1 text-right shrink-0 text-xs font-bold text-slate-500">{ev.date}</div>
                      <div className="relative pb-4 border-l-2 border-slate-200 pl-4">
                         <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${ev.status === 'Disputed' || ev.status === 'Needs review' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                         <p className="text-sm font-semibold text-slate-900">{ev.event}</p>
                         <p className="text-[10px] text-slate-500 mt-1">{ev.entity} • {ev.source}</p>
                         {ev.conflictNote && (
                           <div className="mt-2 bg-amber-50 border border-amber-200 rounded p-2 text-[10px] text-amber-800">
                             <span className="font-bold">⚠ Possible inconsistency:</span> {ev.conflictNote}
                           </div>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Evidence Gaps</h2>
                <div className="space-y-3">
                  {gapReport.gaps.map(gap => (
                    <div key={gap.id} className={`p-4 rounded-xl border ${gap.priority === 'Critical' ? 'bg-red-50/50 border-red-200' : gap.priority === 'Important' ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${gap.priority === 'Critical' ? 'bg-red-100 text-red-800' : gap.priority === 'Important' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                          {gap.priority}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mt-2">{gap.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{gap.description}</p>
                      
                      <div className="mt-3 text-[10px]">
                        <p className="font-bold text-slate-500 uppercase">Missing</p>
                        <p className="text-red-700">{gap.missingEvidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2E, 2F, 2G: LEGAL INTELLIGENCE */}
          {activeTab === 'legal' && (
            <div>
               <div className="mb-6 flex items-start gap-3 bg-slate-900 text-white rounded-xl px-5 py-4 shadow-md">
                 <Scale className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Legal Disclaimer</p>
                   <p className="text-xs text-slate-300 leading-relaxed">
                     Preliminary screening only. This result is based on the information provided and does not determine legal status or liability. Consult a qualified advocate before taking legal action.
                   </p>
                 </div>
               </div>

               <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Preliminary Case Assessment</h2>
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
                 <p className="text-sm text-slate-700 leading-relaxed">{assessment.summary}</p>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-200">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Evidence Supported</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                         <li>• Transaction & Payment</li>
                         <li>• Delivery Event</li>
                         <li>• Product Issue</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">Needs Review</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                         <li>• Refund status</li>
                         <li>• Seller final response</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-red-600 uppercase mb-2">Evidence Gaps</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                         <li>• Refund confirmation</li>
                      </ul>
                    </div>
                 </div>
               </div>

               <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Fact to Law Mapping</h2>
               <div className="space-y-4">
                 {legalMappings.map(mapping => {
                   const prov = provisions.find(p => p.id === mapping.provisionId);
                   return (
                     <div key={mapping.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
                       <div className="p-4 bg-indigo-50/50 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-center">
                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5">Fact</p>
                          <p className="text-xs font-semibold text-slate-800">{mapping.caseFact}</p>
                          <p className="text-[10px] text-slate-500 mt-2">Sources: {mapping.evidenceIds.join(', ')}</p>
                       </div>
                       <div className="p-4 md:w-2/3">
                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Potential Relevance</p>
                          <p className="text-sm font-bold text-slate-900 mb-1">{prov?.provision} — {prov?.title}</p>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">{mapping.relevanceReason}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          )}
        </div>

        {/* 2H: CASE READINESS */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
           <div>
             <h3 className="text-sm font-bold text-slate-900 mb-2">Case Preparation Status</h3>
             <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
               <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Story complete</span>
               <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Evidence reviewed</span>
               <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transaction reconstructed</span>
               <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Legal context identified</span>
               <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" /> 2 evidence gaps remain</span>
             </div>
           </div>
           
           <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
             <SecondaryButton onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>Back</SecondaryButton>
             <PrimaryButton onClick={onContinue} icon={<ArrowRight className="w-4 h-4" />}>Build Your Case</PrimaryButton>
           </div>
        </section>

      </div>
    </div>
  );
};
