import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DiaEconomico = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    curp_peticion: "DOU344174FXEVULSS",
    rol_origen: "Docente",
    rol_destino: "Jefe de Academia",
    tramite: "Dia Económico",
    fecha_incidencia: "2025-01-15",
    descripcion_incidencia:
      "El docente solicita un día económico por asuntos personales.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario, por ejemplo, enviando los datos a una API
    console.log("Datos del formulario:", formData);
    // Redirigir a la página anterior después de enviar el formulario
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Solicitud de Día Económico</h1>
      <Form onSubmit={handleSubmit}>
        {/* Campos no editables */}
        <Form.Group controlId="rol_origen" className="mb-3">
          <Form.Label>Rol de Origen</Form.Label>
          <Form.Control
            type="text"
            name="rol_origen"
            value={formData.rol_origen}
            readOnly
            disabled
          />
        </Form.Group>

        <Form.Group controlId="rol_destino" className="mb-3">
          <Form.Label>Rol de Destino</Form.Label>
          <Form.Control
            type="text"
            name="rol_destino"
            value={formData.rol_destino}
            readOnly
            disabled
          />
        </Form.Group>

        <Form.Group controlId="tramite" className="mb-3">
          <Form.Label>Trámite</Form.Label>
          <Form.Control
            type="text"
            name="tramite"
            value={formData.tramite}
            readOnly
            disabled
          />
        </Form.Group>

        {/* Campos editables */}
        <Form.Group controlId="curp_peticion" className="mb-3">
          <Form.Label>CURP del Peticionario</Form.Label>
          <Form.Control
            type="text"
            name="curp_peticion"
            placeholder={formData.curp_peticion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="fecha_incidencia" className="mb-3">
          <Form.Label>Fecha de la Incidencia</Form.Label>
          <Form.Control
            type="date"
            name="fecha_incidencia"
            placeholder={formData.fecha_incidencia}
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
            placeholder={formData.descripcion_incidencia}
            onChange={handleChange}
            required
          />
        </Form.Group>

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

export default DiaEconomico;
