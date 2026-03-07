import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return React.createElement(
      'div',
      { className: 'flex justify-center items-center h-screen' },
      React.createElement(
        'p',
        { className: 'text-lg' },
        'Loading...'
      )
    );
  }

  return isAuthenticated ? children : React.createElement(Navigate, {
    to: '/login',
    state: { from: location },
    replace: true
  });
};

export default ProtectedRoute;