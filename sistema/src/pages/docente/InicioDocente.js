import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const InicioDocente = () => {
  const [userName, setUserName] = useState("Usuario");
  const [historial, setHistorial] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setUserName("Juan Pérez");
    const historialData = [
      {
        nombre: "Juan Pérez",
        tramite: "Solicitud de Certificado",
        estatus: "Completado",
        fecha: "2025-01-10",
        pdf: "certificado.pdf",
      },
      {
        nombre: "Juan Pérez",
        tramite: "Cambio de Dirección",
        estatus: "Pendiente",
        fecha: "2025-01-08",
        pdf: null,
      },
    ];
    setHistorial(historialData);
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Hola, {userName} 👋</h1>

      <div className="table-container">
        <h2 className="text-center mb-4">Historial de Trámites</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Trámite</th>
              <th>Estatus</th>
              <th>Fecha de Solicitud</th>
              <th>Ver PDF</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td>{item.tramite}</td>
                <td>{item.estatus}</td>
                <td>{item.fecha}</td>
                <td>
                  {item.pdf ? (
                    <a
                      href={`/pdfs/${item.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver PDF
                    </a>
                  ) : (
                    "No disponible"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Button
        variant="dark"
        className="btn-floating"
        onClick={() => navigate("/opciones-docentes")}
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
        +
      </Button>
    </div>
  );
};

export default InicioDocente;
