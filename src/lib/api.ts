import {
  AdminStats,
  AdminUser,
  ApiResponse,
  CreateTaskInput,
  PaginationMeta,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
  User,
} from './types';

// Default to production Vercel backend if on web, or localhost if running locally
const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/v1'
    : 'https://task-managemnet-api-six.vercel.app/api/v1');

export function getBaseApiUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lisso_api_url');
    if (saved) return saved;
  }
  return DEFAULT_API_URL;
}

export function setBaseApiUrl(url: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lisso_api_url', url);
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lisso_token');
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lisso_token', token);
  }
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lisso_token');
    localStorage.removeItem('lisso_user');
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseApiUrl().replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const rawData = await response.json().catch(() => ({
      status: 'error',
      message: `HTTP Error ${response.status}: ${response.statusText}`,
    }));

    const isSuccess =
      response.ok &&
      (rawData.success === true ||
        rawData.status === 'success' ||
        response.status < 400);

    if (!isSuccess) {
      return {
        success: false,
        message:
          rawData.message ||
          rawData.error ||
          `Error ${response.status}: ${response.statusText}`,
        error: rawData.error,
      };
    }

    return {
      success: true,
      message: rawData.message,
      data: rawData.data !== undefined ? (rawData.data as T) : (rawData as T),
      pagination: rawData.pagination,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Network request failed';
    return {
      success: false,
      message: `${errorMessage}. Make sure the backend server is running and accessible at ${baseUrl}`,
      error: errorMessage,
    };
  }
}

// Auth API & Task API & Admin API
export const api = {
  auth: {
    async register(
      name: string,
      email: string,
      password: string
    ): Promise<ApiResponse<{ user: User; token: string }>> {
      // 1. Call register endpoint
      const registerRes = await request<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      if (!registerRes.success) {
        return {
          success: false,
          message: registerRes.message || 'Registration failed',
        };
      }

      // 2. Automatically log in to obtain JWT access token
      return api.auth.login(email, password);
    },

    async login(
      email: string,
      password: string
    ): Promise<ApiResponse<{ user: User; token: string }>> {
      const res = await request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        const token =
          res.data.accessToken || res.data.token || res.data?.data?.accessToken;
        const user = res.data.user || res.data?.data?.user;

        if (token && user) {
          return {
            success: true,
            data: { user, token },
            message: res.message || 'Login successful',
          };
        }
      }

      return {
        success: false,
        message: res.message || 'Invalid credentials or missing token',
      };
    },

    async getMe(): Promise<ApiResponse<{ user: User }>> {
      const res = await request<any>('/users/me', {
        method: 'GET',
      });
      if (res.success && res.data) {
        const user = res.data.user || res.data;
        return { success: true, data: { user } };
      }
      return { success: false, message: res.message };
    },
  },

  tasks: {
    async getAll(params?: {
      page?: number;
      limit?: number;
      status?: TaskStatus;
      priority?: TaskPriority;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }): Promise<ApiResponse<Task[]>> {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.status) searchParams.set('status', params.status);
      if (params?.priority) searchParams.set('priority', params.priority);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

      const query = searchParams.toString();
      const res = await request<any>(`/tasks${query ? `?${query}` : ''}`, {
        method: 'GET',
      });

      if (res.success && res.data) {
        const tasks = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.tasks)
          ? res.data.tasks
          : [];

        return {
          success: true,
          data: tasks,
          pagination: res.pagination || res.data?.pagination,
        };
      }
      return {
        success: false,
        message: res.message,
        data: [],
      };
    },

    async getById(id: string): Promise<ApiResponse<Task>> {
      const res = await request<any>(`/tasks/${id}`, {
        method: 'GET',
      });
      if (res.success && res.data) {
        const task = res.data.task || res.data;
        return { success: true, data: task };
      }
      return { success: false, message: res.message };
    },

    async create(input: CreateTaskInput): Promise<ApiResponse<Task>> {
      const res = await request<any>('/tasks', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (res.success && res.data) {
        const task = res.data.task || res.data;
        return { success: true, data: task };
      }
      return { success: false, message: res.message };
    },

    async update(id: string, input: UpdateTaskInput): Promise<ApiResponse<Task>> {
      const res = await request<any>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      });
      if (res.success && res.data) {
        const task = res.data.task || res.data;
        return { success: true, data: task };
      }
      return { success: false, message: res.message };
    },

    async delete(id: string): Promise<ApiResponse<{ message: string }>> {
      return request<{ message: string }>(`/tasks/${id}`, {
        method: 'DELETE',
      });
    },
  },

  admin: {
    async getStats(): Promise<ApiResponse<AdminStats>> {
      return request<AdminStats>('/admin/stats', {
        method: 'GET',
      });
    },

    async getUsers(): Promise<ApiResponse<AdminUser[]>> {
      return request<AdminUser[]>('/admin/users', {
        method: 'GET',
      });
    },

    async updateRole(
      userId: string,
      role: 'user' | 'admin'
    ): Promise<ApiResponse<AdminUser>> {
      return request<AdminUser>(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
    },
  },

  async ping(): Promise<boolean> {
    try {
      const baseUrl = getBaseApiUrl().replace(/\/api\/v1\/?$/, '');
      const res = await fetch(`${baseUrl}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },
};
