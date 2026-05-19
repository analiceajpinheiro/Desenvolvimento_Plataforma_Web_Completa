import React from 'react';

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  ...props
}) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-gray-700 font-semibold mb-2">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
      >
        <option value="">Selecione uma opção</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
