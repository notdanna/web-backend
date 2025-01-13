import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { SessionContext } from "./SessionContext";

const Navbar = () => {
  const { isLoggedIn, userName, logout } = useContext(SessionContext);

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
          {!isLoggedIn ? (
            <>
              <NavLink className="btn btn-outline-dark me-2" to="/registro">
                Registrate
              </NavLink>
              <NavLink className="btn btn-dark" to="/login">
                Iniciar
              </NavLink>
            </>
          ) : (
            <>
              <span className="me-3">Bienvenido, {userName}</span>
              <button className="btn btn-outline-dark" onClick={logout}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
