import React from "react";
import {
  BrowserRouter as Router,
  NavLink,
  Routes,
  Route,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login"; // Asegúrate de que esta ruta sea correcta
import Inicio from "./pages/Inicio"; // Asegúrate de que esta ruta sea correcta
import Registro from "./pages/Registro"; // Asegúrate de que esta ruta sea correcta
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        {/* Barra de navegación */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              <img
                src="/img/logo.png" // Asegúrate de que esta imagen esté en "public/img"
                alt="Salud Digna Logo"
                style={{ height: "40px" }}
              />
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
                  <NavLink className="nav-link" to="/ubica">
                    Oficinas
                  </NavLink>
                </li>
              </ul>
            </div>
            <div>
              <NavLink
                className="btn btn-outline-secondary me-2"
                to="/registro"
              >
                Registrate
              </NavLink>
              <NavLink className="btn btn-secondary" to="/login">
                Iniciar
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Configuración de rutas */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
