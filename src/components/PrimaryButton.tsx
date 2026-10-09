import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4.5 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl font-semibold',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-subtle hover:shadow-card transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
