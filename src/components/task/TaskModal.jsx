// import { useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { taskService } from '../../services/taskService';
// import { FiX, FiClock, FiUser, FiMessageSquare, FiTrash2 } from 'react-icons/fi';

// export default function TaskModal({ task, onClose, projectId }) {
//   const [comment, setComment] = useState('');
//   const queryClient = useQueryClient();

//   const { data: comments } = useQuery({
//     queryKey: ['comments', task.id],
//     queryFn: () => taskService.getComments(task.id)
//   });

//   const addCommentMutation = useMutation({
//     mutationFn: (content) => taskService.addComment(task.id, content),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['comments', task.id]);
//       setComment('');
//     }
//   });

//   const deleteMutation = useMutation({
//     mutationFn: () => taskService.deleteTask(task.id),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks', projectId]);
//       onClose();
//     }
//   });

//   const handleAddComment = (e) => {
//     e.preventDefault();
//     if (comment.trim()) {
//       addCommentMutation.mutate(comment);
//     }
//   };

//   const PRIORITY_COLORS = {
//     LOW: 'text-gray-600',
//     MEDIUM: 'text-blue-600',
//     HIGH: 'text-orange-600',
//     CRITICAL: 'text-red-600'
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white">
//           <div className="flex-1">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h2>
//             <p className="text-sm text-gray-600">{task.projectName}</p>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <FiX size={24} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Description */}
//           <div>
//             <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
//             <p className="text-gray-600 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
//           </div>

//           {/* Details Grid */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Status</p>
//               <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//                 {task.status.replace('_', ' ')}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Priority</p>
//               <span className={`font-semibold ${PRIORITY_COLORS[task.priority]}`}>
//                 {task.priority}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Assignee</p>
//               <div className="flex items-center gap-2">
//                 {task.assignee ? (
//                   <>
//                     <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
//                       {task.assignee.username.charAt(0).toUpperCase()}
//                     </div>
//                     <span className="text-sm">{task.assignee.username}</span>
//                   </>
//                 ) : (
//                   <span className="text-sm text-gray-500">Unassigned</span>
//                 )}
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Due Date</p>
//               <div className="flex items-center gap-2 text-sm">
//                 <FiClock className="text-gray-400" />
//                 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
//               </div>
//             </div>
//           </div>

//           {/* Comments */}
//           <div>
//             <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <FiMessageSquare /> Comments ({comments?.length || 0})
//             </h3>
            
//             <form onSubmit={handleAddComment} className="mb-4">
//               <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="Add a comment..."
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 rows={3}
//               />
//               <button
//                 type="submit"
//                 disabled={!comment.trim() || addCommentMutation.isLoading}
//                 className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Add Comment
//               </button>
//             </form>

//             <div className="space-y-3">
//               {comments?.map(comment => (
//                 <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
//                       {comment.user.username.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className="font-medium text-sm">{comment.user.username}</span>
//                         <span className="text-xs text-gray-500">
//                           {new Date(comment.createdAt).toLocaleString()}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-700">{comment.content}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Delete Button */}
//           <button
//             onClick={() => {
//               if (window.confirm('Are you sure you want to delete this task?')) {
//                 deleteMutation.mutate();
//               }
//             }}
//             className="flex items-center gap-2 text-red-600 hover:text-red-700"
//           >
//             <FiTrash2 /> Delete Task
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// src/components/task/TaskModal.jsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import { FiX, FiClock, FiUser, FiMessageSquare, FiTrash2 } from 'react-icons/fi';

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do', color: 'bg-gray-100 text-gray-700' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'IN_REVIEW', label: 'In Review', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'DONE', label: 'Done', color: 'bg-green-100 text-green-700' }
];

const PRIORITY_COLORS = {
  LOW: 'text-gray-600',
  MEDIUM: 'text-blue-600',
  HIGH: 'text-orange-600',
  CRITICAL: 'text-red-600'
};

export default function TaskModal({ task, onClose, projectId }) {
  const [comment, setComment] = useState('');
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const queryClient = useQueryClient();

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ['comments', task.id],
    queryFn: () => taskService.getComments(task.id)
  });

  const addCommentMutation = useMutation({
    mutationFn: (content) => taskService.addComment(task.id, content),
    onSuccess: () => {
      refetchComments();
      setComment('');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status) => taskService.updateTaskStatus(task.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', projectId]);
      queryClient.invalidateQueries(['task', task.id]);
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

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    updateStatusMutation.mutate(newStatus);
  };

  const getCurrentStatusOption = () => {
    return STATUS_OPTIONS.find(opt => opt.value === currentStatus) || STATUS_OPTIONS[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white z-10">
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
            <p className="text-gray-600 whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status Dropdown */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg font-medium cursor-pointer border-0 ${getCurrentStatusOption().color} focus:ring-2 focus:ring-primary-500`}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Priority</p>
              <span className={`inline-block px-3 py-2 font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            {/* Assignee */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Assignee</p>
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

            {/* Due Date */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Due Date</p>
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
                {addCommentMutation.isLoading ? 'Adding...' : 'Add Comment'}
              </button>
            </form>

            <div className="space-y-3 max-h-96 overflow-y-auto">
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
          <div className="pt-4 border-t">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  deleteMutation.mutate();
                }
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
            >
              <FiTrash2 /> Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}