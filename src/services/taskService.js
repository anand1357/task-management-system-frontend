import api from './api';

export const taskService = {
  getTasksByProject: async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  getMyTasks: async () => {
    const response = await api.get('/tasks/my-tasks');
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status?status=${status}`);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  addComment: async (taskId, content) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  getComments: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/tasks/comments/${commentId}`);
    return response.data;
  }
};