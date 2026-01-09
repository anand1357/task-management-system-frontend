import api from './api';

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  searchUsers: async (keyword) => {
    const response = await api.get(`/users/search?keyword=${keyword}`);
    return response.data;
  }
};