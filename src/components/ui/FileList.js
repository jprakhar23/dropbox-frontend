import React from 'react';
import FileCard from './FileCard';

const FileList = ({ 
  files = [], 
  onDeleteFile,
  deletingFileId = null,
  loading = false,
  className = '',
  emptyStateMessage = "No files found",
  emptyStateSubtext = "Get started by uploading your first file.",
  gridCols = { sm: 2, lg: 3 },
  cardVariant = 'default'
}) => {
  const getGridClasses = () => {
    const baseClasses = "grid grid-cols-1 gap-6";
    const smCols = `sm:grid-cols-${gridCols.sm}`;
    const lgCols = `lg:grid-cols-${gridCols.lg}`;
    return `${baseClasses} ${smCols} ${lgCols}`;
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <svg 
        className="mx-auto h-12 w-12 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 48 48"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {emptyStateMessage}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {emptyStateSubtext}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={getGridClasses()}>
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onDelete={onDeleteFile}
            isDeleting={deletingFileId === file.id}
            variant={cardVariant}
          />
        ))}
      </div>
    </div>
  );
};

export const CompactFileList = ({ 
  files, 
  onDeleteFile, 
  deletingFileId, 
  className = '' 
}) => (
  <FileList 
    files={files}
    onDeleteFile={onDeleteFile}
    deletingFileId={deletingFileId}
    cardVariant="compact"
    gridCols={{ sm: 3, lg: 4 }}
    className={className}
  />
);

export const FileListPreview = ({ 
  files, 
  className = '',
  maxItems = 6
}) => (
  <FileList 
    files={files.slice(0, maxItems)}
    cardVariant="compact"
    gridCols={{ sm: 2, lg: 3 }}
    emptyStateMessage="No recent files"
    emptyStateSubtext="Your recently uploaded files will appear here."
    className={className}
  />
);

export default FileList;