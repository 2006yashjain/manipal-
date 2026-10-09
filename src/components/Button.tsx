import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]";

  const variantStyles = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow focus:ring-slate-900 border border-transparent",
    secondary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow focus:ring-indigo-600 border border-transparent",
    outline: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus:ring-slate-400",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-300",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-600"
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-semibold"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
