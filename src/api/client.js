// Unified API Client for MarketLink
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  getToken() {
    return localStorage.getItem('marketlink_token') || null;
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('marketlink_token', token);
    } else {
      localStorage.removeItem('marketlink_token');
    }
  }

  getUser() {
    try {
      const raw = localStorage.getItem('marketlink_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  setUser(user) {
    if (user) {
      localStorage.setItem('marketlink_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('marketlink_user');
    }
  }

  clearAuth() {
    localStorage.removeItem('marketlink_token');
    localStorage.removeItem('marketlink_user');
    window.dispatchEvent(new CustomEvent('marketlink:auth-cleared'));
  }

  buildUrl(endpoint, params = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    return url.toString();
  }

  async request(endpoint, options = {}) {
    const { method = 'GET', body, params, headers = {} } = options;
    const url = this.buildUrl(endpoint, params);

    const token = this.getToken();
    const reqHeaders = {
      Accept: 'application/json',
      ...headers,
    };

    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    let reqBody = body;
    if (body && !(body instanceof FormData) && typeof body === 'object') {
      reqHeaders['Content-Type'] = 'application/json';
      reqBody = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, {
        method,
        headers: reqHeaders,
        body: reqBody,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.clearAuth();
      }

      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        let errorMsg = data?.message || `Request failed with status ${response.status}`;
        if (data?.errors) {
          const firstError = Object.values(data.errors).flat()[0];
          if (firstError) errorMsg = firstError;
        }
        const error = new Error(errorMsg);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const networkError = new Error('Cannot connect to MarketLink backend server (http://localhost:8000). Please ensure Laravel server is running.');
        networkError.status = 0;
        throw networkError;
      }
      throw err;
    }
  }

  get(endpoint, params = {}, headers = {}) {
    return this.request(endpoint, { method: 'GET', params, headers });
  }

  post(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'POST', body, headers });
  }

  put(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'PUT', body, headers });
  }

  patch(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, { method: 'PATCH', body, headers });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
