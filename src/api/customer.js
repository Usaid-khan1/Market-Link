import apiClient from './client';

export const customerApi = {
  // 1. Orders Management
  getOrders(params = {}) {
    return apiClient.get('/customer/orders', params);
  },
  createOrder(data) {
    return apiClient.post('/customer/orders', data);
  },
  getOrder(id) {
    return apiClient.get(`/customer/orders/${id}`);
  },
  modifyOrder(id, data) {
    return apiClient.patch(`/customer/orders/${id}`, data);
  },
  cancelOrder(id) {
    return apiClient.post(`/customer/orders/${id}/cancel`);
  },
  reorder(id, data = {}) {
    return apiClient.post(`/customer/orders/${id}/reorder`, data);
  },

  // 2. Favorites
  getFavorites(params = {}) {
    return apiClient.get('/customer/favorites', params);
  },
  toggleFavorite(type, targetId) {
    return apiClient.post('/customer/favorites/toggle', {
      type,
      target_id: targetId,
    });
  },

  // 3. Reviews
  getReviews() {
    return apiClient.get('/customer/reviews');
  },
  createReview(data) {
    return apiClient.post('/customer/reviews', data);
  },

  // 4. Notifications
  getNotifications(params = {}) {
    return apiClient.get('/customer/notifications', params);
  },
  markNotificationRead(id) {
    return apiClient.patch(`/customer/notifications/${id}/read`);
  },
  markAllNotificationsRead() {
    return apiClient.patch('/customer/notifications/read-all');
  },
};

export default customerApi;
