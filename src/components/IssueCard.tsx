import React from 'react';
import { CreditCard, PackageX, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { IssueCategoryType } from '../types';

interface IssueCardProps {
  selectedCategory: IssueCategoryType | null;
  onSelectCategory: (category: IssueCategoryType) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: {
    id: IssueCategoryType;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'payment_refund_unresolved',
      title: 'Payment successful / order cancelled / refund unresolved',
      description: 'Money was deducted, order failed or cancelled, or return was initiated but refund is delayed or missing.',
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
    },
    {
      id: 'product_not_delivered',
      title: 'Product not delivered',
      description: 'The estimated delivery date has passed, tracking is stuck, or order is falsely marked as delivered.',
      icon: <PackageX className="w-5 h-5 text-indigo-600" />,
    },
    {
      id: 'defective_not_as_described',
      title: 'Defective / not-as-described product',
      description: 'Item received in damaged condition, physically broken, counterfeit, or significantly different from description.',
      icon: <AlertTriangle className="w-5 h-5 text-indigo-600" />,
    },
  ];

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3.5 select-none ${
              isSelected
                ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              {isSelected ? <CheckCircle2 className="w-5 h-5 text-white" /> : cat.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4
                  className={`text-sm font-bold leading-snug ${
                    isSelected ? 'text-indigo-950' : 'text-slate-900'
                  }`}
                >
                  {cat.title}
                </h4>
                {isSelected && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-md">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
