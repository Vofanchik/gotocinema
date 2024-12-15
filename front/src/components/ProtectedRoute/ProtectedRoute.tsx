import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const ProtectedRoute: React.FC = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
