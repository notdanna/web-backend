import React, { useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Legend,
  Tooltip
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

const InicioJefe = () => {
  const [jefeName] = useState("María García");

  // Input de CURP para buscar las peticiones
  const [inputCurp, setInputCurp] = useState("");

  // Datos obtenidos de la API (look.php)
  const [reportes, setReportes] = useState([]);

  // Llamada a la API look.php (tipo POST) para obtener reportes por curp
  const fetchReportes = async (curp) => {
    try {
      const payload = { curp };
      const response = await axios.post(
        "http://localhost/web-backend/api/incidents/control/look.php",
        payload
      );
      const data = response.data;

      if (data.status === "success") {
        setReportes(data.data); // Guardamos el arreglo de reportes
      } else {
        Swal.fire("Error", data.message || "No se pudieron cargar los reportes", "error");
      }
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
    }
  };

  // Al dar submit, se llama a fetchReportes con la curp ingresada
  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputCurp.trim()) {
      Swal.fire("Advertencia", "Por favor, ingresa una CURP válida", "warning");
      return;
    }
    fetchReportes(inputCurp.trim());
  };

  // ------------------------------------------------
  // Lógica para APROBAR o RECHAZAR la petición
  // ------------------------------------------------
  const handleStatusChange = async (idPeticion, accion) => {
    try {
      const payload = {
        id_peticion: idPeticion,
        accion: accion, // "aprobar_jefe", "rechazar_jefe", etc.
      };
      const response = await axios.post(
        "http://localhost/web-backend/api/incidents/control/status.php",
        payload
      );
      const data = response.data;

      if (data.status === "success") {
        Swal.fire("Listo", data.message, "success");
        // Opcional: volver a cargar la lista de reportes
        fetchReportes(inputCurp);
      } else {
        Swal.fire("Error", data.message || "No se pudo cambiar el estatus", "error");
      }
    } catch (error) {
      console.error("Error al cambiar el estatus:", error);
      Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
    }
  };

  // Contamos cuántos reportes hay por cada etapa (1-6)
  const stageCounts = [0, 0, 0, 0, 0, 0];
  reportes.forEach((rep) => {
    const etapa = parseInt(rep.id_etapa, 10);
    if (etapa >= 1 && etapa <= 6) {
      stageCounts[etapa - 1]++;
    }
  });

  // Preparamos datos para las gráficas
  const etapasLabels = [
    "Enviado para revisión.",
    "Pendiente.",
    "Aprobado Jefe.",
    "Rechazado Jefe.",
    "Aprobado CH.",
    "Rechazado CH.",
  ];

  const barChartData = {
    labels: etapasLabels,
    datasets: [
      {
        label: "Cantidad de Reportes",
        data: stageCounts,
        backgroundColor: [
          "#2196F3", // Azul
          "#FFC107", // Amarillo
          "#4CAF50", // Verde
          "#F44336", // Rojo
          "#9C27B0", // Morado
          "#FF5722", // Naranja
        ],
      },
    ],
  };

  const doughnutChartData = {
    labels: etapasLabels,
    datasets: [
      {
        data: stageCounts,
        backgroundColor: [
          "#2196F3",
          "#FFC107",
          "#4CAF50",
          "#F44336",
          "#9C27B0",
          "#FF5722",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Bienvenido</h1>

      {/* Formulario para ingresar la CURP */}
      <div className="mb-4 d-flex justify-content-center">
        <Form className="w-50" onSubmit={handleSearch}>
          <Form.Group controlId="formCurp" className="mb-3">
            <Form.Label>Ingresa la CURP del usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: CJR625816GYWIKYXT"
              value={inputCurp}
              onChange={(e) => setInputCurp(e.target.value)}
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="dark" type="submit">
              Buscar Reportes
            </Button>
          </div>
        </Form>
      </div>

      {/* Mostrar estadísticas y tabla solo si hay reportes */}
      {reportes.length > 0 && (
        <>
          <div className="mb-5">
            <h2 className="text-center">Estadísticas de Reportes</h2>
            <Row className="justify-content-center mb-4">
              <Col xs={12} md={6} className="mb-4">
                <h5 className="text-center">Cantidad de Reportes (Barras)</h5>
                <Bar data={barChartData} options={chartOptions} />
              </Col>
              <Col xs={12} md={6}>
                <h5 className="text-center">Distribución de Reportes (Dona)</h5>
                <Doughnut data={doughnutChartData} options={chartOptions} />
              </Col>
            </Row>
          </div>

          {/* Tabla con la lista de reportes */}
          <div>
            <h2 className="text-center mb-4">Listado de Reportes de Incidencia</h2>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID Petición</th>
                    <th>Nombre Completo</th>
                    <th>Etapa</th>
                    <th>Fecha Incidencia</th>
                    <th>Descripción</th>
                    <th>Horas Faltantes</th>
                    <th>Ver PDF</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((rep) => {
                    const nombreCompleto = `${rep.nombre} ${rep.primer_ap} ${rep.segundo_ap}`.trim();
                    const etapaTexto = etapaMap[rep.id_etapa] || "Desconocido";

                    return (
                      <tr key={rep.id_peticion}>
                        <td>{rep.id_peticion}</td>
                        <td>{nombreCompleto}</td>
                        <td>{etapaTexto}</td>
                        <td>{rep.fecha_incidencia}</td>
                        <td>{rep.descripcion_incidencia}</td>
                        <td>{rep.horas_faltantes}</td>
                        <td>
                          {rep.link_pdf ? (
                            <a
                              href={rep.link_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Ver PDF
                            </a>
                          ) : (
                            "No disponible"
                          )}
                        </td>
                        <td className="d-flex gap-2">
                          {/* Botones para Aprobar / Rechazar */}
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleStatusChange(rep.id_peticion, "aprobar_jefe")}
                          >
                            Aprobar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleStatusChange(rep.id_peticion, "rechazar_jefe")}
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
        </>
      )}
    </div>
  );
};

export default InicioJefe;
