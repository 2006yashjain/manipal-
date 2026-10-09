import React from 'react';
import { Store, ShoppingBag, CreditCard, Truck, HelpCircle } from 'lucide-react';
import { InvolvedPartiesInput } from '../types';

interface PartySelectorProps {
  parties: InvolvedPartiesInput;
  onChange: (parties: InvolvedPartiesInput) => void;
}

export const PartySelector: React.FC<PartySelectorProps> = ({ parties, onChange }) => {
  const updateField = (key: keyof InvolvedPartiesInput, value: string) => {
    onChange({
      ...parties,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-500 leading-relaxed">
        Adding known party names helps NyayaSetu AI map responsibilities and build the future <span className="font-semibold text-slate-700">Transaction Truth Graph</span>.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Marketplace */}
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 mb-1.5 text-slate-800">
            <Store className="w-4 h-4 text-indigo-600" />
            <label className="text-xs font-bold uppercase tracking-wider">Marketplace / Platform</label>
          </div>
          <input
            type="text"
            value={parties.marketplace}
            onChange={(e) => updateField('marketplace', e.target.value)}
            placeholder="e.g. ExampleMart, Amazon, Flipkart"
            className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Seller */}
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 mb-1.5 text-slate-800">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <label className="text-xs font-bold uppercase tracking-wider">Seller / Merchant</label>
          </div>
          <input
            type="text"
            value={parties.seller}
            onChange={(e) => updateField('seller', e.target.value)}
            placeholder="e.g. TechWorld Store, RetailCorp"
            className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Payment Provider */}
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 mb-1.5 text-slate-800">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <label className="text-xs font-bold uppercase tracking-wider">Payment Provider / UPI</label>
          </div>
          <input
            type="text"
            value={parties.paymentProvider}
            onChange={(e) => updateField('paymentProvider', e.target.value)}
            placeholder="e.g. ExamplePay, Razorpay, PhonePe"
            className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Logistics */}
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 mb-1.5 text-slate-800">
            <Truck className="w-4 h-4 text-indigo-600" />
            <label className="text-xs font-bold uppercase tracking-wider">Logistics / Courier</label>
          </div>
          <input
            type="text"
            value={parties.logistics}
            onChange={(e) => updateField('logistics', e.target.value)}
            placeholder="e.g. FastShip, BlueDart, Delhivery"
            className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Other */}
      <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-2 mb-1.5 text-slate-800">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <label className="text-xs font-bold uppercase tracking-wider">Other Involved Entity</label>
        </div>
        <input
          type="text"
          value={parties.other || ''}
          onChange={(e) => updateField('other', e.target.value)}
          placeholder="e.g. Authorized Service Center, Brand Manufacturer"
          className="w-full text-xs sm:text-sm px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
        />
      </div>
    </div>
  );
};
