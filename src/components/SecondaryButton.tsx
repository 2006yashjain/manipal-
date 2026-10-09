import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  variant?: 'outline' | 'ghost';
}

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  size = 'md',
  fullWidth = false,
  variant = 'outline',
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4.5 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl font-medium',
  };

  const variantStyles = {
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 shadow-subtle',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
