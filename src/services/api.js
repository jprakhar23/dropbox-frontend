import axios from 'axios';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// File API Service

export const fileAPI = {
  uploadFile: async (file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      } : undefined,
    };

    const response = await apiClient.post('/files', formData, config);
    return response.data;
  },

  getFiles: async () => {
    const response = await apiClient.get('/files');
    return response.data;
  },

  getFileById: async (fileId) => {
    const response = await apiClient.get(`/files/${fileId}`);
    return response.data;
  },

  downloadFile: async (fileId) => {
    const response = await apiClient.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response;
  },

  getDownloadUrl: (fileId) => {
    return `${API_BASE_URL}/files/${fileId}/download`;
  },

  getViewUrl: (fileId) => {
    return `${API_BASE_URL}/files/${fileId}/view`;
  },

  deleteFile: async (fileId) => {
    const response = await apiClient.delete(`/files/${fileId}`);
    return response.data;
  },
};

// Health API Service

export const healthAPI = {
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  checkDatabaseHealth: async () => {
    const response = await apiClient.get('/health/database');
    return response.data;
  },
};

// Utility functions

export const apiUtils = {
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getFileExtension: (filename) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  },

  isSupportedFileType: (filename) => {
    const supportedTypes = ['txt', 'jpg', 'jpeg', 'png', 'json', 'pdf'];
    const extension = apiUtils.getFileExtension(filename);
    return supportedTypes.includes(extension);
  },

  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

export default apiClient;