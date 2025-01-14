import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Line, Pie } from "react-chartjs-2";
import axios from "axios";
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

/**
 * Mapa de etapas:
 *  1 => "Enviado para revisión."
 *  2 => "Pendiente."
 *  3 => "Aprobado por Jefe Academia."
 *  4 => "Rechazado por Jefe Academia."
 *  5 => "Aprobado por Capital Humano."
 *  6 => "Rechazado por Capital Humano."
 */
const etapaMap = {
  1: "Enviado para revisión.",
  2: "Pendiente.",
  3: "Aprobado por Jefe Academia.",
  4: "Rechazado por Jefe Academia.",
  5: "Aprobado por Capital Humano.",
  6: "Rechazado por Capital Humano.",
};

const InicioCapital = () => {
  const [reportes, setReportes] = useState([]);

  // 1. Llamada a la API lookCapital.php con método GET al montar el componente
  useEffect(() => {
    axios
      .get("http://localhost/web-backend/api/incidents/control/lookCapital.php")
      .then((response) => {
        if (response.data.status === "success") {
          setReportes(response.data.data); // Array con todas las peticiones
        } else {
          Swal.fire("Error", "No se pudieron obtener los reportes", "error");
        }
      })
      .catch((error) => {
        console.error("Error al obtener reportes:", error);
        Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
      });
  }, []);

  // 2. Manejar la lógica de aprobación o rechazo por Capital Humano
  const handleStatusChange = async (idPeticion, accion) => {
    try {
      // POST a status.php con { "id_peticion": x, "accion": "aprobar_capital"/"rechazar_capital" }
      const payload = {
        id_peticion: idPeticion,
        accion: accion, // "aprobar_capital" o "rechazar_capital"
      };
      const response = await axios.post(
        "http://localhost/web-backend/api/incidents/control/status.php",
        payload
      );
      const data = response.data;

      if (data.status === "success") {
        Swal.fire("Hecho", data.message, "success");
        // Volver a cargar reportes para reflejar el cambio
        const refresh = await axios.get(
          "http://localhost/web-backend/api/incidents/control/lookCapital.php"
        );
        if (refresh.data.status === "success") {
          setReportes(refresh.data.data);
        }
      } else {
        Swal.fire("Error", data.message || "No se pudo actualizar el estatus", "error");
      }
    } catch (error) {
      console.error("Error al cambiar el estatus:", error);
      Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
    }
  };

  // -------------------------------
  // Gráfica circular (Pie) de Etapas
  // -------------------------------
  // Contar cuántas peticiones hay en cada etapa (1 a 6)
  const stageCounts = [0, 0, 0, 0, 0, 0];
  reportes.forEach((rep) => {
    const etapaNum = parseInt(rep.id_etapa, 10);
    if (etapaNum >= 1 && etapaNum <= 6) {
      stageCounts[etapaNum - 1]++;
    }
  });

  // Configuración de la gráfica de pastel
  const pieChartData = {
    labels: [
      "Enviado Revisión",
      "Pendiente",
      "Aprobado Jefe",
      "Rechazado Jefe",
      "Aprobado CH",
      "Rechazado CH",
    ],
    datasets: [
      {
        data: stageCounts,
        backgroundColor: ["#003785", "#ffffff", "#4caf50", "#f44336", "#9C27B0", "#FF5722"],
        borderColor: "#ffffff",
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

  // -------------------------------
  // Gráfica de líneas: Solicitudes por mes (fecha_creacion)
  // -------------------------------
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

  // Contar cuántas peticiones hay por mes
  const solicitudesPorMes = Array(12).fill(0);
  reportes.forEach((item) => {
    const mes = new Date(item.fecha_creacion).getMonth();
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
      <h1 className="text-center mb-4">Bienvenido, Capital Humano</h1>

      {/* Gráficas */}
      <div className="mb-5">
        <h2 className="text-center">Estadísticas de Solicitudes</h2>
        <div className="row">
          <div className="col-md-6">
            <h5 className="text-center">Distribución de Etapas (Circular)</h5>
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
        <h2 className="text-center mb-4">Listado de Reportes</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID Petición</th>
              <th>Nombre</th>
              <th>Etapa</th>
              <th>Fecha de Creación</th>
              <th>Fecha Incidencia</th>
              <th>Descripción</th>
              <th>Horas</th>
              <th>Ver PDF</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((rep, index) => {
              const etapaTexto = etapaMap[rep.id_etapa] || "Desconocido";
              const nombreCompleto = `${rep.nombre} ${rep.primer_ap} ${rep.segundo_ap}`.trim();

              return (
                <tr key={rep.id_peticion}>
                  <td>{rep.id_peticion}</td>
                  <td>{nombreCompleto}</td>
                  <td>{etapaTexto}</td>
                  <td>{rep.fecha_creacion}</td>
                  <td>{rep.fecha_incidencia}</td>
                  <td>{rep.descripcion_incidencia}</td>
                  <td>{rep.horas_faltantes}</td>
                  <td>
                    {rep.link_pdf ? (
                      <a href={rep.link_pdf} target="_blank" rel="noopener noreferrer">
                        Ver PDF
                      </a>
                    ) : (
                      "No disponible"
                    )}
                  </td>
                  <td className="d-flex gap-2">
                    {/* Botones para Aprobar/Rechazar por Capital Humano */}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusChange(rep.id_peticion, "aprobar_capital")}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(rep.id_peticion, "rechazar_capital")}
                    >
                      Rechazar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InicioCapital;
