import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

const InicioJefe = () => {
  const [jefeName, setJefeName] = useState("Nombre del Jefe");
  const [reportes, setReportes] = useState([]);
  const [docentes, setDocentes] = useState([]);

  useEffect(() => {
    // Simular la obtención de datos del jefe, reportes y docentes
    const obtenerDatos = async () => {
      const nombre = "María García"; // Nombre del jefe
      const datosReportes = [
        {
          nombre: "Juan Pérez",
          tramite: "Solicitud de Certificado",
          estatus: "Completado",
          fecha: "2025-01-10",
          pdf: "certificado.pdf",
        },
        {
          nombre: "Ana López",
          tramite: "Cambio de Dirección",
          estatus: "Pendiente",
          fecha: "2025-01-08",
          pdf: null,
        },
      ];

      const datosDocentes = [
        {
          nombre: "Carlos Hernández",
          email: "carlos.h@gmail.com",
          telefono: "555-123-4567",
        },
        {
          nombre: "Lucía Ramírez",
          email: "lucia.r@gmail.com",
          telefono: "555-987-6543",
        },
        {
          nombre: "Fernando Díaz",
          email: "fernando.d@gmail.com",
          telefono: "555-567-8901",
        },
      ];

      setJefeName(nombre);
      setReportes(datosReportes);
      setDocentes(datosDocentes);
    };

    obtenerDatos();
  }, []);

  const handleStatusChange = (index) => {
    const reporte = reportes[index];

    if (reporte) {
      const nuevoEstatus =
        reporte.estatus === "Completado" ? "Pendiente" : "Completado";

      Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseas cambiar el estado del trámite a "${nuevoEstatus}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sí, cambiar a "${nuevoEstatus}"`,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Actualizar el estado del reporte
          const nuevosReportes = [...reportes];
          nuevosReportes[index] = { ...reporte, estatus: nuevoEstatus };
          setReportes(nuevosReportes);

          Swal.fire(
            "Estado cambiado",
            `El trámite ahora está "${nuevoEstatus}".`,
            "success"
          );
        }
      });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bienvenido, {jefeName}</h1>

      {/* Sección de Docentes */}
      <div className="mb-5">
        <h2 className="text-center">Docentes de tu Área</h2>
        <Row className="g-4">
          {docentes.map((docente, index) => (
            <Col md={4} key={index}>
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>{docente.nombre}</Card.Title>
                  <Card.Text>
                    <strong>Email:</strong> {docente.email}
                  </Card.Text>
                  <Card.Text>
                    <strong>Teléfono:</strong> {docente.telefono}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tabla de Reportes */}
      <div>
        <h2 className="text-center mb-4">Listado de Reportes de Incidencia</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Trámite</th>
              <th>Estatus</th>
              <th>Fecha de Solicitud</th>
              <th>Ver PDF</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte, index) => (
              <tr key={index}>
                <td>{reporte.nombre}</td>
                <td>{reporte.tramite}</td>
                <td>
                  <Button
                    variant={
                      reporte.estatus === "Completado"
                        ? "success"
                        : "outline-secondary"
                    }
                    onClick={() => handleStatusChange(index)}
                  >
                    {reporte.estatus}
                  </Button>
                </td>
                <td>{reporte.fecha}</td>
                <td>
                  {reporte.pdf ? (
                    <a
                      href={`/pdfs/${reporte.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver PDF
                    </a>
                  ) : (
                    "No disponible"
                  )}
                </td>
                <td>
                  <Button
                    variant="dark"
                    onClick={() => alert(`Editar reporte de ${reporte.nombre}`)}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InicioJefe;
