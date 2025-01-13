import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SessionContext } from "./SessionContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(SessionContext);

  // Si el usuario no está autenticado, redirigir a la página de inicio
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, renderizar el componente protegido
  return children;
};

export default ProtectedRoute;
