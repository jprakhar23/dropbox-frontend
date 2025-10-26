import React from 'react';
import { InlineLoader } from './LoadingSpinner';

const UploadProgress = ({ 
  progress = 0, 
  isVisible = false,
  filename = null,
  variant = 'default',
  className = '',
  showSpinner = true,
  customMessage = null
}) => {
  if (!isVisible) return null;

  const getMessage = () => {
    if (customMessage) return customMessage;
    
    if (variant === 'detailed' && filename) {
      return `Uploading "${filename}"... ${progress}%`;
    }
    
    return `Uploading... ${progress}%`;
  };

  const getProgressBarColor = () => {
    if (progress >= 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-yellow-600';
    return 'bg-blue-600';
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showSpinner && <InlineLoader showText={false} />}
        <div className="flex-1 bg-blue-200 rounded-full h-2">
          <div 
            className={`${getProgressBarColor()} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="text-sm text-blue-800 font-medium">
          {progress}%
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-md p-4 ${className}`}>
      <div className="flex items-center">
        {showSpinner && (
          <div className="loading-spinner w-6 h-6 border-2 mr-3"></div>
        )}
        <span className="text-sm text-blue-800 font-medium">
          {getMessage()}
        </span>
      </div>
      
      <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
        <div 
          className={`${getProgressBarColor()} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      {variant === 'detailed' && (
        <div className="mt-2 flex justify-between text-xs text-blue-700">
          <span>{progress >= 100 ? 'Upload complete!' : 'Upload in progress...'}</span>
          <span>{progress}% complete</span>
        </div>
      )}
    </div>
  );
};

export const CompactUploadProgress = ({ progress, isVisible, className = '' }) => (
  <UploadProgress 
    progress={progress}
    isVisible={isVisible}
    variant="compact"
    className={className}
  />
);

export const DetailedUploadProgress = ({ 
  progress, 
  isVisible, 
  filename, 
  className = '' 
}) => (
  <UploadProgress 
    progress={progress}
    isVisible={isVisible}
    filename={filename}
    variant="detailed"
    className={className}
  />
);

export default UploadProgress;