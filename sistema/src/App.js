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
                src="/img/logo.png"
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
                    Ubica tu clínica
                  </NavLink>
                </li>
              </ul>
            </div>
            <div>
              <NavLink
                className="btn btn-outline-secondary me-2"
                to="/registrate"
              >
                Regístrate
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
          {/* Aquí puedes agregar otras rutas si las necesitas */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
