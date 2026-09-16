import { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string | undefined;
  error?: string | undefined;
  options: SelectOption[];
  placeholder?: string | undefined;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-muted mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`
            w-full rounded-lg border border-white/10 bg-surface-2
            px-3 py-2 text-sm text-ivory
            focus:border-gold/60 focus:ring-2 focus:ring-gold/20
            transition-all duration-200
            disabled:bg-surface disabled:cursor-not-allowed
            appearance-none cursor-pointer
            ${error ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
