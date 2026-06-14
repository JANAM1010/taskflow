import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../../../mock';
import { useProjects } from '../context/ProjectContext';
import { ArrowRight, MoreVertical } from 'lucide-react';

const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const { boards } = useProjects();
  const [showMenu, setShowMenu] = useState(false);

  const board = boards.find(b => b.projectId === project.id);
  const projectTasks = board ? board.columns.flatMap(c => c.taskIds) : [];
  const doneTasks = board ? (board.columns.find(c => c.title === 'Done')?.taskIds.length || 0) : 0;
  const progress = projectTasks.length > 0
    ? Math.round((doneTasks / projectTasks.length) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow group relative">

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: project.color + '20' }}
        >
          {project.icon}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl shadow-lg z-10 w-36 py-1">
              <button
                onClick={() => { navigate(`/board/${project.id}`); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                Open Board
              </button>
              <button
                onClick={() => { onDelete(project.id); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              >
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-bold text-gray-800 dark:text-white mb-1">{project.name}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: project.color }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">{projectTasks.length}</p>
          <p className="text-xs text-gray-400">Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">{doneTasks}</p>
          <p className="text-xs text-gray-400">Done</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800 dark:text-white">{project.members?.length || 0}</p>
          <p className="text-xs text-gray-400">Members</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map(memberId => {
            const member = mockUsers.find(u => u.id === memberId);
            return member ? (
              <div
                key={memberId}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-bold"
                style={{ backgroundColor: member.color }}
                title={member.name}
              >
                {member.avatar}
              </div>
            ) : null;
          })}
        </div>
        <button
          onClick={() => navigate(`/board/${project.id}`)}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all"
        >
          Open <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};

export default ProjectCard;