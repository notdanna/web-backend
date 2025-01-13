import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionProvider } from "../src/components/SessionContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../src/components/NavBar";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Registro from "./pages/Registro";
import Conocenos from "./pages/Conocenos";
import Oficinas from "./pages/Oficinas";
import InicioDocente from "./pages/docente/InicioDocente";
import OpcionesDocentes from "./pages/docente/OpcionesDocentes";
import CorrimientoHorario from "./pages/docente/CorrimientoHorario";
import DiaEconomico from "./pages/docente/DiaEconomico";
import InicioJefe from "./pages/jefeAcademia/InicioJefe";
import InicioAdministrador from "./pages/administrador/InicioAdmistrador";
import InicioCapital from "./pages/capitalHumano/inicioCapital";
import TiempoPago from "./pages/docente/TiempoPago";
import ProtectedRoute from "./components/RutasProtegidas"; // Importa rutas protegidas
import "./App.css";

const App = () => {
  return (
    <SessionProvider>
      <Router>
        <div>
          {/* Barra de navegación */}
          <Navbar />

          {/* Configuración de rutas */}
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/conocenos" element={<Conocenos />} />
            <Route path="/oficinas" element={<Oficinas />} />

            {/* Rutas protegidas */}
            <Route
              path="/inicio-docente"
              element={
                <ProtectedRoute>
                  <InicioDocente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/opciones-docentes"
              element={
                <ProtectedRoute>
                  <OpcionesDocentes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/corrimiento-horario"
              element={
                <ProtectedRoute>
                  <CorrimientoHorario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dia-economico"
              element={
                <ProtectedRoute>
                  <DiaEconomico />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tiempoPago"
              element={
                <ProtectedRoute>
                  <TiempoPago />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inicioJefe"
              element={
                <ProtectedRoute>
                  <InicioJefe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inicioAdmistrador"
              element={
                <ProtectedRoute>
                  <InicioAdministrador />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inicioCapital"
              element={
                <ProtectedRoute>
                  <InicioCapital />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </SessionProvider>
  );
};

export default App;
