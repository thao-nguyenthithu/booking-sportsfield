import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role && user.role !== `ROLE_${role}`) {
    // Redirect to correct home based on role
    if (user.role === 'PLAYER' || user.role === 'ROLE_PLAYER') return <Navigate to="/player/home" replace />;
    if (user.role === 'OWNER' || user.role === 'ROLE_OWNER') return <Navigate to="/owner/dashboard" replace />;
    if (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 