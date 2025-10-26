import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fileAPI, apiUtils } from '../services/api';
import { ConfirmationModal, LoadingSpinner, ErrorMessage, FileIcon } from '../components/ui';

const FileViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadFile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fileAPI.getFileById(id);
      const fileData = response.data;
      setFile(fileData);

      const extension = apiUtils.getFileExtension(fileData.originalName);
      if (['txt', 'json'].includes(extension)) {
        try {
          const downloadResponse = await fileAPI.downloadFile(id);
          const content = await downloadResponse.data.text();
          setFileContent(content);
        } catch (contentError) {
          console.error('Error loading file content:', contentError);
          setFileContent('Unable to load file content');
        }
      }
    } catch (err) {
      console.error('Error loading file:', err);
      setError('File not found or unable to load');
    } finally {
      setLoading(false);
    }
    };

    loadFile();
  }, [id]);

  const handleDownload = () => {
    window.open(fileAPI.getDownloadUrl(id), '_blank');
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!file) return;

    try {
      setDeleting(true);
      await fileAPI.deleteFile(id);
      
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again.');
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const renderFileContent = () => {
    if (!file) return null;

    const extension = apiUtils.getFileExtension(file.originalName);

    switch (extension) {
      case 'txt':
        return (
          <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
            <pre className="whitespace-pre-wrap break-words">
              {fileContent || 'Loading content...'}
            </pre>
          </div>
        );

      case 'json':
        let formattedJson = fileContent;
        let hasParseError = false;
        try {
          if (fileContent) {
            const parsed = JSON.parse(fileContent);
            formattedJson = JSON.stringify(parsed, null, 2);
          }
        } catch (e) {
          formattedJson = fileContent;
          hasParseError = true;
        }
        
        return (
          <div className="space-y-4">
            {hasParseError && (
              <ErrorMessage 
                message="Invalid JSON format detected. Showing original content without formatting." 
                variant="warning"
              />
            )}
            <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
              <pre className="whitespace-pre-wrap break-words">
                {formattedJson || 'Loading content...'}
              </pre>
            </div>
          </div>
        );

      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <img
              src={fileAPI.getViewUrl(id)}
              alt={file.originalName}
              className="max-w-full h-auto mx-auto rounded-lg shadow-md"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        );

      case 'pdf':
        return (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="bg-white rounded-lg shadow-inner">
              <iframe
                src={fileAPI.getViewUrl(id)}
                className="w-full rounded-lg"
                style={{ height: '80vh', minHeight: '600px' }}
                title={`PDF Viewer - ${file.originalName}`}
              >
                <p>
                  Your browser does not support PDF viewing. 
                  <a 
                    href={fileAPI.getDownloadUrl(id)} 
                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                  >
                    Download the PDF
                  </a>
                </p>
              </iframe>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">
              Preview not available for this file type
            </p>
            <button
              onClick={handleDownload}
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Download to view
            </button>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner text="Loading file..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <ErrorMessage 
            message={error}
            title="Error loading file"
            variant="error"
            size="large"
            dismissible={false}
            className="mb-6"
          />
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Files
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              My Files
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {file?.originalName}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Go to My Files Box */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V9a2 2 0 012-2h14a2 2 0 012 2v-2M7 7h10" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900">
                My Files
              </h3>
              <p className="text-sm text-blue-700">
                Browse all your uploaded files and manage your storage
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V9a2 2 0 012-2h14a2 2 0 012 2v-2M7 7h10" />
              </svg>
              Go to My Files
            </Link>
          </div>
        </div>
      </div>

      {/* File Header */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon 
                filename={file.originalName}
                variant="colored"
                size="large"
              />
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">{file.originalName}</h1>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{apiUtils.formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{apiUtils.formatDate(file.uploadDate)}</span>
                  <span>•</span>
                  <span className="capitalize">{file.mimeType}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File Content */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Preview</h2>
        </div>
        <div className="p-6">
          {renderFileContent()}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete File"
        message={`Are you sure you want to delete "${file?.originalName}"? This action cannot be undone and you will be redirected to the home page.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleting}
        loadingText="Deleting..."
        variant="danger"
      />
    </div>
  );
};

export default FileViewPage;