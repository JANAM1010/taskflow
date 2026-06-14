import React, { useState } from 'react';
import { useProjects } from '../../projects/context/ProjectContext';
import { useAuth } from '../../auth/context/AuthContext';
import { CheckCircle, Clock, FolderKanban, Mail, Plus, X, Shield, User as UserIcon } from 'lucide-react';

const MemberCard = ({ member }) => {
  const { projects, updateProject } = useProjects();
  const { updateUserRole } = useAuth();
  const [showAssign, setShowAssign] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  const memberProjects = projects.filter(p => p.members?.includes(member.id));
  const availableProjects = projects.filter(p => !p.members?.includes(member.id));

  const handleAssign = () => {
    if (!selectedProject) return;
    const project = projects.find(p => p.id === selectedProject);
    if (!project) return;
    updateProject(project.id, {
      members: [...(project.members || []), member.id]
    });
    setSelectedProject('');
    setShowAssign(false);
  };

  const handleRemove = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    updateProject(project.id, {
      members: (project.members || []).filter(id => id !== member.id)
    });
  };

  const handleToggleRole = () => {
    const newRole = member.role === 'Admin' ? 'Member' : 'Admin';
    updateUserRole(member.id, newRole);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">

      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
          style={{ backgroundColor: member.color }}
        >
          {member.avatar}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">{member.name}</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            member.role === 'Admin'
              ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
          }`}>
            {member.role}
          </span>
        </div>
        <button
          onClick={handleToggleRole}
          title={member.role === 'Admin' ? 'Demote to Member' : 'Promote to Admin'}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          {member.role === 'Admin' ? <UserIcon size={12} /> : <Shield size={12} />}
          {member.role === 'Admin' ? 'Make Member' : 'Make Admin'}
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
        <Mail size={14} />
        <span>{member.email}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
          <div className="flex justify-center mb-1">
            <FolderKanban size={16} className="text-indigo-500" />
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{memberProjects.length}</p>
          <p className="text-xs text-gray-400">Projects</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
          <div className="flex justify-center mb-1">
            <Clock size={16} className="text-yellow-500" />
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">0</p>
          <p className="text-xs text-gray-400">Active</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
          <div className="flex justify-center mb-1">
            <CheckCircle size={16} className="text-green-500" />
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">0</p>
          <p className="text-xs text-gray-400">Done</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Projects
          </p>
          {availableProjects.length > 0 && (
            <button
              onClick={() => setShowAssign(!showAssign)}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Plus size={12} /> Assign
            </button>
          )}
        </div>

        {showAssign && (
          <div className="flex gap-2 mb-3">
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="flex-1 text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select a project...</option>
              {availableProjects.map(p => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              className="bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {memberProjects.length === 0 ? (
            <span className="text-xs text-gray-400">No projects yet</span>
          ) : (
            memberProjects.map(project => (
              <span
                key={project.id}
                className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5"
                style={{
                  backgroundColor: project.color + '20',
                  color: project.color
                }}
              >
                {project.icon} {project.name}
                <button
                  onClick={() => handleRemove(project.id)}
                  className="hover:opacity-60 transition"
                >
                  <X size={11} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default MemberCard;