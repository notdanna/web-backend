import React, { useEffect, useState, useContext } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pie, Line } from "react-chartjs-2";
import { SessionContext } from "../../components/SessionContext";
import Swal from "sweetalert2";

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
  const { userName, userId } = useContext(SessionContext);

  const [peticiones, setPeticiones] = useState([]); // Peticiones reales de la API
  const [totalPeticiones, setTotalPeticiones] = useState(0); // Total que regresa la API
  const navigate = useNavigate();

  // 1. Al montar el componente, hacemos la llamada a la API lookUser.php
  useEffect(() => {
    if (!userId) return; // Verifica si tienes el userId en tu contexto; si no, no llamamos la API.

    // Construir el payload
    const payload = {
      userId: userId, // userId real del usuario
    };

    fetch("http://localhost/web-backend/api/incidents/control/lookUser.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch((error) => {
        console.error("Error al obtener peticiones:", error);
        Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
      });
  }, [userId]);

  // 2. Transformar datos para la gráfica de líneas (por mes)
  //    Usamos fecha_creacion de la petición.
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
    // "2025-01-12 16:06:49" -> parsear para obtener mes
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

  // 3. Gráfica de pastel: Convertir id_etapa en "Completado" o "Pendiente"
  //    A modo de ejemplo: id_etapa = 1 o 2 => Pendiente; 3,4,5,6 => Completado
  const getStatusFromEtapa = (idEtapa) => {
    const etapaNum = parseInt(idEtapa, 10);
    // Ajusta tu lógica de acuerdo a tu requerimiento
    if ([3, 4, 5, 6].includes(etapaNum)) {
      return "Completado";
    } else {
      return "Pendiente";
    }
  };

  // Contar cuántos "Completado" y cuántos "Pendiente"
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Hola, {userName} 👋</h1>
      <h5 className="text-center mb-4">
        Total de Peticiones: {totalPeticiones}
      </h5>

      {/* Gráficas */}
      <div className="mb-5">
        <h2 className="text-center mb-5">Estadísticas de Peticiones</h2>
        <div className="row">
          <div className="col-md-6">
            <h5 className="text-center">Peticiones por Mes </h5>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
          <div className="col-md-6">
            <h5 className="text-center">Distribución de Peticiones </h5>
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
                    <a
                      href={pet.link_pdf}
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
