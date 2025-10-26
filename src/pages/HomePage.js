import React, { useState, useEffect } from 'react';
import { fileAPI, apiUtils } from '../services/api';
import { 
  ConfirmationModal, 
  LoadingSpinner, 
  ErrorMessage, 
  UploadProgress, 
  FileList 
} from '../components/ui';

const HomePage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fileAPI.getFiles();
      setFiles(response.data || []);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!apiUtils.isSupportedFileType(file.name)) {
      setError(`File type not supported. Supported types: txt, jpg, png, json, pdf`);
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      await fileAPI.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      // Reload files after successful upload
      await loadFiles();
      setUploadProgress(0);
      
      // Reset file input
      event.target.value = '';
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      setDeletingFileId(fileToDelete.id);
      setError(null);

      await fileAPI.deleteFile(fileToDelete.id);
      
      // Remove file from the files list
      setFiles(files.filter(file => file.id !== fileToDelete.id));
      
      // Reset delete state
      setShowDeleteConfirm(false);
      setFileToDelete(null);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again.');
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner text="Loading files..." />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">My Files</h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload and manage your files. Supported formats: TXT, JPG, PNG, JSON, PDF
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {/* File Upload Button */}
          <label className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload File
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".txt,.jpg,.jpeg,.png,.json,.pdf"
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      <UploadProgress 
        progress={uploadProgress}
        isVisible={uploading}
        className="mt-4"
      />

      {/* Error Message */}
      {error && (
        <div className="mt-4">
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
            variant="error"
          />
        </div>
      )}

      {/* Files List */}
      <FileList
        files={files}
        onDeleteFile={handleDeleteClick}
        deletingFileId={deletingFileId}
        className="mt-8"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete File"
        message={`Are you sure you want to delete "${fileToDelete?.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingFileId === fileToDelete?.id}
        loadingText="Deleting..."
        variant="danger"
      />
    </div>
  );
};

export default HomePage;