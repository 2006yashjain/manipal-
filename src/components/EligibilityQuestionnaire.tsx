import React, { useState } from 'react';
import { 
  ShoppingBag, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Globe, 
  Sparkles,
  Info,
  Layers,
  FileCheck
} from 'lucide-react';
import { 
  EligibilityInput, 
  PurchasedType, 
  ConsiderationType, 
  PurposeType, 
  SelfEmploymentFollowup, 
  PurchaserType, 
  ChannelType 
} from '../types/eligibility';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface EligibilityQuestionnaireProps {
  initialInput: EligibilityInput;
  onComplete: (input: EligibilityInput) => void;
  onBack: () => void;
}

export const EligibilityQuestionnaire: React.FC<EligibilityQuestionnaireProps> = ({
  initialInput,
  onComplete,
  onBack,
}) => {
  const [formData, setFormData] = useState<EligibilityInput>(initialInput);
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);

  // Scenario presets for quick evaluation testing
  const loadScenario = (scenarioKey: 'A' | 'B' | 'C' | 'D' | 'E' | 'F') => {
    switch (scenarioKey) {
      case 'A': // Laptop, Paid, Personal use, Self, Online -> Potentially within definition
        setFormData({
          purchasedType: 'goods',
          purchasedDescription: 'Dell Inspiron 15 Laptop',
          consideration: 'paid_in_full',
          purpose: 'personal_use',
          selfEmploymentFollowup: null,
          secondaryPurposeConflicting: null,
          purchaser: 'self',
          channel: 'online_electronic',
          platformName: 'ExampleMart',
          sellerName: 'TechWorld Store',
          approximateAmount: '54,999',
          supportingDocumentsAvailable: true,
        });
        break;
      case 'B': // 100 units for resale -> Potential statutory exclusion
        setFormData({
          purchasedType: 'goods',
          purchasedDescription: '100 units of smartphone accessories',
          consideration: 'paid_in_full',
          purpose: 'resale',
          selfEmploymentFollowup: null,
          secondaryPurposeConflicting: null,
          purchaser: 'self',
          channel: 'online_electronic',
          platformName: 'WholesaleMart',
          sellerName: 'BulkSuppliers Ltd',
          approximateAmount: '1,20,000',
          supportingDocumentsAvailable: true,
        });
        break;
      case 'C': // Commercial equipment used for self-employment livelihood -> Further review / exception
        setFormData({
          purchasedType: 'goods',
          purchasedDescription: 'Commercial single-needle sewing machine',
          consideration: 'paid_in_full',
          purpose: 'commercial_purpose',
          selfEmploymentFollowup: 'yes',
          secondaryPurposeConflicting: null,
          purchaser: 'self',
          channel: 'physical_offline',
          platformName: '',
          sellerName: 'Sewing Tech Emporium',
          approximateAmount: '32,000',
          supportingDocumentsAvailable: true,
        });
        break;
      case 'D': // Completely free service -> Further review required
        setFormData({
          purchasedType: 'service',
          purchasedDescription: 'Complimentary cloud trial storage',
          consideration: 'completely_free',
          purpose: 'personal_use',
          selfEmploymentFollowup: null,
          secondaryPurposeConflicting: null,
          purchaser: 'self',
          channel: 'online_electronic',
          platformName: 'FreeHost Inc',
          sellerName: 'FreeHost Inc',
          approximateAmount: '0',
          supportingDocumentsAvailable: false,
        });
        break;
      case 'E': // Sibling purchased, user is authorised beneficiary -> Further review (beneficiary)
        setFormData({
          purchasedType: 'goods',
          purchasedDescription: 'Air Conditioner for home',
          consideration: 'paid_in_full',
          purpose: 'household_use',
          selfEmploymentFollowup: null,
          secondaryPurposeConflicting: null,
          purchaser: 'beneficiary_user',
          channel: 'online_electronic',
          platformName: 'CoolApp',
          sellerName: 'HomeAppliances India',
          approximateAmount: '38,500',
          supportingDocumentsAvailable: true,
        });
        break;
      case 'F': // Conflicting purpose answers -> Further review + Conflict flag
        setFormData({
          purchasedType: 'goods',
          purchasedDescription: '15 Tablet PCs',
          consideration: 'paid_in_full',
          purpose: 'personal_use',
          selfEmploymentFollowup: null,
          secondaryPurposeConflicting: 'resale',
          purchaser: 'self',
          channel: 'online_electronic',
          platformName: 'GadgetStore',
          sellerName: 'ElectroImports',
          approximateAmount: '2,50,000',
          supportingDocumentsAvailable: true,
        });
        break;
    }
  };

  const isFormValid = !!formData.purchasedType && !!formData.consideration && !!formData.purpose && !!formData.purchaser;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onComplete(formData);
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3 inline-flex items-center gap-1 transition-colors"
        >
          ← Back to Role Selection
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-2">
              <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Statutory Screening • Section 2(7) CPA 2019</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Consumer Eligibility & Transaction Checker
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Answer 5 quick questions to screen whether your transaction falls within the statutory concept of a consumer.
            </p>
          </div>

          {/* Test Scenarios Quick Selector */}
          <div className="bg-slate-100/90 p-2.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" /> Quick Test Scenarios
            </span>
            <div className="flex flex-wrap gap-1">
              {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => loadScenario(s)}
                  className="px-2 py-1 rounded bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-[11px] border border-slate-200 transition-colors shadow-2xs"
                  title={`Load Scenario ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Questionnaire Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Q1: What was purchased or hired? */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Question 1 of 5
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
              What did you purchase or hire? <span className="text-rose-500">*</span>
            </h2>
            <p className="text-xs text-slate-500">
              Section 2(7) applies to buyers of goods or hirers/availers of services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'goods' as PurchasedType,
                title: 'Goods / Physical Products',
                examples: 'Laptop, Mobile phone, Furniture, Clothing, Appliance',
                icon: <ShoppingBag className="w-4 h-4 text-indigo-600" />,
              },
              {
                id: 'service' as PurchasedType,
                title: 'Service / Digital Subscription',
                examples: 'Internet connection, Hotel booking, Repair, Education, Travel',
                icon: <Globe className="w-4 h-4 text-indigo-600" />,
              },
              {
                id: 'something_else' as PurchasedType,
                title: 'Something else',
                examples: 'Real estate plot, Investment, Shares, Cryptocurrency',
                icon: <Layers className="w-4 h-4 text-slate-500" />,
              },
              {
                id: 'not_sure' as PurchasedType,
                title: "I'm not sure",
                examples: 'Complex transaction or bundled agreement',
                icon: <HelpCircle className="w-4 h-4 text-slate-500" />,
              },
            ].map((opt) => {
              const isSelected = formData.purchasedType === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, purchasedType: opt.id })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-1">{opt.examples}</p>
                </div>
              );
            })}
          </div>

          {/* Short description input */}
          <FormField label="Product / Service Name" optional hint="e.g. Dell Inspiron 15 Laptop or Airline Ticket">
            <input
              type="text"
              value={formData.purchasedDescription || ''}
              onChange={(e) => setFormData({ ...formData, purchasedDescription: e.target.value })}
              placeholder="e.g. Dell Inspiron 15 Laptop"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/50 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </FormField>
        </section>

        {/* Q2: Consideration */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Question 2 of 5
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
              Was anything paid, promised, or agreed as consideration? <span className="text-rose-500">*</span>
            </h2>
            <p className="text-xs text-slate-500">
              Statutory protection requires consideration (paid, partly paid, promised, or deferred).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'paid_in_full' as ConsiderationType, label: 'Paid in full', desc: 'Complete amount transacted' },
              { id: 'partially_paid' as ConsiderationType, label: 'Partially paid', desc: 'Advance or installment paid' },
              { id: 'promised' as ConsiderationType, label: 'Payment promised', desc: 'Cash on delivery / invoice due' },
              { id: 'deferred' as ConsiderationType, label: 'Deferred / EMI', desc: 'Payable under deferred system' },
              { id: 'completely_free' as ConsiderationType, label: 'Completely free', desc: 'No money or valuable consideration' },
              { id: 'not_sure' as ConsiderationType, label: "I'm not sure", desc: 'Complex barter or sponsored gift' },
            ].map((opt) => {
              const isSelected = formData.consideration === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, consideration: opt.id })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50/40 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight block">{opt.desc}</span>
                </div>
              );
            })}
          </div>

          {formData.consideration === 'completely_free' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Statutory Note:</strong> Purely gratuitous services/goods typically fall outside Consumer Protection Act jurisdiction unless tied to consideration or commercial service terms. Further review will be performed.
              </span>
            </div>
          )}
        </section>

        {/* Q3: Purpose & Commercial Follow-up */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Question 3 of 5
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
              What was the main purpose of purchasing or hiring it? <span className="text-rose-500">*</span>
            </h2>
            <p className="text-xs text-slate-500">
              The statutory definition specifically excludes commercial resale and non-exempt business transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'personal_use' as PurposeType, label: 'Personal use', desc: 'Direct personal consumption' },
              { id: 'household_use' as PurposeType, label: 'Household use', desc: 'Family or domestic residence usage' },
              { id: 'self_employment_livelihood' as PurposeType, label: 'Livelihood via self-employment', desc: 'Exclusively to earn livelihood independently' },
              { id: 'commercial_purpose' as PurposeType, label: 'Business / Commercial purpose', desc: 'Used in company or business operations' },
              { id: 'resale' as PurposeType, label: 'Resale', desc: 'Bought with intention to resell for profit' },
              { id: 'mixed_purpose' as PurposeType, label: 'Mixed purpose', desc: 'Both personal and professional use' },
            ].map((opt) => {
              const isSelected = formData.purpose === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setFormData({ 
                      ...formData, 
                      purpose: opt.id,
                      selfEmploymentFollowup: opt.id === 'commercial_purpose' ? formData.selfEmploymentFollowup : null
                    });
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50/40 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight block">{opt.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Adaptive follow-up for Commercial Purpose */}
          {formData.purpose === 'commercial_purpose' && (
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-indigo-700 flex-shrink-0" />
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                  Adaptive Follow-up: Statutory Self-Employment Exception
                </h4>
              </div>
              <p className="text-xs text-indigo-900">
                Under the Explanation to Section 2(7), "commercial purpose" does not include use by a person of goods bought and used by him exclusively for the purpose of earning his livelihood by means of self-employment.
              </p>
              <div className="text-xs font-bold text-slate-800">
                Was the goods/service used exclusively by you to earn your livelihood through self-employment?
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'yes' as SelfEmploymentFollowup, label: 'Yes (Exclusive)' },
                  { id: 'no' as SelfEmploymentFollowup, label: 'No (Commercial entity)' },
                  { id: 'partly' as SelfEmploymentFollowup, label: 'Partly' },
                  { id: 'not_sure' as SelfEmploymentFollowup, label: "I'm not sure" },
                ].map((fOpt) => {
                  const isFollowupSelected = formData.selfEmploymentFollowup === fOpt.id;
                  return (
                    <button
                      key={fOpt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, selfEmploymentFollowup: fOpt.id })}
                      className={`p-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        isFollowupSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {fOpt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {formData.purpose === 'resale' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Potential Statutory Exclusion:</strong> Goods obtained for resale may fall outside the definition of consumer under Section 2(7). You can still proceed into the case flow, but this will be noted as a review flag.
              </span>
            </div>
          )}
        </section>

        {/* Q4: Who purchased or hired it? */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Question 4 of 5
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
              Who purchased or hired the goods/service? <span className="text-rose-500">*</span>
            </h2>
            <p className="text-xs text-slate-500">
              Section 2(7) covers purchasers as well as authorised users and beneficiaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'self' as PurchaserType, label: 'I purchased/hired it myself', desc: 'Direct buyer on the invoice' },
              { id: 'authorised_user' as PurchaserType, label: 'I am the authorised user', desc: 'Used with approval of buyer' },
              { id: 'beneficiary_user' as PurchaserType, label: 'I am a beneficiary / end-user', desc: 'Beneficiary of service/goods' },
              { id: 'someone_else' as PurchaserType, label: 'Someone else purchased it for me', desc: 'Family member, gift, or employer' },
            ].map((opt) => {
              const isSelected = formData.purchaser === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setFormData({ ...formData, purchaser: opt.id })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50/40 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 leading-tight block">{opt.desc}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Q5: Transaction Channel */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Question 5 of 5
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-2">
              How did the transaction take place?
            </h2>
            <p className="text-xs text-slate-500">
              Section 2(7) explicitly recognizes offline and online/electronic transactions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'online_electronic' as ChannelType, label: 'Online / App / UPI' },
              { id: 'physical_offline' as ChannelType, label: 'Physical store' },
              { id: 'both' as ChannelType, label: 'Both / Omnichannel' },
              { id: 'other' as ChannelType, label: 'Other' },
            ].map((opt) => {
              const isSelected = formData.channel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, channel: opt.id })}
                  className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-1 ring-indigo-500/30'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Optional Context Accordion */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
          <div 
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Additional Transaction Metadata (Optional)
              </h3>
              <p className="text-[11px] text-slate-500">Add platform, merchant name, or order details if known.</p>
            </div>
            <button
              type="button"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              {showOptionalFields ? 'Hide' : 'Add Details'}
            </button>
          </div>

          {showOptionalFields && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-slate-200">
              <FormField label="Platform / Marketplace" optional>
                <input
                  type="text"
                  value={formData.platformName || ''}
                  onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                  placeholder="e.g. ExampleMart"
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-300"
                />
              </FormField>
              <FormField label="Seller / Business" optional>
                <input
                  type="text"
                  value={formData.sellerName || ''}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  placeholder="e.g. TechWorld Store"
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-300"
                />
              </FormField>
              <FormField label="Approximate Amount (₹)" optional>
                <input
                  type="text"
                  value={formData.approximateAmount || ''}
                  onChange={(e) => setFormData({ ...formData, approximateAmount: e.target.value })}
                  placeholder="54,999"
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-300"
                />
              </FormField>
              <FormField label="Supporting Documents Available?" optional>
                <select
                  value={formData.supportingDocumentsAvailable ? 'yes' : 'no'}
                  onChange={(e) => setFormData({ ...formData, supportingDocumentsAvailable: e.target.value === 'yes' })}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-300"
                >
                  <option value="yes">Yes, I have receipts/invoices</option>
                  <option value="no">No documents yet</option>
                </select>
              </FormField>
            </div>
          )}
        </div>

        {/* Submit & Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <SecondaryButton size="md" onClick={onBack} type="button">
            Cancel
          </SecondaryButton>

          <PrimaryButton
            size="lg"
            type="submit"
            disabled={!isFormValid}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Evaluate Consumer Status
          </PrimaryButton>
        </div>

      </form>
    </div>
  );
};
