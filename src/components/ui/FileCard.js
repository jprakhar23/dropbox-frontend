import React from 'react';
import { Link } from 'react-router-dom';
import { fileAPI, apiUtils } from '../../services/api';
import FileIcon from './FileIcon';

const FileCard = ({ 
  file, 
  onDelete,
  isDeleting = false,
  className = '',
  variant = 'default',
  showActions = true,
  customActions = null
}) => {
  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(file);
    }
  };

  const formatFileInfo = () => {
    if (variant === 'compact') {
      return (
        <div className="text-xs text-gray-400">
          {apiUtils.formatFileSize(file.size)}
        </div>
      );
    }

    return (
      <>
        <p className="text-sm text-gray-500">
          {apiUtils.formatFileSize(file.size)}
        </p>
        <p className="text-xs text-gray-400">
          {apiUtils.formatDate(file.uploadDate)}
        </p>
      </>
    );
  };

  const getCardClasses = () => {
    const baseClasses = "group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow";
    
    if (variant === 'compact') {
      return `${baseClasses} p-4 ${className}`;
    }
    
    return `${baseClasses} p-6 ${className}`;
  };

  const getActionButtons = () => {
    if (customActions) {
      return customActions(file);
    }

    if (!showActions) {
      return null;
    }

    return (
      <div className="flex space-x-3">
        <Link
          to={`/file/${file.id}`}
          className="flex-1 text-center bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          View
        </Link>
        <a
          href={fileAPI.getDownloadUrl(file.id)}
          download
          className="flex-1 text-center bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Download
        </a>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="flex-1 text-center bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    );
  };

  return (
    <div className={getCardClasses()}>
      <div className="flex items-center">
        <FileIcon 
          filename={file.originalName} 
          variant="colored"
          size={variant === 'compact' ? 'small' : 'medium'}
        />
        <div className="ml-4 flex-1 min-w-0">
          <h3 className={`font-medium text-gray-900 truncate ${variant === 'compact' ? 'text-sm' : 'text-sm'}`}>
            {file.originalName}
          </h3>
          {formatFileInfo()}
        </div>
      </div>
      
      {showActions && (
        <div className="mt-4">
          {getActionButtons()}
        </div>
      )}
    </div>
  );
};

export const CompactFileCard = ({ file, onDelete, isDeleting, className = '' }) => (
  <FileCard 
    file={file}
    onDelete={onDelete}
    isDeleting={isDeleting}
    variant="compact"
    className={className}
  />
);

export const DetailedFileCard = ({ file, onDelete, isDeleting, className = '' }) => (
  <FileCard 
    file={file}
    onDelete={onDelete}
    isDeleting={isDeleting}
    variant="detailed"
    className={className}
  />
);

export const FileCardPreview = ({ file, className = '' }) => (
  <FileCard 
    file={file}
    variant="compact"
    showActions={false}
    className={className}
  />
);

export default FileCard;