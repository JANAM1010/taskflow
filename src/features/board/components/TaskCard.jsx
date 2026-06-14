import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { mockUsers } from '../../../mock';
import { Trash2, Calendar, GripVertical } from 'lucide-react';

const priorityConfig = {
  high:   { color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',    dot: 'bg-red-500' },
  medium: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
  low:    { color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',  dot: 'bg-green-500' },
};

const TaskCard = ({ task, columnId, projectId, onDelete, onClick }) => {
  const [showDelete, setShowDelete] = useState(false);

  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priority = priorityConfig[task.priority] || priorityConfig.low;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-600 cursor-pointer hover:shadow-md transition-shadow group"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onClick={() => onClick && onClick(task)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          {...attributes}
          {...listeners}
          className="text-gray-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 mt-0.5 cursor-grab active:cursor-grabbing"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical size={16} />
        </div>

        <p className="flex-1 text-sm font-medium text-gray-800 dark:text-white leading-snug">
          {task.title}
        </p>

        {showDelete && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(task.id, columnId); }}
            className="text-gray-300 hover:text-red-500 transition flex-shrink-0"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${priority.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between">
        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 dark:bg-gray-600 px-2 py-0.5 rounded-lg">
          <Calendar size={11} />
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
        {!task.dueDate && (
          <span className="text-xs text-gray-300 dark:text-gray-600">No due date</span>
        )}
        {(() => {
          const assigneeIds = task.assignees ||
            (task.assignee ? [task.assignee] : []);
            const assignedMembers = mockUsers.filter(u => assigneeIds.includes(u.id));
              return assignedMembers.length > 0 ? (
                <div className="flex -space-x-2 ml-auto">
                  {assignedMembers.slice(0, 3).map(m => (
                    <div key={m.id}
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: m.color }}
                      title={m.name}>
                      {m.avatar}
                    </div>
                  ))}
                  {assignedMembers.length > 3 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-700 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                    +{assignedMembers.length - 3}
                    </div>
                  )}
                </div>
              ) : null;
        })()}
      </div>
    </div>
  );
};

export default TaskCard;