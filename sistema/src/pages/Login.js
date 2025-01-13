import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/login.css";
import Swal from "sweetalert2";

const Login = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const curp = formData.get("curp");
    const password = formData.get("password");
    const termsAccepted = formData.get("terms");

    if (!curp || !password) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, complete ambos campos para continuar.",
        confirmButtonColor: "#000",
      });
      return;
    }

    if (!termsAccepted) {
      Swal.fire({
        icon: "error",
        title: "Algo anda mal",
        text: "Debe aceptar los términos y condiciones",
        confirmButtonColor: "#000",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Inicio de sesión exitoso",
      confirmButtonColor: "#000",
    }).then(() => {
      navigate("/inicioCapital"); // Redirige al componente InicioDocente
    });
  };

  return (
    <div
      className={`login-container d-flex flex-column justify-content-center align-items-center vh-100 ${
        isDarkMode ? "dark-mode" : ""
      }`}
    >
      <img src="./img/logo.png" alt="OneCorse" className="logo-2 " />
      <h2 className={`text-center mb-5 ${isDarkMode ? "dark-mode" : ""}`}>
        Introduce tu CURP y contraseña para iniciar sesión
      </h2>
      <form
        ref={formRef}
        id="login-form"
        className={`login-form ${isDarkMode ? "dark-mode" : ""}`}
        onSubmit={handleSubmit}
      >
        <div className="form-group mb-3">
          <label htmlFor="curp" className="sr-only">
            CURP
          </label>
          <input
            autoComplete="off"
            type="text"
            name="curp"
            className="form-control"
            id="curp"
            placeholder="CURP"
            required
          />
        </div>
        <div className="form-group mt-4 mb-3">
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <input
            autoComplete="off"
            type="password"
            name="password"
            className="form-control"
            id="password"
            placeholder="Contraseña"
            required
          />
        </div>
        <div className="form-group form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="terms"
            name="terms"
          />
          <label
            className={`form-check-label ${isDarkMode ? "dark-mode" : ""}`}
            htmlFor="terms"
          >
            Al continuar, acepto la{" "}
            <a
              href="#"
              className={`text-decoration-none ${
                isDarkMode ? "dark-mode" : ""
              }`}
            >
              Política de privacidad
            </a>{" "}
            y los{" "}
            <a
              href="#"
              className={`text-decoration-none ${
                isDarkMode ? "dark-mode" : ""
              }`}
            >
              Términos de uso
            </a>{" "}
            de OneCorse.
          </label>
        </div>
        <button type="submit" className="btn btn-dark btn-block w-100">
          Continuar
        </button>
      </form>
    </div>
  );
};

export default Login;
