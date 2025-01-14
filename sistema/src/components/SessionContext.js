import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Crear el contexto
export const SessionContext = createContext();

// Proveedor del contexto
export const SessionProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userCurp, setUserCurp] = useState("");  // <--- Nuevo estado
  const [userId, setUserId] = useState("");

  // Verificar la sesión al cargar la aplicación
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost/web-backend/api/session/logged.php",
          { withCredentials: true }
        );

        const data = response.data;

        if (data.status === "success") {
          setIsLoggedIn(true);
          setUserName(data.user.nombre);
          setUserCurp(data.user.id);

        } else {
          setIsLoggedIn(false);
          setUserName("");
          setUserCurp("");  // Limpiamos
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setIsLoggedIn(false);
        setUserName("");
        setUserCurp("");
      }
    };

    checkSession();
  }, []);

  // Ajustamos la función de login para que reciba y asigne la CURP
  // OJO: depende de si tu backend te la manda o la tienes en la vista de Login.
  const login = (nombre, curp = "", userId = "") => {
    setIsLoggedIn(true);
    setUserName(nombre);
    setUserCurp(curp);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost/web-backend/api/session/logout.php", 
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    setIsLoggedIn(false);
    setUserName("");
    setUserCurp("");
    setUserId("");
  };

  return (
    <SessionContext.Provider
      value={{
        isLoggedIn,
        userName,
        userCurp,      // <--- Lo exponemos en el value
        login,
        logout
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
