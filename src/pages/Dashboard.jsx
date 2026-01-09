import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { FiFolder, FiCheckSquare, FiClock, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAllProjects
  });

  const { data: myTasks } = useQuery({
    queryKey: ['myTasks'],
    queryFn: taskService.getMyTasks
  });

  const stats = [
    { label: 'Total Projects', value: projects?.length || 0, icon: FiFolder, color: 'bg-blue-500' },
    { label: 'My Tasks', value: myTasks?.length || 0, icon: FiCheckSquare, color: 'bg-green-500' },
    { label: 'In Progress', value: myTasks?.filter(t => t.status === 'IN_PROGRESS').length || 0, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Completed', value: myTasks?.filter(t => t.status === 'DONE').length || 0, icon: FiTrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.slice(0, 6).map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{project.taskCount || 0} tasks</span>
                <span>{project.members?.length || 0} members</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Recent Tasks</h2>
        <div className="space-y-3">
          {myTasks?.slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.projectName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'DONE' ? 'bg-green-100 text-green-700' :
                task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}