import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const baseStyles = 'p-4 rounded-lg flex items-center justify-between';
  
  const typeStyles = {
    success: 'bg-green-100 text-green-800 border border-green-300',
    error: 'bg-red-100 text-red-800 border border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      <p>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-lg font-bold hover:opacity-70"
        >
          ×
        </button>
      )}
    </div>
  );
};
