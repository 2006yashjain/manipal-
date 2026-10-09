import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, FileText, Copy, Printer, Download, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { ConsumerCaseInput } from '../../types';
import { EvidenceDocument, EvidenceFact } from '../../types/evidence';
import { LegalMapping, PreliminaryAssessment } from '../../types/legal';
import { EvidenceGapReport } from '../../types/gaps';
import { ProgressStepper } from '../../components/ProgressStepper';
import { SecondaryButton } from '../../components/SecondaryButton';

interface Step3BuildCaseProps {
  caseData: ConsumerCaseInput;
  documents: EvidenceDocument[];
  facts: EvidenceFact[];
  legalMappings: LegalMapping[];
  assessment: PreliminaryAssessment;
  gapReport: EvidenceGapReport;
  onFinalize: () => void;
  onBack: () => void;
}

export const Step3BuildCase: React.FC<Step3BuildCaseProps> = ({
  caseData,
  documents,
  facts,
  legalMappings: _legalMappings,
  assessment: _assessment,
  gapReport,
  onFinalize,
  onBack
}) => {
  const [complaintDraft, setComplaintDraft] = useState(`BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION

COMPLAINT NO. _______ OF 20__

IN THE MATTER OF:
[Consumer Name]
...Complainant

VERSUS

1. ${caseData.parties.seller || 'TechWorld Store'}
2. ${caseData.parties.marketplace || 'ExampleMart'}
...Opposite Parties

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

RESPECTFULLY SHOWETH:
1. That the Complainant is a consumer as defined under Section 2(7) of the Consumer Protection Act, 2019. The Complainant purchased a ${caseData.platform || 'Dell Inspiron 15'} on [Date] for a total consideration of ₹${caseData.amount || '54,999'}, which was paid in full.

2. That the product was delivered with the following issue: ${caseData.story || 'Defective / Not as described'}.

3. That the Complainant requested a remedy of: Refund.

4. That the Opposite Parties have failed to resolve the issue, constituting a deficiency in service and potentially an unfair trade practice.

PRAYER
It is therefore respectfully prayed that this Hon'ble Commission may be pleased to:
a) Direct the Opposite Parties to provide a full refund of ₹${caseData.amount || '54,999'}.
b) Pass any other order as deemed fit.

Date: ___________
Signature: ___________`);

  const [confirmed1, setConfirmed1] = useState(false);
  const [confirmed2, setConfirmed2] = useState(false);
  const [confirmed3, setConfirmed3] = useState(false);

  const canFinalize = confirmed1 && confirmed2 && confirmed3;

  return (
    <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      <ProgressStepper currentStep={3} />

      <div className="mt-8 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">03 Build Your Case</h1>
        <p className="mt-2 text-sm text-slate-500">Review the structured case and prepare a complaint draft.</p>
      </div>

      <div className="space-y-8">
        {/* 3A: CASE BRIEF */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Case Dossier
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">{caseData.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* GROUP 1: Overview & Story */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Case Overview</h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-500">Consumer:</span> <span className="font-semibold">Demo User</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Opposite Parties:</span> <span className="font-semibold">{caseData.parties.seller}, {caseData.parties.marketplace}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Product:</span> <span className="font-semibold">{caseData.platform || 'Dell Inspiron 15'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Amount:</span> <span className="font-semibold">₹{caseData.amount}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Issue:</span> <span className="font-semibold text-indigo-700">Defective / Not as described</span></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Verified Facts</h3>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 rounded-xl p-4">
                  {facts.filter(f => f.status.includes('supported') || f.isCorrected).slice(0, 5).map(f => (
                    <li key={f.id} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>{f.fact}:</strong> {f.isCorrected ? f.correctedValue : f.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* GROUP 3: Evidence & Legal */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Evidence Index</h3>
                <ul className="space-y-2">
                  {documents.map((doc, idx) => (
                    <li key={doc.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-mono text-slate-500">[E-0{idx+1}]</span>
                      <span className="font-semibold text-slate-700 flex-1 ml-2">{doc.filename}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Verified</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Legal Context & Limitations</h3>
                <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-700 space-y-3">
                  <div>
                    <span className="font-bold text-slate-800">Relevant Provisions:</span>
                    <ul className="list-disc pl-4 mt-1 text-slate-600">
                      <li>Section 2(7) - Consumer definition</li>
                      <li>Section 2(11) - Deficiency in service</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-2"><AlertTriangle className="w-3 h-3 text-amber-500"/> Limitations / Gaps:</span>
                    <ul className="list-disc pl-4 mt-1 text-amber-700">
                      {gapReport.gaps.filter(g => g.priority === 'Critical' || g.priority === 'Important').map(g => (
                        <li key={g.id}>{g.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3C: COMPLAINT GENERATOR */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Complaint Draft</h2>
             <div className="flex gap-2 mt-2 sm:mt-0">
               <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Copy"><Copy className="w-4 h-4" /></button>
               <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Print"><Printer className="w-4 h-4" /></button>
               <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Download"><Download className="w-4 h-4" /></button>
             </div>
          </div>
          
          <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-200 flex items-start gap-2 mb-4">
             <Info className="w-4 h-4 shrink-0 mt-0.5" />
             <p>Draft generated for review. This is not an automatically filed complaint. Placeholders like [Name] and [Date] need manual completion.</p>
          </div>

          <textarea 
            className="w-full h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            value={complaintDraft}
            onChange={(e) => setComplaintDraft(e.target.value)}
          />
        </section>

        {/* 3D: FINAL REVIEW */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Ready to finalize?</h2>
           
           <div className="space-y-4 mb-8">
             <label className="flex items-start gap-3 cursor-pointer">
               <input type="checkbox" className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" checked={confirmed1} onChange={(e) => setConfirmed1(e.target.checked)} />
               <span className="text-sm text-slate-700">I confirm the information is accurate to the best of my knowledge.</span>
             </label>
             <label className="flex items-start gap-3 cursor-pointer">
               <input type="checkbox" className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" checked={confirmed2} onChange={(e) => setConfirmed2(e.target.checked)} />
               <span className="text-sm text-slate-700">I have reviewed the evidence and case brief.</span>
             </label>
             <label className="flex items-start gap-3 cursor-pointer">
               <input type="checkbox" className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" checked={confirmed3} onChange={(e) => setConfirmed3(e.target.checked)} />
               <span className="text-sm text-slate-700 font-semibold">I understand this is a draft and not an automatically filed complaint.</span>
             </label>
           </div>

           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
             <SecondaryButton onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>Back to Analysis</SecondaryButton>
             <button
               disabled={!canFinalize}
               onClick={onFinalize}
               className={`inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all ${
                 canFinalize 
                   ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-md' 
                   : 'bg-slate-100 text-slate-400 cursor-not-allowed'
               }`}
             >
               Finalize Case Dossier <ArrowRight className="w-4 h-4" />
             </button>
           </div>
        </section>
      </div>
    </div>
  );
};
