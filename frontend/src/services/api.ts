import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptador de requisição - adiciona token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('vitacase_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptador de resposta - trata erros
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('vitacase_token');
          localStorage.removeItem('vitacase_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string) {
    return this.client.get<T>(url);
  }

  post<T = any>(url: string, data?: unknown) {
    return this.client.post<T>(url, data);
  }

  put<T = any>(url: string, data?: unknown) {
    return this.client.put<T>(url, data);
  }

  delete<T = any>(url: string) {
    return this.client.delete<T>(url);
  }

  patch<T = any>(url: string, data?: unknown) {
    return this.client.patch<T>(url, data);
  }
}

export default new ApiClient();
