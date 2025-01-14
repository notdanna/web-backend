import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SeguimientoTipoPago = () => {
  const navigate = useNavigate();

  // Estado inicial para los datos del formulario
  const [horarios, setHorarios] = useState([]); // Lista dinámica de horarios

  // Manejar cambios en los horarios
  const handleHorarioChange = (index, field, value) => {
    const updatedHorarios = [...horarios];
    updatedHorarios[index][field] = value;
    setHorarios(updatedHorarios);
  };

  // Agregar un nuevo horario
  const addHorario = () => {
    setHorarios((prevHorarios) => [
      ...prevHorarios,
      { dia: "", hora_inicio: "", hora_fin: "" }, // Formato inicial de horario
    ]);
  };

  // Eliminar un horario
  const removeHorario = (index) => {
    const updatedHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(updatedHorarios);
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      horarios,
    };

    console.log("Datos enviados:", payload);
    // Aquí puedes enviar los datos a la API usando fetch o axios
    // axios.post("url", payload)

    navigate(-1); // Redirigir al usuario
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Horario de Justificación</h1>
      <Form onSubmit={handleSubmit}>
        {/* Horarios dinámicos */}
        <h5>Horarios</h5>
        {horarios.map((horario, index) => (
          <Row key={index} className="mb-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId={`dia-${index}`}>
                <Form.Label>Día</Form.Label>
                <Form.Control
                  type="date"
                  value={horario.dia}
                  onChange={(e) =>
                    handleHorarioChange(index, "dia", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId={`hora_inicio-${index}`}>
                <Form.Label>Hora Inicio</Form.Label>
                <Form.Control
                  type="time"
                  value={horario.hora_inicio}
                  onChange={(e) =>
                    handleHorarioChange(index, "hora_inicio", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId={`hora_fin-${index}`}>
                <Form.Label>Hora Fin</Form.Label>
                <Form.Control
                  type="time"
                  value={horario.hora_fin}
                  onChange={(e) =>
                    handleHorarioChange(index, "hora_fin", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2} className="text-end">
              <Button
                variant="outline-danger"
                onClick={() => removeHorario(index)}
                className="w-100"
              >
                Eliminar
              </Button>
            </Col>
          </Row>
        ))}

        {/* Botón para agregar un nuevo horario */}
        <Button variant="outline-primary" onClick={addHorario} className="mb-3">
          Agregar Horario
        </Button>

        {/* Botones de acción */}
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

export default SeguimientoTipoPago;
