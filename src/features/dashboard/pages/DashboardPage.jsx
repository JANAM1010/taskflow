import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { useProjects } from '../../projects/context/ProjectContext';
import { FolderKanban, CheckCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import MainLayout from '../../../shared/components/layout/MainLayout';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { projects, boards } = useProjects();
  const navigate = useNavigate();

  // Build tasks list from boards with actual task data from localStorage
  const userId = currentUser?.id || 'guest';
  const savedTasks = (() => {
    try {
      const saved = localStorage.getItem(`taskflow_tasks_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  })();

  // Map all task IDs from boards to their actual task objects
  const allTasks = boards.flatMap(board =>
    board.columns.flatMap(col =>
      col.taskIds.map(taskId => {
        const task = savedTasks.find(t => t.id === taskId);
        return {
          id: taskId,
          title: task?.title || taskId,
          projectId: board.projectId,
          priority: task?.priority || 'medium',
          status: col.title === 'Done' ? 'done'
                : col.title === 'In Progress' ? 'in-progress'
                : col.title === 'Review' ? 'review'
                : 'todo'
        };
      })
    )
  );

  const totalProjects = projects.length;
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length;

  const stats = [
    { label: 'Total Projects',  value: totalProjects,   icon: FolderKanban, color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' },
    { label: 'Total Tasks',     value: totalTasks,      icon: Clock,        color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' },
    { label: 'In Progress',     value: inProgressTasks, icon: TrendingUp,   color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400' },
    { label: 'Completed',       value: doneTasks,       icon: CheckCircle,  color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' },
  ];

  const recentProjects = projects.slice(-4).reverse();
  const recentTasks = allTasks.slice(0, 5);

  const statusColor = {
    'todo':        'bg-white dark:bg-gray-700 text-gray-100 dark:text-gray-300',
    'in-progress': 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    'review':      'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    'done':        'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          👋 Welcome back, {currentUser?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</span>
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">No projects yet</h3>
          <p className="text-gray-400 text-sm mb-4">Create your first project to get started</p>
          <button
            onClick={() => navigate('/projects')}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            + Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Projects */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Projects</h2>
              <button
                onClick={() => navigate('/projects')}
                className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {recentProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/board/${project.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: project.color + '20' }}
                  >
                    {project.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{project.name}</p>
                    <p className="text-xs text-gray-400 truncate">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Tasks</h2>
              <span className="text-gray-400 text-sm">{doneTasks}/{totalTasks} done</span>
            </div>

            {allTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-gray-400 text-sm">No tasks yet. Add tasks to your projects!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task, index) => {
                  const project = projects.find(p => p.id === task.projectId);
                  return (
                    <div
                      key={`${task.id}-${index}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project?.color || '#6366f1' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-400">{project?.name}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[task.status]}`}>
                        {task.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </MainLayout>
  );
};

export default DashboardPage;