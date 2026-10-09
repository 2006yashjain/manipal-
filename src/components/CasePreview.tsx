import React from 'react';
import { ArrowRight, FileCheck, Layers, ShoppingBag, ShieldCheck } from 'lucide-react';
import { ConsumerCaseInput } from '../types';
import { PrimaryButton } from './PrimaryButton';

interface CasePreviewProps {
  caseData: ConsumerCaseInput;
  onContinueToEvidence: () => void;
  canContinue: boolean;
}

export const CasePreview: React.FC<CasePreviewProps> = ({
  caseData,
  onContinueToEvidence,
  canContinue,
}) => {
  const getCategoryLabel = () => {
    switch (caseData.issueCategory) {
      case 'payment_refund_unresolved':
        return 'Payment successful / refund unresolved';
      case 'product_not_delivered':
        return 'Product not delivered';
      case 'defective_not_as_described':
        return 'Defective / not-as-described product';
      default:
        return 'Not selected';
    }
  };

  const partyList = [
    caseData.parties.marketplace || caseData.platform,
    caseData.parties.seller || caseData.seller,
    caseData.parties.paymentProvider,
    caseData.parties.logistics,
  ].filter(Boolean);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-elevated border border-slate-800">
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white uppercase tracking-wider">Case Preview</h3>
            <p className="text-[11px] text-slate-400">Structured intake dossier</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-indigo-400 block">{caseData.id}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
            Ready for evidence
          </span>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Transaction */}
        <div className="flex items-start justify-between py-2 border-b border-slate-800">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" /> Transaction
          </span>
          <span className="font-semibold text-right text-slate-200">
            {caseData.platform || 'Platform not specified'} {caseData.orderId ? `(#${caseData.orderId})` : ''}
          </span>
        </div>

        {/* Amount */}
        <div className="flex items-start justify-between py-2 border-b border-slate-800">
          <span className="text-slate-400">Amount</span>
          <span className="font-bold text-slate-100 text-sm">
            {caseData.amount ? `₹${caseData.amount}` : 'Not specified'}
          </span>
        </div>

        {/* Issue */}
        <div className="flex items-start justify-between py-2 border-b border-slate-800">
          <span className="text-slate-400">Primary Issue</span>
          <span className="font-medium text-right text-indigo-300 max-w-[65%]">
            {getCategoryLabel()}
          </span>
        </div>

        {/* Requested Remedy */}
        <div className="flex items-start justify-between py-2 border-b border-slate-800">
          <span className="text-slate-400">Requested Remedy</span>
          <span className="font-medium text-right text-slate-200">
            {caseData.remedies.length > 0 ? caseData.remedies.join(', ') : 'Not selected'}
          </span>
        </div>

        {/* Parties */}
        <div className="flex items-start justify-between py-2 border-b border-slate-800">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" /> Identified Parties
          </span>
          <span className="font-medium text-right text-slate-200 max-w-[65%]">
            {partyList.length > 0 ? partyList.join(', ') : 'None listed'}
          </span>
        </div>

        {/* Statutory Screening Status */}
        {caseData.consumerEligibility && (
          <div className="flex items-start justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Statutory Screening</span>
            <span className={`font-semibold text-right ${
              caseData.consumerEligibility.status === 'potentially_within_definition'
                ? 'text-emerald-400'
                : caseData.consumerEligibility.status === 'potential_statutory_exclusion'
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}>
              {caseData.consumerEligibility.statusLabel}
            </span>
          </div>
        )}

        {/* Provenance Foundation Note */}
        <div className="bg-slate-850 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <span>
            Provenance Tag: <strong className="text-slate-200">Consumer reported</strong>. All statements will be corroborated against evidence in Stage 2.
          </span>
        </div>
      </div>

      <div className="mt-6">
        <PrimaryButton
          size="lg"
          fullWidth
          disabled={!canContinue}
          onClick={onContinueToEvidence}
          icon={<ArrowRight className="w-4 h-4" />}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
        >
          Continue to Evidence
        </PrimaryButton>

        {!canContinue && (
          <p className="text-[11px] text-amber-400 text-center mt-2.5">
            * Please describe what happened, select an issue category, and accept the consent notice to proceed.
          </p>
        )}
      </div>
    </div>
  );
};
