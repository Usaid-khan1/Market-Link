import apiClient from './client';

export const authApi = {
  async register(data) {
    const res = await apiClient.post('/register', data);
    if (res.data?.token) {
      apiClient.setToken(res.data.token);
      apiClient.setUser(res.data.user);
    }
    return res;
  },

  async login(credentials) {
    const res = await apiClient.post('/login', credentials);
    if (res.data?.token) {
      apiClient.setToken(res.data.token);
      apiClient.setUser(res.data.user);
    }
    return res;
  },

  async logout() {
    try {
      await apiClient.post('/logout');
    } finally {
      apiClient.clearAuth();
    }
  },

  async getMe() {
    const res = await apiClient.get('/me');
    if (res.data) {
      apiClient.setUser(res.data);
    }
    return res.data;
  },
};

export default authApi;
