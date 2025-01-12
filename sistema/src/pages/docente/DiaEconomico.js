import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DiaEconomico = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    curp_peticion: "",
    rol_origen: 4,
    rol_destino: 3,
    id_tramite: 1,
    fecha_incidencia: "",
    descripcion_incidencia: "",
    horas_faltantes: 8,
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
            Enviar Solicitud
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DiaEconomico;
