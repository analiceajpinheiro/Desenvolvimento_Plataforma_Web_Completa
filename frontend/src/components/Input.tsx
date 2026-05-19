import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
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
      <input
        {...props}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
