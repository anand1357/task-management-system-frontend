import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { FiPlus, FiFolder, FiUsers, FiCheckSquare, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function Projects() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', projectKey: '' });
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAllProjects
  });

  const createMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', projectKey: '' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setEditingProject(null);
      setFormData({ name: '', description: '', projectKey: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      projectKey: project.projectKey
    });
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? All tasks will be removed.')) {
      deleteMutation.mutate(projectId);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingProject(null);
    setFormData({ name: '', description: '', projectKey: '' });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiPlus /> Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 relative group">
            <Link to={`/projects/${project.id}`} className="block">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <FiFolder className="text-primary-600" size={24} />
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {project.projectKey}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FiCheckSquare size={16} />
                  <span>{project.taskCount || 0} tasks</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiUsers size={16} />
                  <span>{project.members?.length || 0} members</span>
                </div>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEdit(project);
                }}
                className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                title="Edit project"
              >
                <FiEdit2 size={16} className="text-primary-600" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(project.id);
                }}
                className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                title="Delete project"
              >
                <FiTrash2 size={16} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Project Modal */}
      {(showCreateModal || editingProject) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project Key</label>
                <input
                  type="text"
                  value={formData.projectKey}
                  onChange={(e) => setFormData({ ...formData, projectKey: e.target.value.toUpperCase() })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., PROJ"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {createMutation.isLoading || updateMutation.isLoading 
                    ? 'Saving...' 
                    : editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
