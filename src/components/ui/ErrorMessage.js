import React from 'react';

const ErrorMessage = ({ 
  message, 
  onDismiss,
  variant = 'error',
  size = 'medium',
  className = '',
  dismissible = true,
  title = null,
  icon = true
}) => {
  if (!message) return null;

  const variantStyles = {
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      button: 'text-red-400 hover:text-red-600',
      iconPath: "M6 18L18 6M6 6l12 12"
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      button: 'text-yellow-400 hover:text-yellow-600',
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z"
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      button: 'text-blue-400 hover:text-blue-600',
      iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      button: 'text-green-400 hover:text-green-600',
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  };

  const sizeStyles = {
    small: {
      container: 'p-3 text-sm',
      icon: 'h-4 w-4',
      button: 'h-4 w-4'
    },
    medium: {
      container: 'p-4 text-sm',
      icon: 'h-5 w-5',
      button: 'h-5 w-5'
    },
    large: {
      container: 'p-6 text-base',
      icon: 'h-6 w-6',
      button: 'h-6 w-6'
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const getIcon = () => {
    if (variant === 'error') {
      return (
        <svg className={`${currentSize.icon} ${currentVariant.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className={`${currentSize.icon} ${currentVariant.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentVariant.iconPath} />
      </svg>
    );
  };

  return (
    <div className={`border rounded-md ${currentVariant.container} ${currentSize.container} ${className}`}>
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
        )}
        <div className={`${icon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className="font-medium mb-1">
              {title}
            </h3>
          )}
          <div className={title ? '' : 'font-medium'}>
            {message}
          </div>
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentVariant.button}`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className={currentSize.button} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ErrorCard = ({ message, onRetry, className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-6 text-center ${className}`}>
    <ErrorMessage 
      message={message} 
      variant="error" 
      size="large" 
      dismissible={false}
      className="border-0 bg-transparent p-0"
    />
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export const InlineError = ({ message, className = '' }) => (
  <ErrorMessage 
    message={message}
    variant="error"
    size="small"
    dismissible={false}
    className={`border-0 bg-transparent p-0 text-red-600 ${className}`}
    icon={false}
  />
);

export default ErrorMessage;