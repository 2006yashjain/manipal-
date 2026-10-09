import React from 'react';
import { 
  ArrowRight, 
  User, 
  Store, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  FileText, 
  Layers, 
  Search, 
  ShieldCheck, 
  FileCheck2, 
  Compass,
  ArrowDown
} from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

interface LandingProps {
  onStartCase: () => void;
  onHowItWorksClick: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartCase, onHowItWorksClick }) => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200/90 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>24-Hour Legal Hackathon • Prototype</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Turn a confusing consumer dispute into a clear, evidence-backed case.
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            <strong className="text-slate-900 font-semibold">NyayaSetu AI</strong> helps organise your story, transaction records, and evidence so you can understand what is known, what is missing, and what may need review.
          </p>

          {/* CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <PrimaryButton
              size="lg"
              onClick={onStartCase}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-md"
            >
              Start a Case
            </PrimaryButton>
            <SecondaryButton
              size="lg"
              onClick={onHowItWorksClick}
              className="w-full sm:w-auto"
            >
              See How It Works
            </SecondaryButton>
          </div>

          {/* Disclaimer text */}
          <p className="mt-5 text-xs text-slate-400 max-w-lg mx-auto">
            Prototype only. AI-generated information is preliminary and does not determine legal liability.
          </p>

        </div>
      </section>

      {/* 2. CORE PROBLEM SECTION */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              The Product Problem
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-3 tracking-tight">
              One transaction. Multiple parties. One confusing dispute.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Consumers often have to repeat the same story, search through scattered documents, and figure out which party or channel is relevant.
            </p>
          </div>

          {/* Visual Transaction Chain */}
          <div className="bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 items-center">
              
              {/* Node 1 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Consumer</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Purchaser & Complainant</span>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="md:hidden flex justify-center text-slate-400 py-1">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* Node 2 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Marketplace</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Platform & Host</span>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="md:hidden flex justify-center text-slate-400 py-1">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* Node 3 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Seller</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Merchant of Record</span>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="md:hidden flex justify-center text-slate-400 py-1">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* Node 4 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Payment Provider</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Bank / Gateway</span>
              </div>

              <div className="hidden md:flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="md:hidden flex justify-center text-slate-400 py-1">
                <ArrowDown className="w-4 h-4" />
              </div>

              {/* Node 5 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">Logistics Provider</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Courier & Delivery</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW NYAYASETU WORKS */}
      <section id="how-it-works" className="py-16 md:py-20 bg-slate-50/70 border-b border-slate-200/90 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Case Preparation Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-2 tracking-tight">
              How NyayaSetu Works
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A structured 4-step framework to organise your dispute into a verified case file.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Tell us what happened</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Provide transaction facts and describe the incident in simple, everyday language without legal jargon.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> Story Intake
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Add your evidence</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload invoices, screenshots, payment receipts, and chat logs to corroborate your claim.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-500" /> Evidence Vault
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Review the reconstructed case</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Inspect extracted entities, timeline of events, and correlation between parties and issues.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Case Synthesis
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                  04
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Understand what needs attention</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  See missing documents, unverified claims, and prepare a structured complaint dossier.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Compass className="w-3.5 h-3.5 text-indigo-500" /> Actionable Next Steps
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DIFFERENTIATOR SECTION */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-2 tracking-tight">
              Evidence Intelligence, Not Generic Chatbots
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Built specifically for the complexity of multi-party Indian consumer commerce disputes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: Transaction Truth */}
            <div className="bg-slate-50/60 rounded-2xl p-7 border border-slate-200 hover:border-indigo-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Transaction Truth</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect parties, events, documents and statements into one traceable case file with strict provenance tracking.
              </p>
            </div>

            {/* CARD 2: Evidence Gaps */}
            <div className="bg-slate-50/60 rounded-2xl p-7 border border-slate-200 hover:border-indigo-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Evidence Gaps</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Identify missing or conflicting information that may need clarification before formal complaint filing.
              </p>
            </div>

            {/* CARD 3: Explainable Analysis */}
            <div className="bg-slate-50/60 rounded-2xl p-7 border border-slate-200 hover:border-indigo-200 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Explainable Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Show what is known, what is alleged, what is supported, and what remains uncertain without hallucinated legal guarantees.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">NyayaSetu AI</span>
            <span className="text-slate-600">•</span>
            <span>Evidence Intelligence for Multi-Party Consumer Disputes</span>
          </div>
          <p className="text-slate-500 text-center sm:text-right">
            24-Hour Legal Hackathon Prototype • Stage 1 Foundation & Intake
          </p>
        </div>
      </footer>

    </div>
  );
};
