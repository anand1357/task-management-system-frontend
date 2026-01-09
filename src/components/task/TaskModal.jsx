import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import { FiX, FiClock, FiUser, FiMessageSquare, FiTrash2 } from 'react-icons/fi';

export default function TaskModal({ task, onClose, projectId }) {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const { data: comments } = useQuery({
    queryKey: ['comments', task.id],
    queryFn: () => taskService.getComments(task.id)
  });

  const addCommentMutation = useMutation({
    mutationFn: (content) => taskService.addComment(task.id, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', task.id]);
      setComment('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => taskService.deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', projectId]);
      onClose();
    }
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      addCommentMutation.mutate(comment);
    }
  };

  const PRIORITY_COLORS = {
    LOW: 'text-gray-600',
    MEDIUM: 'text-blue-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h2>
            <p className="text-sm text-gray-600">{task.projectName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Priority</p>
              <span className={`font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Assignee</p>
              <div className="flex items-center gap-2">
                {task.assignee ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
                      {task.assignee.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{task.assignee.username}</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Unassigned</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Due Date</p>
              <div className="flex items-center gap-2 text-sm">
                <FiClock className="text-gray-400" />
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiMessageSquare /> Comments ({comments?.length || 0})
            </h3>
            
            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
              <button
                type="submit"
                disabled={!comment.trim() || addCommentMutation.isLoading}
                className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Comment
              </button>
            </form>

            <div className="space-y-3">
              {comments?.map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.user.username}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                deleteMutation.mutate();
              }
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <FiTrash2 /> Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}