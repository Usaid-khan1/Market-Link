import apiClient from './client';

export const farmerApi = {
  // 1. Profile & Stall Configuration
  getProfile() {
    return apiClient.get('/farmer/profile');
  },
  updateProfile(data) {
    return apiClient.put('/farmer/profile', data);
  },

  // 2. Insights & Dashboard Stats
  getInsights() {
    return apiClient.get('/farmer/insights');
  },

  // 3. Product Catalog Management (CRUD + status toggle)
  getProducts(params = {}) {
    return apiClient.get('/farmer/products', params);
  },
  createProduct(data) {
    return apiClient.post('/farmer/products', data);
  },
  getProduct(id) {
    return apiClient.get(`/farmer/products/${id}`);
  },
  updateProduct(id, data) {
    return apiClient.put(`/farmer/products/${id}`, data);
  },
  deleteProduct(id) {
    return apiClient.delete(`/farmer/products/${id}`);
  },
  toggleProductStatus(id, status) {
    return apiClient.patch(`/farmer/products/${id}/status`, { status });
  },

  // 4. Weekly Stock Templates
  getStockTemplates() {
    return apiClient.get('/farmer/stock-templates');
  },
  saveStockTemplates(data) {
    return apiClient.post('/farmer/stock-templates', data);
  },
  applyStockTemplates(day) {
    return apiClient.post('/farmer/stock-templates/apply', { day_of_week: day });
  },

  // 5. Pre-Orders Management
  getOrders(params = {}) {
    return apiClient.get('/farmer/orders', params);
  },
  getOrder(id) {
    return apiClient.get(`/farmer/orders/${id}`);
  },
  updateOrderStatus(id, status) {
    return apiClient.patch(`/farmer/orders/${id}/status`, { status });
  },

  // 6. Reviews & Responses
  getReviews() {
    return apiClient.get('/farmer/reviews');
  },
  replyReview(id, reply) {
    return apiClient.post(`/farmer/reviews/${id}/reply`, { reply });
  },
};

export default farmerApi;
