import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  showText = true,
  className = '',
  variant = 'blue'
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const variantClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-400',
    white: 'text-white'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${variantClasses[variant]}`}>
        <span className="sr-only">Loading...</span>
      </div>
      {showText && text && (
        <p className={`mt-2 ${textSizeClasses[size]} ${variantClasses[variant]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export const LoadingOverlay = ({ text = 'Loading...', className = '' }) => (
  <div className={`fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-40 ${className}`}>
    <LoadingSpinner size="large" text={text} />
  </div>
);

export const LoadingCard = ({ text = 'Loading...', className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-8 ${className}`}>
    <LoadingSpinner size="medium" text={text} />
  </div>
);

export const InlineLoader = ({ text = 'Loading...', className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <LoadingSpinner size="small" showText={false} />
    <span className="text-sm text-gray-600">{text}</span>
  </div>
);

export default LoadingSpinner;