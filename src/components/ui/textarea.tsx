import { forwardRef, useState } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, showCharCount, maxLength, className = '', id, ...props }, ref) => {
    const [value, setValue] = useState(props.value as string || '');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={id}
            className={`
              w-full rounded-lg border border-gray-300 bg-white
              px-3 py-2 text-sm text-gray-900
              placeholder:text-gray-400
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
              transition-all duration-150 resize-y min-h-[80px]
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            value={value}
            maxLength={maxLength}
            onChange={handleChange}
            {...props}
          />
          {showCharCount && maxLength && (
            <div className={`absolute bottom-2 right-2 text-xs ${value.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
              {value.length}/{maxLength}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
