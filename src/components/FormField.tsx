import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  optional,
  hint,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500 font-normal">*</span>}
        </label>
        {optional && (
          <span className="text-[11px] font-medium text-slate-400">Optional</span>
        )}
      </div>
      {children}
      {hint && <p className="text-[11px] text-slate-500 leading-tight mt-1">{hint}</p>}
    </div>
  );
};
