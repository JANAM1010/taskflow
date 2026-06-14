import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useProjects } from '../../projects/context/ProjectContext';

const BoardContext = createContext(null);

const loadTasks = (userId) => {
  try {
    const saved = localStorage.getItem(`taskflow_tasks_${userId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveTasks = (userId, tasks) => {
  localStorage.setItem(`taskflow_tasks_${userId}`, JSON.stringify(tasks));
};

export const BoardProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || 'guest';
  const { boards, setBoards } = useProjects();
  const [tasks, setTasksState] = useState(() => loadTasks(userId));

  useEffect(() => {
    setTasksState(loadTasks(userId));
  }, [userId]);

  const setTasks = (updater) => {
    setTasksState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveTasks(userId, next);
      return next;
    });
  };

  const getBoardByProject = (projectId) => {
    return boards.find(b => b.projectId === projectId);
  };

  const getTaskById = (taskId) => {
    return tasks.find(t => t.id === taskId);
  };

  const addTask = (projectId, columnId, taskData) => {
    const newTask = {
      id: `t${Date.now()}`,
      projectId,
      ...taskData,
      status: 'todo',
    };
    setTasks(prev => [...prev, newTask]);
    setBoards(prev => prev.map(board => {
      if (board.projectId !== projectId) return board;
      return {
        ...board,
        columns: board.columns.map(col => {
          if (col.id !== columnId) return col;
          return { ...col, taskIds: [...col.taskIds, newTask.id] };
        })
      };
    }));
    return newTask;
  };

  const moveTask = (projectId, taskId, fromColumnId, toColumnId) => {
    if (fromColumnId === toColumnId) return;
    setBoards(prev => prev.map(board => {
      if (board.projectId !== projectId) return board;
      return {
        ...board,
        columns: board.columns.map(col => {
          if (col.id === fromColumnId) {
            return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
          }
          if (col.id === toColumnId) {
            return { ...col, taskIds: [...col.taskIds, taskId] };
          }
          return col;
        })
      };
    }));
  };

  const deleteTask = (projectId, columnId, taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setBoards(prev => prev.map(board => {
      if (board.projectId !== projectId) return board;
      return {
        ...board,
        columns: board.columns.map(col => {
          if (col.id !== columnId) return col;
          return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
        })
      };
    }));
  };

  const updateTask = (taskId, updates) => {
  setTasks(prev => {
    const updated = prev.map(t =>
      t.id === taskId ? { ...t, ...updates } : t
    );
    saveTasks(userId, updated);
    return updated;
  });
  };

  return (
    <BoardContext.Provider value={{
      boards, tasks, getBoardByProject,
      getTaskById, addTask, moveTask, deleteTask ,updateTask
    }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);