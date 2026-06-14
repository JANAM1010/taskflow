import React, { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useProjects } from '../../projects/context/ProjectContext';
import {
  X, AlignLeft, MessageSquare, Clock, Trash2
} from 'lucide-react';

const priorityOptions = ['low', 'medium', 'high'];
const priorityConfig = {
  high:   { label: '🔴 High' },
  medium: { label: '🟡 Medium' },
  low:    { label: '🟢 Low' },
};

const statusOptions = ['todo', 'in-progress', 'review', 'done'];
const statusConfig = {
  'todo':        { label: 'To Do' },
  'in-progress': { label: 'In Progress' },
  'review':      { label: 'Review' },
  'done':        { label: 'Done' },
};

const TaskModal = ({ task, onClose, onUpdate, onDelete }) => {
  const { users } = useAuth();
  const { projects } = useProjects();
  const [editedTask, setEditedTask] = useState({ ...task });
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [activity] = useState([
    { id: 'a1', userId: null, action: 'Task created', createdAt: new Date().toISOString() },
  ]);
  const [activeTab, setActiveTab] = useState('comments');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const project = projects.find(p => p.id === task.projectId);

  // Get members of this project
  const projectMembers = users.filter(u =>
    project?.members?.includes(u.id)
  );

  // const assignedUser = users.find(u => u.id === editedTask.assignee);

  const handleUpdate = (field, value) => {
    const updated = { ...editedTask, [field]: value };
    setEditedTask(updated);
    onUpdate && onUpdate(updated);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: `c${Date.now()}`,
      userId: null,
      text: newComment.trim(),
      createdAt: new Date().toISOString()
    }]);
    setNewComment('');
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex-1 mr-4">
            {isEditingTitle ? (
              <input
                autoFocus
                value={editedTask.title}
                onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
                onBlur={() => { setIsEditingTitle(false); handleUpdate('title', editedTask.title); }}
                onKeyDown={e => { if (e.key === 'Enter') { setIsEditingTitle(false); handleUpdate('title', editedTask.title); } }}
                className="text-xl font-bold text-gray-800 dark:text-white w-full border-b-2 border-indigo-400 focus:outline-none pb-1 bg-transparent"
              />
            ) : (
              <h2
                className="text-xl font-bold text-gray-800 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                onClick={() => setIsEditingTitle(true)}
              >
                {editedTask.title}
              </h2>
            )}
            {project && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium mt-2 inline-block"
                style={{ backgroundColor: project.color + '20', color: project.color }}
              >
                {project.icon} {project.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onDelete && onDelete(task.id); onClose(); }}
              className="text-gray-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">

            {/* Left — Main Content */}
            <div className="col-span-2 space-y-6">

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlignLeft size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Description</span>
                </div>
                {isEditingDesc ? (
                  <textarea
                    autoFocus
                    value={editedTask.description || ''}
                    onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
                    onBlur={() => { setIsEditingDesc(false); handleUpdate('description', editedTask.description); }}
                    rows={4}
                    placeholder="Add a description..."
                    className="w-full text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                ) : (
                  <div
                    onClick={() => setIsEditingDesc(true)}
                    className="text-sm text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-600 transition min-h-16"
                  >
                    {editedTask.description || 'Click to add a description...'}
                  </div>
                )}
              </div>

              {/* Comments / Activity */}
              <div>
                <div className="flex gap-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                  {['comments', 'activity'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 text-sm font-medium pb-2 border-b-2 transition capitalize ${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab === 'comments' ? <MessageSquare size={14} /> : <Clock size={14} />}
                      {tab === 'comments' ? `Comments (${comments.length})` : 'Activity'}
                    </button>
                  ))}
                </div>

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        JM
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                          placeholder="Write a comment... (Enter to submit)"
                          rows={2}
                          className="w-full text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        />
                        {newComment && (
                          <button
                            onClick={handleAddComment}
                            className="mt-2 bg-indigo-600 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                          >
                            Post Comment
                          </button>
                        )}
                      </div>
                    </div>
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          JM
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-800 dark:text-white">You</span>
                            <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2.5">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-3">
                    {activity.map(item => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          JM
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.action}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatTime(item.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right — Metadata */}
            <div className="space-y-5">

              {/* Status */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Status</p>
                <select
                  value={editedTask.status || 'todo'}
                  onChange={e => handleUpdate('status', e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{statusConfig[s].label}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Priority</p>
                <select
                  value={editedTask.priority || 'medium'}
                  onChange={e => handleUpdate('priority', e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {priorityOptions.map(p => (
                    <option key={p} value={p}>{priorityConfig[p].label}</option>
                  ))}
                </select>
              </div>

              {/* Assign to Member */}
              {/* Assign to Member */}
<div>
  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
    Assign To
  </p>
  {projectMembers.length === 0 ? (
    <p className="text-xs text-gray-400">No members in this project yet.</p>
  ) : (
    <div className="space-y-2">
      {projectMembers.map(member => {
        const assignees = editedTask.assignees || 
          (editedTask.assignee ? [editedTask.assignee] : []);
        const isAssigned = assignees.includes(member.id);

        const toggleAssignee = () => {
          const current = editedTask.assignees ||
            (editedTask.assignee ? [editedTask.assignee] : []);
          const updated = isAssigned
            ? current.filter(id => id !== member.id)
            : [...current, member.id];
          handleUpdate('assignees', updated);
        };

        return (
          <button
            key={member.id}
            onClick={toggleAssignee}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border-2 transition ${
              isAssigned
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: member.color }}
            >
              {member.avatar}
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{member.name}</p>
              <p className="text-xs text-gray-400">{member.role}</p>
            </div>
            {isAssigned && (
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                ✓
              </span>
            )}
          </button>
        );
      })}

      {/* Show assigned avatars */}
      {(() => {
        const assignees = editedTask.assignees ||
          (editedTask.assignee ? [editedTask.assignee] : []);
        const assignedMembers = users.filter(u => assignees.includes(u.id));
        return assignedMembers.length > 0 ? (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-xs text-gray-400">Assigned:</span>
            {assignedMembers.map(m => (
              <div
                key={m.id}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: m.color }}
                title={m.name}
              >
                {m.avatar}
              </div>
            ))}
          </div>
        ) : null;
      })()}
    </div>
  )}
</div>
              {/* Due Date */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Due Date</p>
                <input
                  type="date"
                  value={editedTask.dueDate || ''}
                  onChange={e => handleUpdate('dueDate', e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Delete */}
              <button
                onClick={() => { onDelete && onDelete(task.id); onClose(); }}
                className="w-full flex items-center justify-center gap-2 text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                <Trash2 size={14} />
                Delete Task
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;