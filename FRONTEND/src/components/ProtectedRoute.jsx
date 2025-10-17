import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken, getUserRole, isTokenExpired } from '../auth';

const ProtectedRoute = ({ roles = [], children }) => {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const role = getUserRole();
    if (!role || !roles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
