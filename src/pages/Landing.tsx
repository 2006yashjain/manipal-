import React from 'react';
import { 
  ArrowRight, 
  User, 
  Store, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Layers, 
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
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>Hackathon Prototype</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto">
            Turn a confusing consumer dispute into a clear, evidence-backed case.
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Organize your evidence, reconstruct what happened, identify important gaps, and prepare a structured case.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <PrimaryButton size="lg" onClick={onStartCase} icon={<ArrowRight className="w-4 h-4" />}>
              Start a Case
            </PrimaryButton>
            <SecondaryButton size="lg" onClick={onHowItWorksClick} icon={<ArrowDown className="w-4 h-4" />}>
              See How It Works
            </SecondaryButton>
          </div>

          {/* Simple Visual */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-600 uppercase tracking-widest opacity-80">
            <div className="flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> Consumer</div>
            <ArrowRight className="w-3 h-3 text-slate-300 hidden sm:block" />
            <div className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-slate-400" /> Marketplace</div>
            <ArrowRight className="w-3 h-3 text-slate-300 hidden sm:block" />
            <div className="flex items-center gap-1.5"><Store className="w-4 h-4 text-slate-400" /> Seller</div>
            <ArrowRight className="w-3 h-3 text-slate-300 hidden sm:block" />
            <div className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-slate-400" /> Payment</div>
            <ArrowRight className="w-3 h-3 text-slate-300 hidden sm:block" />
            <div className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-slate-400" /> Logistics</div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (Capabilities) */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Three simple steps to build your case.</h2>
            <p className="mt-3 text-slate-500">We guide you from gathering evidence to a structured dossier.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-subtle transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-5 shadow-sm text-indigo-600">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Organize Evidence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your invoices, chats, and photos in one place. NyayaSetu structures your facts automatically.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-subtle transition-shadow">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-5 shadow-sm text-indigo-600">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Reconstruct the Transaction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                See the timeline of events, map the relationships between parties, and spot important evidence gaps.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-elevated relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-colors"></div>
              <div className="w-12 h-12 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center mb-5 text-indigo-300 relative z-10">
                <ArrowRight className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">3. Build the Case</h3>
              <p className="text-sm text-slate-400 leading-relaxed relative z-10">
                Generate a professional case brief and complaint draft, ready to be reviewed by an advocate or submitted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="py-8 bg-slate-50 border-t border-slate-200 mt-auto text-center">
        <p className="text-xs text-slate-400">
          NyayaSetu AI is a hackathon prototype. Not a government portal. Does not provide legal advice.
        </p>
      </footer>
      
    </div>
  );
};
