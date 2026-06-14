import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus, X, MoreHorizontal } from 'lucide-react';

const Column = ({ column, tasks, projectId, onAddTask, onDeleteTask, onTaskClick }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    onAddTask(column.id, {
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      assignee: 'u1',
      dueDate: '',
    });
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col flex-1 min-w-64">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{column.title}</h3>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 p-2 rounded-xl transition-colors ${
        isOver ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-dashed border-indigo-300' : 'bg-white dark:bg-gray-800'
        }`}
        style={{ minHeight: 'calc(100vh - 220px)' }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              projectId={projectId}
              onDelete={(taskId, colId) => onDeleteTask(taskId, colId)}
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>

        {showAddForm ? (
          <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm border border-indigo-200 dark:border-indigo-500">
            <input
              autoFocus
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') setShowAddForm(false); }}
              placeholder="Task title..."
              className="w-full text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
            />
            <select
              value={newTaskPriority}
              onChange={e => setNewTaskPriority(e.target.value)}
              className="w-full text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-2 py-1.5 focus:outline-none mb-2"
            >
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="flex-1 bg-indigo-600 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-indigo-700 transition"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm py-2 px-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition w-full"
          >
            <Plus size={16} />
            Add task
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;