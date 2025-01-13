import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Legend,
  Tooltip,
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Legend,
  Tooltip
);

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
      {
        nombre: "Juan Pérez",
        tramite: "Actualización de Datos",
        estatus: "Completado",
        fecha: "2025-02-15",
        pdf: "actualizacion.pdf",
      },
      {
        nombre: "Juan Pérez",
        tramite: "Solicitud de Beca",
        estatus: "Pendiente",
        fecha: "2025-02-20",
        pdf: null,
      },
    ];
    setHistorial(historialData);
  }, []);

  // Transformar datos para la gráfica de líneas
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
  historial.forEach((item) => {
    const mes = new Date(item.fecha).getMonth(); // Obtener el mes de la fecha
    solicitudesPorMes[mes] += 1;
  });

  const lineChartData = {
    labels: meses,
    datasets: [
      {
        label: "Trámites enviados",
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
          text: "Cantidad de trámites",
          color: "black",
        },
        ticks: {
          color: "black",
        },
        beginAtZero: true,
      },
    },
  };

  const completedRequests = historial.filter(
    (item) => item.estatus === "Completado"
  ).length;
  const pendingRequests = historial.filter(
    (item) => item.estatus === "Pendiente"
  ).length;

  const pieChartData = {
    labels: ["Completados", "Pendientes"],
    datasets: [
      {
        data: [completedRequests, pendingRequests],
        backgroundColor: ["#ffffff", "#003785"],
        borderColor: ["white", "white"],
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Hola, {userName} 👋</h1>

      {/* Gráficas */}
      <div className="mb-5">
        <h2 className="text-center mb-5">Estadísticas de Trámites</h2>
        <div className="row">
          <div className="col-md-6">
            <h5 className="text-center">Trámites Enviados por Mes (Líneas)</h5>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
          <div className="col-md-6">
            <h5 className="text-center">Distribución de Trámites (Circular)</h5>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

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
