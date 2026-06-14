import React, { createContext, useState, useContext } from 'react';
import { mockUsers as defaultUsers } from '../../../mock';

const AuthContext = createContext(null);

const loadUsers = () => {
  try {
    const saved = localStorage.getItem('taskflow_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  } catch {
    return defaultUsers;
  }
};

const saveUsers = (users) => {
  localStorage.setItem('taskflow_users', JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(loadUsers);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const user = users.find(
      u => u.email === email && u.password === password
    );
    if (user) {
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      localStorage.setItem('taskflow_user', JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password) => {
    const exists = users.find(u => u.email === email);
    if (exists) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      role: 'Member',
      color: '#6366f1'
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    localStorage.setItem('taskflow_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const addMember = (memberData) => {
    const newUser = {
      id: `u${Date.now()}`,
      name: memberData.name,
      email: memberData.email,
      password: 'changeme123',
      avatar: memberData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      role: memberData.role || 'Member',
      color: memberData.color || '#6366f1'
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    return newUser;
  };

  const updateUserRole = (userId, newRole) => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    if (currentUser?.id === userId) {
      const updatedCurrentUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedCurrentUser);
      localStorage.setItem('taskflow_user', JSON.stringify(updatedCurrentUser));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('taskflow_user');
  };

  return (
    <AuthContext.Provider value={{
      currentUser, login, register, logout,
      users, addMember, updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);