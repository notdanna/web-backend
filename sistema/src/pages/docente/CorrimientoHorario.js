import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CorrimientoHorario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    curp_peticion: "",
    rol_origen: "Docente",
    rol_destino: "Jefe de Academia",
    tramite: "Corrimiento de Horario",
    horario: {
      dia: "",
      hora_inicio: "",
      hora_fin: "",
    },
    descripcion_incidencia: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Manejar cambios en el objeto `horario`
    if (name in formData.horario) {
      setFormData((prev) => ({
        ...prev,
        horario: { ...prev.horario, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("Corrimiento de Horario enviado correctamente");
    navigate(-1); // Regresa a la página anterior
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Corrimiento de Horario</h1>
      <Form
        onSubmit={handleSubmit}
        className="p-4 shadow-lg"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
      >
        {/* CURP */}
        <Form.Group className="mb-3">
          <Form.Label>CURP del Solicitante</Form.Label>
          <Form.Control
            type="text"
            name="curp_peticion"
            value={formData.curp_peticion}
            onChange={handleChange}
            placeholder="Ejemplo: DDQ673335SNTYIOPC"
            required
          />
        </Form.Group>

        {/* Rol Origen */}
        <Form.Group className="mb-3">
          <Form.Label>Rol Origen</Form.Label>
          <Form.Control
            type="text"
            name="rol_origen"
            value={formData.rol_origen}
            onChange={handleChange}
            disabled
          />
        </Form.Group>

        {/* Rol Destino */}
        <Form.Group className="mb-3">
          <Form.Label>Rol Destino</Form.Label>
          <Form.Control
            type="text"
            name="rol_destino"
            value={formData.rol_destino}
            onChange={handleChange}
            disabled
          />
        </Form.Group>

        {/* ID Trámite */}
        <Form.Group className="mb-3">
          <Form.Label>ID del Trámite</Form.Label>
          <Form.Control
            type="text"
            name="tramite"
            value={formData.tramite}
            onChange={handleChange}
            disabled
          />
        </Form.Group>

        {/* Horario */}
        <Form.Group className="mb-3">
          <Form.Label>Día</Form.Label>
          <Form.Control
            type="date"
            name="dia"
            value={formData.horario.dia}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Hora de Inicio</Form.Label>
          <Form.Control
            type="time"
            name="hora_inicio"
            value={formData.horario.hora_inicio}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Hora de Fin</Form.Label>
          <Form.Control
            type="time"
            name="hora_fin"
            value={formData.horario.hora_fin}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Descripción de Incidencia */}
        <Form.Group className="mb-3">
          <Form.Label>Descripción de la Incidencia</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion_incidencia"
            value={formData.descripcion_incidencia}
            onChange={handleChange}
            placeholder="Ejemplo: El docente faltó por motivos de salud"
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          {/* Botón para regresar */}
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Regresar
          </Button>

          {/* Botón para enviar */}
          <Button type="submit" variant="dark">
            Enviar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CorrimientoHorario;
