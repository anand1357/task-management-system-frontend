import api from './api';

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get('/projects');
    console.log("get projects", response.data);
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  addMember: async (projectId, userId) => {
    const response = await api.post(`/projects/${projectId}/members/${userId}`);
    return response.data;
  },

  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  }
};