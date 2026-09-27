import apiClient from './client';

export const browseApi = {
  getMarkets(params = {}) {
    return apiClient.get('/browse/markets', params);
  },

  getMarket(id) {
    return apiClient.get(`/browse/markets/${id}`);
  },

  getProducts(params = {}) {
    return apiClient.get('/browse/products', params);
  },

  getProduct(id) {
    return apiClient.get(`/browse/products/${id}`);
  },

  getFarmers(params = {}) {
    return apiClient.get('/browse/farmers', params);
  },

  getFarmer(id) {
    return apiClient.get(`/browse/farmers/${id}`);
  },

  getAnnouncements() {
    return apiClient.get('/announcements');
  },

  getStalls(params = {}) {
    return apiClient.get('/browse/stalls', params);
  },
};

export default browseApi;
