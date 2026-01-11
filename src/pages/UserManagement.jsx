import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiMail, FiShield } from 'react-icons/fi';

const ROLE_OPTIONS = [
  { value: 'user', label: 'User', color: 'bg-gray-100 text-gray-700', description: 'Can view and manage assigned tasks' },
  // { value: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-700', description: 'Can create projects and manage teams' },
  { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-700', description: 'Full system access' },
  // { value: 'product_owner', label: 'Product Owner', color: 'bg-green-100 text-green-700', description: 'Overall product management' }
];

const ROLE_COLORS = {
  ROLE_USER: 'bg-gray-100 text-gray-700',
  ROLE_MANAGER: 'bg-blue-100 text-blue-700',
  ROLE_ADMIN: 'bg-purple-100 text-purple-700',
  ROLE_PRODUCT_OWNER: 'bg-green-100 text-green-700'
};

export default function UserManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const activateUserMutation = useMutation({
    mutationFn: userService.activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleActivateUser = (userId) => {
    if (window.confirm('Are you sure you want to activate this user?')) {
      activateUserMutation.mutate(userId);
    }
  };

  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil((filteredUsers?.length || 0) / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users and their roles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiPlus /> Create User
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, username, or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <FiUser className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) :               filteredUsers?.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers?.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-lg font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.fullName || user.username}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMail size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map(role => (
                        <span
                          key={role}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${ROLE_COLORS[role]}`}
                        >
                          {role.replace('ROLE_', '')}
                        </span>
                      ))}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-primary-600 hover:text-primary-700"
                        title="Edit user"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      
                      <button
                        onClick={() => user.active ? handleDeleteUser(user.id) : handleActivateUser(user.id)}
                        className={`${user.active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                        title={user.active ? 'Deactivate user' : 'Activate user'}
                      >
                        {user.active ? <FiTrash2 size={18} /> : <FiShield size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border-t px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers?.length || 0)} of {filteredUsers?.length || 0} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {(showCreateModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowCreateModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}

// User Modal Component
function UserModal({ user, onClose }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    fullName: user?.fullName || '',
    roles: user?.roles?.map(r => r.replace('ROLE_', '').toLowerCase()) || ['user']
  });
  const [error, setError] = useState('');
  const queryClient = useQueryClient();


  const createMutation = useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      return fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      }).then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      onClose();
    },
    onError: (err) => {
      setError('Failed to update user');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!user && !formData.password) {
      setError('Password is required for new users');
      return;
    }

    if (user) {
      // Update existing user
      updateMutation.mutate({
        id: user.id,
        data: {
          fullName: formData.fullName,
          roles: formData.roles
        }
      });
    } else {
      // Create new user
      createMutation.mutate(formData);
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: [role] // Only allow one role
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{user ? 'Edit User' : 'Create New User'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
                disabled={!!user}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-3">Role * (Select One)</label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map(role => (
                <div
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition ${
                    formData.roles.includes(role.value)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={formData.roles.includes(role.value)}
                        onChange={() => handleRoleChange(role.value)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div className="flex items-center gap-2">
                        <FiShield className="text-gray-500" />
                        <span className="font-semibold">{role.label}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${role.color}`}>
                      {role.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8 mt-1">{role.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {createMutation.isLoading ? 'Creating...' : user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}