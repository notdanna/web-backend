import React, { useState } from "react";
import Swal from "sweetalert2";

const InicioAdministrador = () => {
  const [reportes, setReportes] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      tramite: "Solicitud de Certificado",
      estatus: "Completado",
      fecha: "2025-01-10",
      pdf: "Disponible",
    },
    {
      id: 2,
      nombre: "Ana López",
      tramite: "Cambio de Dirección",
      estatus: "Pendiente",
      fecha: "2025-01-08",
      pdf: "No disponible",
    },
  ]);

  const usuarios = [
    {
      id: 1,
      nombre: "Carlos Hernández",
      email: "carlos.h@gmail.com",
      telefono: "555-123-4567",
    },
    {
      id: 2,
      nombre: "Lucía Ramírez",
      email: "lucia.r@gmail.com",
      telefono: "555-987-6543",
    },
    {
      id: 3,
      nombre: "Fernando Díaz",
      email: "fernando.d@gmail.com",
      telefono: "555-567-8901",
    },
  ];

  const handleEdit = (id) => {
    alert(`Editar usuario con ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Eliminar usuario con ID: ${id}`);
  };

  const handleStatusChange = (id) => {
    const reporte = reportes.find((reporte) => reporte.id === id);

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
          // Actualiza el estado del reporte
          const nuevosReportes = reportes.map((reporte) =>
            reporte.id === id ? { ...reporte, estatus: nuevoEstatus } : reporte
          );
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
    <div className="container my-4">
      <h1 className="mb-4">Bienvenido, María García</h1>

      <h2 className="mb-3">Usuarios de tu Área</h2>
      <div className="row mb-4">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">{usuario.nombre}</h5>
                <p className="card-text">Email: {usuario.email}</p>
                <p className="card-text">Teléfono: {usuario.telefono}</p>
                <div className="d-flex justify-content-between">
                  <button
                    onClick={() => handleEdit(usuario.id)}
                    className="btn btn-dark btn-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3">Listado de Reportes de Incidencia</h2>
      <table className="table table-bordered">
        <thead className="table-light">
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
          {reportes.map((reporte) => (
            <tr key={reporte.id}>
              <td>{reporte.nombre}</td>
              <td>{reporte.tramite}</td>
              <td>
                <button
                  className={`btn btn-sm ${
                    reporte.estatus === "Completado"
                      ? "btn-success"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => handleStatusChange(reporte.id)}
                >
                  {reporte.estatus}
                </button>
              </td>
              <td>{reporte.fecha}</td>
              <td>
                {reporte.pdf === "Disponible" ? (
                  <a
                    href="#"
                    className="text-primary text-decoration-underline"
                  >
                    Ver PDF
                  </a>
                ) : (
                  "No disponible"
                )}
              </td>
              <td>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() => alert(`Editar reporte ID: ${reporte.id}`)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InicioAdministrador;
