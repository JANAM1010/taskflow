import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../projects/context/ProjectContext';
import { BoardProvider, useBoard } from '../context/BoardContext';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../../tasks/components/TaskModal';
import MainLayout from '../../../shared/components/layout/MainLayout';
import { ArrowLeft, Users, Settings } from 'lucide-react';

const BoardContent = ({ project }) => {
  const navigate = useNavigate();
  const { getTaskById, deleteTask, getBoardByProject ,updateTask } = useBoard();
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => setSelectedTask(task);
  const handleCloseModal = () => setSelectedTask(null);

  const handleDeleteTask = (taskId) => {
    const board = getBoardByProject(project.id);
    if (!board) return;
    const column = board.columns.find(col => col.taskIds.includes(taskId));
    if (column) deleteTask(project.id, column.id, taskId);
    setSelectedTask(null);
  };

  return(
  <MainLayout>
    <div className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: project.color + '20' }}
          >
            {project.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{project.name}</h1>
            <p className="text-gray-400 text-sm">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/members')}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Users size={16} /> Members
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Settings size={16} /> Settings
          </button>
        </div>
      </div>

      {/* Kanban Board */}
        <div className="overflow-x-auto -mx-4 px-4 flex-1">
          <KanbanBoard
            projectId={project.id}
            onTaskClick={handleTaskClick}/>
        </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onUpdate={(updatedTask) => {
            setSelectedTask(updatedTask);
            updateTask(updatedTask.id, updatedTask);
          }}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
    </MainLayout>
  );
};

const BoardPage = () => {
  const { projectId } = useParams();
  const { projects } = useProjects();
  const project = projects.find(p => p.id === projectId);

  if (!project) return (
    <MainLayout>
      <div className="flex items-center justify-center h-64 text-gray-400">
        Project not found.
      </div>
    </MainLayout>
  );

  return (
    <BoardProvider>
      <BoardContent project={project} />
    </BoardProvider>
  );
};

export default BoardPage;