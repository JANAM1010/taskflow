import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { ProjectProvider } from '../features/projects/context/ProjectContext';
import { ThemeProvider } from '../context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import BoardPage from '../features/board/pages/BoardPage';
import ProjectsPage from '../features/projects/pages/ProjectsPage';
import MembersPage from '../features/members/pages/MembersPage';
import SettingsPage from '../features/projects/pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProjectProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/register" element={<RegisterPage/>}/>
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
              <Route path="/projects" element={<ProtectedRoute><ProjectsPage/></ProtectedRoute>}/>
              <Route path="/board/:projectId" element={<ProtectedRoute><BoardPage/></ProtectedRoute>}/>
              <Route path="/members" element={<ProtectedRoute><MembersPage/></ProtectedRoute>}/>
              <Route path="/settings" element={<ProtectedRoute><SettingsPage/></ProtectedRoute>}/>
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppRouter;