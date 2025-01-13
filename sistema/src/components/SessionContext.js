import React, { createContext, useState, useEffect } from "react";

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
        const response = await fetch(
          "http://localhost/web-backend/api/session/logged.php"
        );
        const data = await response.json();

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
      await fetch("http://localhost/web-backend/api/session/logged.php", {
        method: "POST",
        credentials: "include",
      });
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
