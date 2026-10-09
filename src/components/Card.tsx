import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'subtle' | 'elevated' | 'bordered';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-subtle',
    subtle: 'bg-slate-50/80 border border-slate-200/60',
    elevated: 'bg-white border border-slate-200 shadow-card',
    bordered: 'bg-white border-2 border-slate-200 shadow-none'
  };

  const hoverStyles = hoverable
    ? 'transition-all duration-200 hover:border-slate-300 hover:shadow-card cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 ${variantStyles[variant]} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, badge, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
    <div>
      <div className="flex items-center gap-2.5">
        <h3 className="font-semibold text-slate-900 text-base sm:text-lg tracking-tight">{title}</h3>
        {badge}
      </div>
      {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
