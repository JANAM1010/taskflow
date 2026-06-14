import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';

const ProjectContext = createContext(null);

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const ProjectProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'guest';

  const [projects, setProjectsState] = useState(() =>
    loadFromStorage(`taskflow_projects_${userId}`, [])
  );
  const [boards, setBoardsState] = useState(() =>
    loadFromStorage(`taskflow_boards_${userId}`, [])
  );

  // Reload when user changes (e.g. after login/register/logout)
  useEffect(() => {
    setProjectsState(loadFromStorage(`taskflow_projects_${userId}`, []));
    setBoardsState(loadFromStorage(`taskflow_boards_${userId}`, []));
  }, [userId]);

  const setProjects = (updater) => {
    setProjectsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(`taskflow_projects_${userId}`, next);
      return next;
    });
  };

  const setBoards = (updater) => {
    setBoardsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(`taskflow_boards_${userId}`, next);
      return next;
    });
  };

  const addProject = (projectData) => {
    const ts = Date.now();
    const newProject = {
      id: `p${ts}`,
      ...projectData,
      members: [userId],
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    const newBoard = {
      id: `b${ts}`,
      projectId: newProject.id,
      columns: [
        { id: `col-${ts}-1`, title: 'To Do',        color: '#6366f1', taskIds: [] },
        { id: `col-${ts}-2`, title: 'In Progress',  color: '#f59e0b', taskIds: [] },
        { id: `col-${ts}-3`, title: 'Review',        color: '#8b5cf6', taskIds: [] },
        { id: `col-${ts}-4`, title: 'Done',          color: '#10b981', taskIds: [] },
      ]
    };
    setProjects(prev => [...prev, newProject]);
    setBoards(prev => [...prev, newBoard]);
    return newProject;
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setBoards(prev => prev.filter(b => b.projectId !== projectId));
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev =>
      prev.map(p => p.id === projectId ? { ...p, ...updates } : p)
    );
  };

  return (
    <ProjectContext.Provider value={{
      projects, boards, setBoards,
      addProject, deleteProject, updateProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);