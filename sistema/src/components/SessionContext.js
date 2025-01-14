import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Crear el contexto
export const SessionContext = createContext();

// Proveedor del contexto
export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Verificar la sesión al cargar la aplicación
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost/web-backend/api/session/logged.php",
          { withCredentials: true } // Asegura que las cookies de sesión se envíen
        );

        const data = response.data;

        if (data.status === "success") {
          setIsLoggedIn(true);
          setUserName(data.user.nombre);
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    checkSession();
  }, []);

  const login = (nombre) => {
    setIsLoggedIn(true);
    setUserName(nombre);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost/web-backend/api/session/logout.php", // Asegúrate de que esta URL sea correcta
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <SessionContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
