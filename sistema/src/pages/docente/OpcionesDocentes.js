import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarDay,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import "../../css/opcionesDocentes.css";

const OpcionesDocentes = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#fff", color: "#000" }}
    >
      <h1 className="mb-5 text-center">Opciones Docentes</h1>

      <div
        className="d-flex flex-wrap justify-content-center"
        style={{ gap: "20px" }}
      >
        {/* Corrimiento de Horario */}
        <div
          className="option-card d-flex flex-column align-items-center justify-content-center"
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "transform 0.3s, background-color 0.3s",
          }}
          onClick={() => navigate("/corrimiento-horario")}
        >
          <FontAwesomeIcon icon={faClock} size="3x" className="mb-3" />
          <span style={{ fontWeight: "bold" }}>Corrimiento de Horario</span>
        </div>

        {/* Día Económico */}
        <div
          className="option-card d-flex flex-column align-items-center justify-content-center"
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "transform 0.3s, background-color 0.3s",
          }}
          onClick={() => navigate("/dia-economico")} // Navega a DiaEconomico
        >
          <FontAwesomeIcon icon={faCalendarDay} size="3x" className="mb-3" />
          <span style={{ fontWeight: "bold" }}>Día Económico</span>
        </div>

        {/* Tiempo de Pago */}
        <div
          className="option-card d-flex flex-column align-items-center justify-content-center"
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "transform 0.3s, background-color 0.3s",
          }}
          onClick={() => navigate("/tiempoPago")}
        >
          <FontAwesomeIcon icon={faMoneyBill} size="3x" className="mb-3" />
          <span style={{ fontWeight: "bold" }}>Tiempo de Pago</span>
        </div>
      </div>

      <Button
        variant="dark"
        onClick={() => navigate(-1)} // Regresa a la página anterior
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ←
      </Button>
    </div>
  );
};

export default OpcionesDocentes;
