import React, { useState, useContext } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pie, Line } from "react-chartjs-2";
import axios from "axios";
import Swal from "sweetalert2";

import { SessionContext } from "../../components/SessionContext";

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
  // Usamos el userName del SessionContext
  const { userName } = useContext(SessionContext);

  // Estado para el input de CURP
  const [inputCurp, setInputCurp] = useState("");

  // Estado donde guardaremos los datos de la API
  const [peticiones, setPeticiones] = useState([]);
  const [totalPeticiones, setTotalPeticiones] = useState(0);

  const navigate = useNavigate();

  // Función para llamar a la API con la CURP ingresada
  const fetchPeticiones = async (curp) => {
    try {
      const payload = { curp };
      const response = await axios.post(
        "http://localhost/web-backend/api/incidents/control/lookUser.php",
        payload
      );
      const data = response.data;

      if (data.status === "success") {
        const { peticiones, total_peticiones } = data.data;
        setPeticiones(peticiones);
        setTotalPeticiones(parseInt(total_peticiones, 10));
      } else {
        Swal.fire(
          "Error",
          data.message || "No se pudieron cargar las peticiones",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al obtener peticiones:", error);
      Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
    }
  };

  // Maneja el submit del formulario (o el click en "Buscar Peticiones")
  const handleSearch = (e) => {
    e.preventDefault(); // Evita recargar la página
    if (!inputCurp.trim()) {
      Swal.fire("Advertencia", "Por favor, ingresa una CURP válida", "warning");
      return;
    }
    fetchPeticiones(inputCurp.trim());
  };

  // Gráfica de Líneas: peticiones por mes
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
  peticiones.forEach((pet) => {
    const mes = new Date(pet.fecha_creacion).getMonth();
    solicitudesPorMes[mes] += 1;
  });

  const lineChartData = {
    labels: meses,
    datasets: [
      {
        label: "Peticiones enviadas",
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
          text: "Cantidad de peticiones",
          color: "black",
        },
        ticks: {
          color: "black",
        },
        beginAtZero: true,
      },
    },
  };

  // Gráfica de Pastel: "Completado" vs. "Pendiente"
  const getStatusFromEtapa = (idEtapa) => {
    const etapaNum = parseInt(idEtapa, 10);
    // Ajusta la lógica a tus necesidades
    if ([3, 4, 5, 6].includes(etapaNum)) {
      return "Completado";
    } else {
      return "Pendiente";
    }
  };

  const completedRequests = peticiones.filter(
    (p) => getStatusFromEtapa(p.id_etapa) === "Completado"
  ).length;

  const pendingRequests = peticiones.filter(
    (p) => getStatusFromEtapa(p.id_etapa) === "Pendiente"
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
    <div className="container mt-4">
      <h1 className="text-center mb-4">Hola, {userName} 👋</h1>

      {/* Input para ingresar la CURP */}
      <div className="mb-4 d-flex justify-content-center">
        <Form className="w-50" onSubmit={handleSearch}>
          <Form.Group controlId="formCurp" className="mb-3">
            <Form.Label>Ingresa tu CURP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: CFV327284XDVXYTIN"
              value={inputCurp}
              onChange={(e) => setInputCurp(e.target.value)}
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="dark" type="submit">
              Buscar Peticiones
            </Button>
          </div>
        </Form>
      </div>

      {/* Mostrar estadísticas y tabla sólo si hay peticiones */}
      {peticiones.length > 0 && (
        <>
          <h5 className="text-center mb-4">Total de Peticiones: {totalPeticiones}</h5>

          <div className="mb-5">
            <h2 className="text-center mb-5">Estadísticas de Peticiones</h2>
            <div className="row">
              <div className="col-md-6">
                <h5 className="text-center">Peticiones por Mes</h5>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
              <div className="col-md-6">
                <h5 className="text-center">Distribución de Peticiones</h5>
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>
          </div>

          {/* Tabla con peticiones */}
          <div className="table-container">
            <h2 className="text-center mb-4">Historial de Peticiones</h2>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID Petición</th>
                  <th>Nombre Usuario</th>
                  <th>Trámite</th>
                  <th>Etapa</th>
                  <th>Fecha de Creación</th>
                  <th>Ver PDF</th>
                </tr>
              </thead>
              <tbody>
                {peticiones.map((pet) => (
                  <tr key={pet.id_peticion}>
                    <td>{pet.id_peticion}</td>
                    <td>{pet.nombre_usuario}</td>
                    <td>{pet.nombre_tramite}</td>
                    <td>{pet.nombre_etapa}</td>
                    <td>{pet.fecha_creacion}</td>
                    <td>
                      {pet.link_pdf ? (
                        <a href={pet.link_pdf} target="_blank" rel="noopener noreferrer">
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
        </>
      )}

      {/* Botón flotante (+) para navegar a opciones-docentes */}
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
