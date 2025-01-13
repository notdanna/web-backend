import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";

const InicioCapital = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    // Simular la obtención de datos de los reportes
    const obtenerReportes = async () => {
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

      setReportes(datosReportes);
    };

    obtenerReportes();
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
      <h1 className="text-center mb-4">Bienvenido</h1>

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

export default InicioCapital;
