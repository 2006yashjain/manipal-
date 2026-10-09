import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, FileText, UploadCloud, File, Loader2 } from 'lucide-react';
import { ConsumerCaseInput } from '../../types';
import { EvidenceDocument, EvidenceFact, EvidenceConflict } from '../../types/evidence';
import { ProgressStepper } from '../../components/ProgressStepper';
import { PrimaryButton } from '../../components/PrimaryButton';

interface Step1StoryEvidenceProps {
  caseData: ConsumerCaseInput;
  onChangeCaseData: (data: ConsumerCaseInput) => void;
  documents: EvidenceDocument[];
  onUpdateDocuments: (docs: EvidenceDocument[]) => void;
  facts: EvidenceFact[];
  onUpdateFacts: (facts: EvidenceFact[]) => void;
  conflicts: EvidenceConflict[];
  onContinue: () => void;
}

export const Step1StoryEvidence: React.FC<Step1StoryEvidenceProps> = ({
  caseData,
  onChangeCaseData: _onChangeCaseData,
  documents,
  onUpdateDocuments: _onUpdateDocuments,
  facts,
  onUpdateFacts,
  conflicts,
  onContinue
}) => {
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'done'>(
    documents.length > 0 && facts.length > 0 ? 'done' : 'idle'
  );
  
  const [editingFactId, setEditingFactId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSimulateUpload = () => {
    setProcessingState('processing');
    setTimeout(() => {
      setProcessingState('done');
    }, 2500);
  };

  const handleSaveFact = (factId: string) => {
    onUpdateFacts(
      facts.map(f =>
        f.id === factId
          ? { ...f, isCorrected: true, correctedValue: editValue, status: 'User corrected' }
          : f
      )
    );
    setEditingFactId(null);
  };

  const completenessScore = 82; // Mock score for demo purposes

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      <ProgressStepper currentStep={1} />

      <div className="mt-8 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">01 Your Story + Evidence</h1>
        <p className="mt-2 text-sm text-slate-500">Tell us what happened and provide the records that support your story.</p>
      </div>

      <div className="space-y-8">
        {/* 1A: TRANSACTION DETAILS */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Transaction Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Product / Service</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                value={caseData.platform || 'Dell Inspiron 15'} // Demo fallback
                readOnly
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                value={`₹${caseData.amount || '54,999'}`}
                readOnly
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Marketplace</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                value={caseData.parties.marketplace || 'ExampleMart'}
                readOnly
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Seller</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                value={caseData.parties.seller || 'TechWorld Store'}
                readOnly
              />
            </div>
          </div>
        </section>

        {/* 1B: YOUR STORY */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Your Story</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">What happened?</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[100px] resize-none"
                placeholder="Describe the issue in your own words..."
                defaultValue={caseData.story || "The product arrived with a cracked screen casing. I contacted the seller who promised a refund, but they stopped responding."}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Issue Category</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" defaultValue="defective_not_as_described">
                  <option value="defective_not_as_described">Defective / Not as described</option>
                  <option value="payment_refund_unresolved">Payment / Refund unresolved</option>
                  <option value="product_not_delivered">Product not delivered</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Desired Remedy</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" defaultValue="refund">
                  <option value="refund">Refund</option>
                  <option value="replacement">Replacement</option>
                  <option value="repair">Repair</option>
                  <option value="compensation">Compensation</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* 1C: INVOLVED PARTIES (Inline) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Involved Parties</h2>
          <div className="flex flex-wrap gap-2">
            {['Marketplace', 'Seller', 'Payment Provider', 'Logistics Provider'].map(party => (
              <span key={party} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                {party}
              </span>
            ))}
          </div>
        </section>

        {/* 1D: EVIDENCE UPLOAD */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Evidence Upload</h2>
          
          <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-8 text-center hover:bg-slate-100 transition-colors cursor-pointer mb-6" onClick={processingState === 'idle' ? handleSimulateUpload : undefined}>
            <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Click to add relevant documents</p>
            <p className="text-xs text-slate-500 mt-1">Support for Invoice, Receipt, Chat, Photos (PDF, PNG, JPG)</p>
          </div>

          {documents.length > 0 && (
            <div className="space-y-2 mb-6">
              {documents.map((doc, idx) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{doc.filename}</p>
                    <p className="text-xs text-slate-500">{doc.category} • Added</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">E-0{idx + 1}</span>
                </div>
              ))}
            </div>
          )}

          {/* 1E: EVIDENCE PROCESSING (Inline) */}
          {processingState === 'processing' && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                <h3 className="text-sm font-bold text-indigo-900">Processing evidence...</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-indigo-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Reading invoice</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Identifying transaction amount</li>
                <li className="flex items-center gap-2 text-indigo-400 animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Checking dates and conflicts</li>
              </ul>
              <p className="text-[10px] text-indigo-400 mt-3 italic">*Prototype simulated processing</p>
            </div>
          )}

          {/* 1F & 1G: FACT REVIEW & CONFLICTS */}
          {processingState === 'done' && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <File className="w-4 h-4 text-indigo-600" /> Evidence Intelligence
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Transaction identified</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Payment identified</span>
                <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-md flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Refund status needs review</span>
              </div>

              <div className="space-y-3">
                {facts.slice(0, 5).map(fact => (
                  <div key={fact.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{fact.fact}</p>
                      
                      {editingFactId === fact.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="text" 
                            className="bg-white border border-slate-300 rounded px-2 py-1 text-sm font-semibold text-slate-900"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                          <button onClick={() => handleSaveFact(fact.id)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Save</button>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-slate-900">
                          {fact.isCorrected ? fact.correctedValue : fact.value}
                        </p>
                      )}
                      
                      <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                        Source: <span className="font-mono text-slate-700 bg-slate-200 px-1 rounded">{fact.source}</span>
                      </p>
                      {fact.isCorrected && (
                        <p className="text-[10px] text-purple-600 mt-1 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Original: {fact.value}
                        </p>
                      )}
                    </div>
                    {editingFactId !== fact.id && (
                      <button onClick={() => { setEditingFactId(fact.id); setEditValue(fact.correctedValue || fact.value); }} className="text-xs text-indigo-600 font-semibold hover:underline">
                        [Edit]
                      </button>
                    )}
                  </div>
                ))}

                {conflicts.map((conflict, i) => (
                   <div key={i} className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                     <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                       <AlertTriangle className="w-4 h-4" /> Possible inconsistency
                     </p>
                     <p className="text-sm text-amber-900 font-medium mb-3">{conflict.neutralObservation}</p>
                     <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                           <span className="text-amber-700">{conflict.sourceA}:</span>
                           <span className="font-semibold text-amber-900">{conflict.valueA}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-amber-700">{conflict.sourceB}:</span>
                           <span className="font-semibold text-amber-900">{conflict.valueB}</span>
                        </div>
                     </div>
                     <p className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-3">Needs review</p>
                   </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 1H: RECORD COMPLETENESS */}
        {processingState === 'done' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Record Completeness</h2>
               <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{completenessScore}%</span>
             </div>
             <div className="space-y-2 text-sm text-slate-700">
               <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transaction identified</div>
               <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Payment evidence</div>
               <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Seller identified</div>
               <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Refund confirmation missing</div>
             </div>
             
             <div className="mt-8 pt-6 border-t border-slate-100">
               <PrimaryButton size="lg" fullWidth onClick={onContinue} icon={<ArrowRight className="w-4 h-4" />}>
                 Continue to Case Reconstruction
               </PrimaryButton>
             </div>
          </section>
        )}
      </div>
    </div>
  );
};
