import React from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "../../components/custom/AppLayout";

const ProtectedRoute = ({ isAuthenticated, redirectPath = "/login" }) => {
  return isAuthenticated ? (
    <AppLayout />
  ) : (
    <Navigate to={redirectPath} replace />
  );
};

export default ProtectedRoute;
