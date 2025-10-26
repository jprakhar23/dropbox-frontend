import React from 'react';
import { apiUtils } from '../../services/api';

const FileIcon = ({ 
  filename, 
  size = 'medium', 
  className = '',
  showExtension = true,
  variant = 'default'
}) => {
  const extension = apiUtils.getFileExtension(filename);
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  const getIconStyles = () => {
    const baseClasses = `${sizeClasses[size]} rounded-lg flex items-center justify-center font-semibold ${className}`;
    
    if (variant === 'minimal') {
      return `${baseClasses} bg-gray-100 text-gray-600 border border-gray-200`;
    }
    
    if (variant === 'colored') {
      const colorMap = {
        txt: 'bg-blue-100 text-blue-700 border border-blue-200',
        json: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        pdf: 'bg-red-100 text-red-700 border border-red-200',
        jpg: 'bg-green-100 text-green-700 border border-green-200',
        jpeg: 'bg-green-100 text-green-700 border border-green-200',
        png: 'bg-green-100 text-green-700 border border-green-200',
        default: 'bg-gray-100 text-gray-700 border border-gray-200'
      };
      return `${baseClasses} ${colorMap[extension] || colorMap.default}`;
    }
    
    return `${baseClasses} file-icon ${extension}`;
  };

  const displayText = showExtension 
    ? extension.toUpperCase()
    : extension.charAt(0).toUpperCase();

  return (
    <div className={getIconStyles()}>
      {displayText}
    </div>
  );
};

export const SmallFileIcon = ({ filename, className = '' }) => (
  <FileIcon 
    filename={filename} 
    size="small" 
    variant="colored"
    showExtension={false}
    className={className}
  />
);

export const LargeFileIcon = ({ filename, className = '' }) => (
  <FileIcon 
    filename={filename} 
    size="large" 
    variant="colored"
    className={className}
  />
);

export const MinimalFileIcon = ({ filename, size = 'medium', className = '' }) => (
  <FileIcon 
    filename={filename} 
    size={size}
    variant="minimal"
    className={className}
  />
);

export default FileIcon;