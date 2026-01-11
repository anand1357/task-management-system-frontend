// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { projectService } from '../services/projectService';
// import { taskService } from '../services/taskService';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { FiPlus, FiMoreVertical } from 'react-icons/fi';
// import TaskModal from '../components/task/TaskModal';
// import CreateTaskModal from '../components/task/CreateTaskModal';

// const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

// const STATUS_LABELS = {
//   TODO: 'To Do',
//   IN_PROGRESS: 'In Progress',
//   IN_REVIEW: 'In Review',
//   DONE: 'Done'
// };

// const STATUS_COLORS = {
//   TODO: 'bg-gray-200',
//   IN_PROGRESS: 'bg-blue-200',
//   IN_REVIEW: 'bg-yellow-200',
//   DONE: 'bg-green-200'
// };

// const PRIORITY_COLORS = {
//   LOW: 'text-gray-500',
//   MEDIUM: 'text-blue-500',
//   HIGH: 'text-orange-500',
//   CRITICAL: 'text-red-500'
// };

// export default function ProjectDetails() {
//   const { id } = useParams();
//   const queryClient = useQueryClient();
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showCreateTask, setShowCreateTask] = useState(false);
//   const [tasks, setTasks] = useState([]);

//   const { data: project } = useQuery({
//     queryKey: ['project', id],
//     queryFn: () => projectService.getProjectById(id)
//   });

//   const { data: tasksData } = useQuery({
//     queryKey: ['tasks', id],
//     queryFn: () => taskService.getTasksByProject(id)
//   });

//   useEffect(() => {
//     if (tasksData) {
//       setTasks(tasksData);
//     }
//   }, [tasksData]);

//   const updateStatusMutation = useMutation({
//     mutationFn: ({ taskId, status }) => taskService.updateTaskStatus(taskId, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks', id]);
//     }
//   });

//   const onDragEnd = (result) => {
//     const { source, destination, draggableId } = result;

//     if (!destination) return;
//     if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//     const newStatus = destination.droppableId;
//     updateStatusMutation.mutate({ taskId: draggableId, status: newStatus });

//     // Optimistic update
//     setTasks(prevTasks => {
//       const updatedTasks = prevTasks.map(task =>
//         task.id === parseInt(draggableId) ? { ...task, status: newStatus } : task
//       );
//       return updatedTasks;
//     });
//   };

//   const getTasksByStatus = (status) => {
//     return tasks.filter(task => task.status === status);
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">{project?.name}</h1>
//             <p className="text-gray-600 mt-1">{project?.description}</p>
//           </div>
//           <button
//             onClick={() => setShowCreateTask(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
//           >
//             <FiPlus /> Create Task
//           </button>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div className="flex-1 overflow-x-auto">
//         <DragDropContext onDragEnd={onDragEnd}>
//           <div className="flex gap-4 h-full pb-4" style={{ minWidth: 'max-content' }}>
//             {STATUSES.map(status => (
//               <div key={status} className="flex-shrink-0 w-80">
//                 <div className={`${STATUS_COLORS[status]} rounded-t-lg p-3`}>
//                   <div className="flex items-center justify-between">
//                     <h3 className="font-semibold text-gray-700">
//                       {STATUS_LABELS[status]} ({getTasksByStatus(status).length})
//                     </h3>
//                   </div>
//                 </div>

//                 <Droppable droppableId={status}>
//                   {(provided, snapshot) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       className={`bg-gray-100 rounded-b-lg p-3 min-h-[500px] ${
//                         snapshot.isDraggingOver ? 'bg-blue-50' : ''
//                       }`}
//                     >
//                       {getTasksByStatus(status).map((task, index) => (
//                         <Draggable
//                           key={task.id}
//                           draggableId={task.id.toString()}
//                           index={index}
//                         >
//                           {(provided, snapshot) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               onClick={() => setSelectedTask(task)}
//                               className={`bg-white rounded-lg p-4 mb-3 shadow cursor-pointer hover:shadow-md transition ${
//                                 snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
//                               }`}
//                             >
//                               <div className="flex items-start justify-between mb-2">
//                                 <h4 className="font-medium text-gray-800 flex-1">{task.title}</h4>
//                                 <button className="text-gray-400 hover:text-gray-600">
//                                   <FiMoreVertical size={16} />
//                                 </button>
//                               </div>

//                               {task.description && (
//                                 <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                                   {task.description}
//                                 </p>
//                               )}

//                               <div className="flex items-center justify-between text-xs">
//                                 <span className={`font-medium ${PRIORITY_COLORS[task.priority]}`}>
//                                   {task.priority}
//                                 </span>
//                                 {task.assignee && (
//                                   <div className="flex items-center gap-1">
//                                     <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-medium">
//                                       {task.assignee.username.charAt(0).toUpperCase()}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>

//                               {task.dueDate && (
//                                 <div className="mt-2 text-xs text-gray-500">
//                                   Due: {new Date(task.dueDate).toLocaleDateString()}
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </div>
//                   )}
//                 </Droppable>
//               </div>
//             ))}
//           </div>
//         </DragDropContext>
//       </div>

//       {/* Modals */}
//       {selectedTask && (
//         <TaskModal
//           task={selectedTask}
//           onClose={() => setSelectedTask(null)}
//           projectId={id}
//         />
//       )}

//       {showCreateTask && (
//         <CreateTaskModal
//           projectId={id}
//           onClose={() => setShowCreateTask(false)}
//         />
//       )}
//     </div>
//   );
// }




// // src/pages/ProjectDetails.jsx
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { projectService } from '../services/projectService';
// import { taskService } from '../services/taskService';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { FiPlus, FiMoreVertical } from 'react-icons/fi';
// import TaskModal from '../components/task/TaskModal';
// import CreateTaskModal from '../components/task/CreateTaskModal';

// const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

// const STATUS_LABELS = {
//   TODO: 'To Do',
//   IN_PROGRESS: 'In Progress',
//   IN_REVIEW: 'In Review',
//   DONE: 'Done'
// };

// const STATUS_COLORS = {
//   TODO: 'bg-gray-200',
//   IN_PROGRESS: 'bg-blue-200',
//   IN_REVIEW: 'bg-yellow-200',
//   DONE: 'bg-green-200'
// };

// const PRIORITY_COLORS = {
//   LOW: 'text-gray-500',
//   MEDIUM: 'text-blue-500',
//   HIGH: 'text-orange-500',
//   CRITICAL: 'text-red-500'
// };

// export default function ProjectDetails() {
//   const { id } = useParams();
//   const queryClient = useQueryClient();
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showCreateTask, setShowCreateTask] = useState(false);
//   const [tasks, setTasks] = useState([]);

//   const { data: project } = useQuery({
//     queryKey: ['project', id],
//     queryFn: () => projectService.getProjectById(id)
//   });

//   const { data: tasksData, refetch: refetchTasks } = useQuery({
//     queryKey: ['tasks', id],
//     queryFn: () => taskService.getTasksByProject(id)
//   });

//   useEffect(() => {
//     if (tasksData) {
//       setTasks(tasksData);
//     }
//   }, [tasksData]);

//   const updateStatusMutation = useMutation({
//     mutationFn: ({ taskId, status }) => taskService.updateTaskStatus(taskId, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks', id]);
//       refetchTasks();
//     }
//   });

//   const onDragEnd = (result) => {
//     const { source, destination, draggableId } = result;

//     // Dropped outside the list
//     if (!destination) return;

//     // Dropped in the same position
//     if (source.droppableId === destination.droppableId && source.index === destination.index) {
//       return;
//     }

//     const newStatus = destination.droppableId;
//     const taskId = parseInt(draggableId);

//     // Optimistic update
//     setTasks(prevTasks => {
//       return prevTasks.map(task =>
//         task.id === taskId ? { ...task, status: newStatus } : task
//       );
//     });

//     // Update on server
//     updateStatusMutation.mutate({ taskId, status: newStatus });
//   };

//   const getTasksByStatus = (status) => {
//     return tasks.filter(task => task.status === status);
//   };

//   const handleTaskClick = (task) => {
//     setSelectedTask(task);
//   };

//   const handleCloseModal = () => {
//     setSelectedTask(null);
//     refetchTasks();
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">{project?.name}</h1>
//             <p className="text-gray-600 mt-1">{project?.description}</p>
//           </div>
//           <button
//             onClick={() => setShowCreateTask(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
//           >
//             <FiPlus /> Create Task
//           </button>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div className="flex-1 overflow-x-auto">
//         <DragDropContext onDragEnd={onDragEnd}>
//           <div className="flex gap-4 h-full pb-4" style={{ minWidth: 'max-content' }}>
//             {STATUSES.map(status => {
//               const statusTasks = getTasksByStatus(status);
              
//               return (
//                 <div key={status} className="flex-shrink-0 w-80">
//                   <div className={`${STATUS_COLORS[status]} rounded-t-lg p-3`}>
//                     <div className="flex items-center justify-between">
//                       <h3 className="font-semibold text-gray-700">
//                         {STATUS_LABELS[status]} ({statusTasks.length})
//                       </h3>
//                     </div>
//                   </div>

//                   <Droppable droppableId={status}>
//                     {(provided, snapshot) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         className={`bg-gray-100 rounded-b-lg p-3 transition-colors ${
//                           snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-300' : ''
//                         }`}
//                         style={{ minHeight: '500px' }}
//                       >
//                         {statusTasks.map((task, index) => (
//                           <Draggable
//                             key={task.id}
//                             draggableId={task.id.toString()}
//                             index={index}
//                           >
//                             {(provided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 onClick={() => handleTaskClick(task)}
//                                 className={`bg-white rounded-lg p-4 mb-3 shadow cursor-pointer hover:shadow-md transition ${
//                                   snapshot.isDragging ? 'rotate-2 shadow-2xl ring-2 ring-primary-400' : ''
//                                 }`}
//                               >
//                                 <div className="flex items-start justify-between mb-2">
//                                   <h4 className="font-medium text-gray-800 flex-1">{task.title}</h4>
//                                   <button 
//                                     className="text-gray-400 hover:text-gray-600"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleTaskClick(task);
//                                     }}
//                                   >
//                                     <FiMoreVertical size={16} />
//                                   </button>
//                                 </div>

//                                 {task.description && (
//                                   <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                                     {task.description}
//                                   </p>
//                                 )}

//                                 <div className="flex items-center justify-between text-xs">
//                                   <span className={`font-medium ${PRIORITY_COLORS[task.priority]}`}>
//                                     {task.priority}
//                                   </span>
//                                   {task.assignee && (
//                                     <div className="flex items-center gap-1">
//                                       <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-medium">
//                                         {task.assignee.username.charAt(0).toUpperCase()}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>

//                                 {task.dueDate && (
//                                   <div className="mt-2 text-xs text-gray-500">
//                                     Due: {new Date(task.dueDate).toLocaleDateString()}
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </div>
//               );
//             })}
//           </div>
//         </DragDropContext>
//       </div>

//       {/* Modals */}
//       {selectedTask && (
//         <TaskModal
//           task={selectedTask}
//           onClose={handleCloseModal}
//           projectId={id}
//         />
//       )}

//       {showCreateTask && (
//         <CreateTaskModal
//           projectId={id}
//           onClose={() => {
//             setShowCreateTask(false);
//             refetchTasks();
//           }}
//         />
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiPlus, FiMoreVertical } from 'react-icons/fi';
import TaskModal from '../components/task/TaskModal';
import CreateTaskModal from '../components/task/CreateTaskModal';

const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done'
};

const STATUS_COLORS = {
  TODO: 'bg-gray-200',
  IN_PROGRESS: 'bg-blue-200',
  IN_REVIEW: 'bg-yellow-200',
  DONE: 'bg-green-200'
};

const PRIORITY_COLORS = {
  LOW: 'text-gray-500',
  MEDIUM: 'text-blue-500',
  HIGH: 'text-orange-500',
  CRITICAL: 'text-red-500'
};

export default function ProjectDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id)
  });

  const { data: tasksData, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskService.getTasksByProject(id)
  });

  // Fix for React 18 StrictMode
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }) => taskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', id]);
    },
    onError: () => {
      // Revert optimistic update on error
      refetchTasks();
    }
  });

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newStatus = destination.droppableId;
    const taskId = parseInt(draggableId);

    // Find the task being moved
    const taskToMove = tasks.find(t => t.id === taskId);
    if (!taskToMove) return;

    // Create new tasks array with reordered items
    const newTasks = Array.from(tasks);
    const sourceItems = newTasks.filter(t => t.status === source.droppableId);
    const destItems = newTasks.filter(t => t.status === destination.droppableId);
    
    // Remove from source
    const [removed] = sourceItems.splice(source.index, 1);
    
    // Update status
    removed.status = newStatus;
    
    // Add to destination
    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setTasks([
        ...newTasks.filter(t => t.status !== source.droppableId),
        ...sourceItems
      ]);
    } else {
      destItems.splice(destination.index, 0, removed);
      setTasks([
        ...newTasks.filter(t => t.status !== source.droppableId && t.status !== destination.droppableId),
        ...sourceItems,
        ...destItems
      ]);
    }

    // Update on server
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    refetchTasks();
  };

  // Don't render drag and drop until client-side
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{project?.name}</h1>
            <p className="text-gray-600 mt-1">{project?.description}</p>
          </div>
          <button
            onClick={() => setShowCreateTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <FiPlus /> Create Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full pb-4" style={{ minWidth: 'max-content' }}>
            {STATUSES.map(status => {
              const statusTasks = getTasksByStatus(status);
              
              return (
                <div key={status} className="flex-shrink-0 w-80">
                  <div className={`${STATUS_COLORS[status]} rounded-t-lg p-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-700">
                        {STATUS_LABELS[status]} ({statusTasks.length})
                      </h3>
                    </div>
                  </div>

                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-gray-100 rounded-b-lg p-3 transition-colors ${
                          snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-300' : ''
                        }`}
                        style={{ minHeight: '500px' }}
                      >
                        {statusTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => handleTaskClick(task)}
                                className={`bg-white rounded-lg p-4 mb-3 shadow cursor-pointer hover:shadow-md transition ${
                                  snapshot.isDragging ? 'rotate-2 shadow-2xl ring-2 ring-primary-400' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-gray-800 flex-1">{task.title}</h4>
                                  <button 
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTaskClick(task);
                                    }}
                                  >
                                    <FiMoreVertical size={16} />
                                  </button>
                                </div>

                                {task.description && (
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}

                                <div className="flex items-center justify-between text-xs">
                                  <span className={`font-medium ${PRIORITY_COLORS[task.priority]}`}>
                                    {task.priority}
                                  </span>
                                  {task.assignee && (
                                    <div className="flex items-center gap-1">
                                      <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-medium">
                                        {task.assignee.username.charAt(0).toUpperCase()}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {task.dueDate && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          projectId={id}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          projectId={id}
          onClose={() => {
            setShowCreateTask(false);
            refetchTasks();
          }}
        />
      )}
    </div>
  );
}