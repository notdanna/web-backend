import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TiempoPago = () => {
  const navigate = useNavigate();

  // Estado del formulario (campos básicos)
  const [formData, setFormData] = useState({
    // Fijos o iniciales
    rol_origen: 4,    // Docente => "4"
    rol_destino: 3,   // Jefe Academia => "3"
    id_tramite: 1,    // ID de trámite "1" => "Tiempo de Pago" (según tu backend)

    // Editables por usuario
    curp_peticion: "",
    fecha_incidencia: "",
    descripcion_incidencia: "",
    horas_faltantes: "",
  });

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construir el payload exactamente como tu backend lo necesita
    const payload = {
      curp_peticion: formData.curp_peticion.trim(),
      rol_origen: formData.rol_origen,
      rol_destino: formData.rol_destino,
      id_tramite: formData.id_tramite,
      fecha_incidencia: formData.fecha_incidencia,
      descripcion_incidencia: formData.descripcion_incidencia,
      horas_faltantes: parseInt(formData.horas_faltantes, 10),
    };

    fetch("http://localhost/web-backend/api/incidents/paytime/data.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // data.id_peticion es el valor que necesitamos
          Swal.fire("Exito", data.message, "success");

          // Redirigir al segundo formulario y pasar id_peticion
          navigate("/tiempoPagoHorarios", {
            state: { id_peticion: data.id_peticion },
          });
        } else {
          Swal.fire("Error", data.message || "No se pudo crear la petición", "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Solicitud Tiempo de Pago</h1>
      <Form onSubmit={handleSubmit}>
        {/* Muestra los campos de rol_origen, rol_destino, id_tramite */}
        <Form.Group controlId="rol_origen" className="mb-3">
          <Form.Label>Rol de Origen</Form.Label>
          <Form.Control
            type="text"
            name="rol_origen"
            value="Docente" // Solo representativo
            readOnly
            disabled
          />
        </Form.Group>

        <Form.Group controlId="rol_destino" className="mb-3">
          <Form.Label>Rol de Destino</Form.Label>
          <Form.Control
            type="text"
            name="rol_destino"
            value="Jefe Academia" // Solo representativo
            readOnly
            disabled
          />
        </Form.Group>

        <Form.Group controlId="tramite" className="mb-3">
          <Form.Label>Trámite</Form.Label>
          <Form.Control
            type="text"
            name="id_tramite"
            value="Tiempo de Pago" // Solo representativo
            readOnly
            disabled
          />
        </Form.Group>

        {/* Campos que el usuario sí llena */}
        <Form.Group controlId="curp_peticion" className="mb-3">
          <Form.Label>CURP del Peticionario</Form.Label>
          <Form.Control
            type="text"
            name="curp_peticion"
            value={formData.curp_peticion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="fecha_incidencia" className="mb-3">
          <Form.Label>Fecha de la Incidencia</Form.Label>
          <Form.Control
            type="date"
            name="fecha_incidencia"
            value={formData.fecha_incidencia}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="descripcion_incidencia" className="mb-3">
          <Form.Label>Descripción de la Incidencia</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion_incidencia"
            value={formData.descripcion_incidencia}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="horas_faltantes" className="mb-3">
          <Form.Label>Horas Faltantes</Form.Label>
          <Form.Control
            type="number"
            name="horas_faltantes"
            value={formData.horas_faltantes}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button variant="dark" type="submit">
            Siguiente
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TiempoPago;
