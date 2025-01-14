import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SolicitudDiaEconomico = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    curp_peticion: "",
    rol_origen: 4, // Docente
    rol_destino: 3, // Jefe Academia
    id_tramite: 2, // Día Económico
    fecha_incidencia: "",
    descripcion_incidencia: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construir el payload
    const payload = {
      curp_peticion: formData.curp_peticion.trim(),
      rol_origen: formData.rol_origen,
      rol_destino: formData.rol_destino,
      id_tramite: formData.id_tramite,
      fecha_incidencia: formData.fecha_incidencia,
      descripcion_incidencia: formData.descripcion_incidencia.trim(),
    };

    // Enviar la solicitud a la API
    fetch("http://localhost/web-backend/api/incidents/economicDay/data.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          Swal.fire(
            "Éxito",
            data.message || "Solicitud enviada correctamente",
            "success"
          );

          // Redirigir al historial o página principal
          navigate("/inicio-docente");
        } else {
          Swal.fire(
            "Error",
            data.message || "No se pudo enviar la solicitud",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Solicitud de Día Económico</h1>
      <Form onSubmit={handleSubmit}>
        {/* Información fija */}
        <Form.Group controlId="rol_origen" className="mb-3">
          <Form.Label>Rol de Origen</Form.Label>
          <Form.Control type="text" value="Docente" readOnly disabled />
        </Form.Group>

        <Form.Group controlId="rol_destino" className="mb-3">
          <Form.Label>Rol de Destino</Form.Label>
          <Form.Control type="text" value="Jefe Academia" readOnly disabled />
        </Form.Group>

        <Form.Group controlId="tramite" className="mb-3">
          <Form.Label>Trámite</Form.Label>
          <Form.Control type="text" value="Día Económico" readOnly disabled />
        </Form.Group>

        {/* Campos editables */}
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

        {/* Botones */}
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button variant="dark" type="submit">
            Enviar Solicitud
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SolicitudDiaEconomico;
