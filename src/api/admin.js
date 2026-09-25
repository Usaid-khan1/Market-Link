import apiClient from './client';

export const adminApi = {
  // 1. Dashboard summary & Reports
  getSummary() {
    return apiClient.get('/admin/dashboard/summary');
  },
  getReports(params = {}) {
    return apiClient.get('/admin/reports', params);
  },

  // 2. Manage Farmers
  getFarmers(params = {}) {
    return apiClient.get('/admin/farmers', params);
  },
  getFarmer(id) {
    return apiClient.get(`/admin/farmers/${id}`);
  },
  updateFarmerStatus(id, status) {
    return apiClient.patch(`/admin/farmers/${id}/status`, { status });
  },

  // 3. Manage Customers
  getCustomers(params = {}) {
    return apiClient.get('/admin/customers', params);
  },
  getCustomer(id) {
    return apiClient.get(`/admin/customers/${id}`);
  },
  updateCustomerStatus(id, status) {
    return apiClient.patch(`/admin/customers/${id}/status`, { status });
  },

  // 4. Manage Markets CRUD
  getMarkets() {
    return apiClient.get('/admin/markets');
  },
  createMarket(data) {
    return apiClient.post('/admin/markets', data);
  },
  getMarket(id) {
    return apiClient.get(`/admin/markets/${id}`);
  },
  updateMarket(id, data) {
    return apiClient.put(`/admin/markets/${id}`, data);
  },
  deleteMarket(id) {
    return apiClient.delete(`/admin/markets/${id}`);
  },

  // 5. Manage Categories CRUD
  getCategories() {
    return apiClient.get('/admin/categories');
  },
  createCategory(data) {
    return apiClient.post('/admin/categories', data);
  },
  updateCategory(id, data) {
    return apiClient.put(`/admin/categories/${id}`, data);
  },
  deleteCategory(id) {
    return apiClient.delete(`/admin/categories/${id}`);
  },

  // 6. Content Moderation (Products & Reviews)
  getModerationProducts(params = {}) {
    return apiClient.get('/admin/moderation/products', params);
  },
  deleteModerationProduct(id) {
    return apiClient.delete(`/admin/moderation/products/${id}`);
  },
  getModerationReviews(params = {}) {
    return apiClient.get('/admin/moderation/reviews', params);
  },
  deleteModerationReview(id) {
    return apiClient.delete(`/admin/moderation/reviews/${id}`);
  },

  // 7. Platform Announcements CRUD
  getAnnouncements() {
    return apiClient.get('/admin/announcements');
  },
  createAnnouncement(data) {
    return apiClient.post('/admin/announcements', data);
  },
  updateAnnouncement(id, data) {
    return apiClient.put(`/admin/announcements/${id}`, data);
  },
  deleteAnnouncement(id) {
    return apiClient.delete(`/admin/announcements/${id}`);
  },
};

export default adminApi;
