import * as React from 'react';
import classNames from 'classnames';

interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  required = false,
  autoComplete,
  error,
  disabled = false,
  className = '',
}) => {
  const inputClasses = classNames(
    'w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 text-sm bg-gray-50',
    {
      'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500': error,
      'opacity-50 cursor-not-allowed': disabled,
    },
    className
  );

  const labelClasses = classNames(
    'block text-sm font-medium text-gray-700 mb-2',
    {
      'text-red-600': error,
    }
  );

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className={labelClasses}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        className={inputClasses}
      />
    </div>
  );
};
