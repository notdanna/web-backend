import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

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
        {
          nombre: "Luis Martínez",
          tramite: "Actualización de Datos",
          estatus: "Completado",
          fecha: "2025-02-15",
          pdf: "actualizacion.pdf",
        },
        {
          nombre: "Carla Gómez",
          tramite: "Solicitud de Beca",
          estatus: "Pendiente",
          fecha: "2025-02-20",
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

  // Datos para la gráfica circular (Pendientes vs Completados)
  const completedReports = reportes.filter(
    (r) => r.estatus === "Completado"
  ).length;
  const pendingReports = reportes.filter(
    (r) => r.estatus === "Pendiente"
  ).length;

  const pieChartData = {
    labels: ["Completados", "Pendientes"],
    datasets: [
      {
        data: [completedReports, pendingReports],
        backgroundColor: ["#003785", "#ffffff"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "black",
        },
      },
    },
  };

  // Datos para la gráfica de líneas (Solicitudes por mes)
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const solicitudesPorMes = Array(12).fill(0);
  reportes.forEach((item) => {
    const mes = new Date(item.fecha).getMonth();
    solicitudesPorMes[mes] += 1;
  });

  const lineChartData = {
    labels: meses,
    datasets: [
      {
        label: "Solicitudes por Mes",
        data: solicitudesPorMes,
        borderColor: "blue",
        backgroundColor: "white",
        pointBorderColor: "black",
        pointBackgroundColor: "white",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "black",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Meses",
          color: "black",
        },
        ticks: {
          color: "black",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cantidad de Solicitudes",
          color: "black",
        },
        ticks: {
          color: "black",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bienvenido Alan</h1>

      {/* Gráficas */}
      <div className="mb-5">
        <h2 className="text-center">Estadísticas de Trámites</h2>
        <div className="row">
          <div className="col-md-6">
            <h5 className="text-center">Distribución de Trámites (Circular)</h5>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="col-md-6">
            <h5 className="text-center">Solicitudes por Mes (Líneas)</h5>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div className="mb-5">
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
