import React from "react";
import {
  BrowserRouter as Router,
  NavLink,
  Routes,
  Route,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Registro from "./pages/Registro";
import Conocenos from "./pages/Conocenos";
import Oficinas from "./pages/Oficinas";
import InicioDocente from "./pages/docente/InicioDocente";
import OpcionesDocentes from "./pages/docente/OpcionesDocentes";
import CorrimientoHorario from "./pages/docente/CorrimientoHorario";
import DiaEconomico from "./pages/docente/DiaEconomico";
import TiempoPago from "./pages/docente/TiempoPago";
import InicioJefe from "./pages/jefeAcademia/InicioJefe";
import InicioAdministrador from "./pages/administrador/InicioAdmistrador";
import InicioCapital from "./pages/capitalHumano/inicioCapital";
import "./App.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <img src="/img/logo.png" alt="Logo" style={{ height: "40px" }} />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/conocenos">
                Conócenos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/oficinas">
                Oficinas
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <NavLink className="btn btn-outline-dark me-2" to="/registro">
            Registrate
          </NavLink>
          <NavLink className="btn btn-dark" to="/login">
            Iniciar
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        {/* Barra de navegación */}
        <Navbar />

        {/* Configuración de rutas */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/conocenos" element={<Conocenos />} />
          <Route path="/oficinas" element={<Oficinas />} />
          <Route path="/inicio-docente" element={<InicioDocente />} />
          <Route path="/opciones-docentes" element={<OpcionesDocentes />} />
          <Route path="/corrimiento-horario" element={<CorrimientoHorario />} />
          <Route path="/dia-economico" element={<DiaEconomico />} />{" "}
          <Route path="/tiempoPago" element={<TiempoPago />} />{" "}
          <Route path="/inicioJefe" element={<InicioJefe />} />{" "}
          <Route path="/inicioAdmistrador" element={<InicioAdministrador />} />{" "}
          <Route path="/inicioCapital" element={<InicioCapital />} />{" "}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
