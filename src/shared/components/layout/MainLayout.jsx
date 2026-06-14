import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CreateProjectModal from '../../../features/projects/components/CreateProjectModal';
import { useProjects } from '../../../features/projects/context/ProjectContext';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { addProject } = useProjects();
  const location = useLocation();
  const isBoardPage = location.pathname.startsWith('/board/');

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onCreateProject={() => setShowCreateModal(true)} />
      <main className={`flex-1 ml-64 min-w-0 overflow-hidden flex flex-col ${isBoardPage ? 'p-4' : 'p-8'}`}>
        {children}
      </main>
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={addProject}
        />
      )}
    </div>
  );
};

export default MainLayout;