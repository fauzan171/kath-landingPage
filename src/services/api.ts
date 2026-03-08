// Base API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

// Helper function untuk handle response
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error.message || 'An error occurred');
  }
  return response.json();
}

// Helper function untuk get auth header
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Generic GET request
export async function get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse<T>(response);
}

// Generic POST request
export async function post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: data ? JSON.stringify(data) : undefined,
  });

  return handleResponse<T>(response);
}

// Generic PUT request
export async function put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

// Generic DELETE request
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse<T>(response);
}

// File upload
export async function uploadFile(file: File, folder?: string): Promise<ApiResponse<{ url: string; filename: string }>> {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) formData.append('folder', folder);

  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  return handleResponse(response);
}

// Export base URL for image references
export { API_BASE_URL };