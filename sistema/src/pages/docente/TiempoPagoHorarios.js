import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TiempoPagoHorarios = () => {
  const navigate = useNavigate();
  // Aquí recuperamos el state pasado desde TiempoPago
  const location = useLocation();
  const { id_peticion } = location.state || {};

  // Por seguridad, podrías hacer una verificación:
  if (!id_peticion) {
    // Si no hay id_peticion, redirigir a algún lugar
    navigate("/"); 
  }

  // Estado local que contendrá un arreglo de objetos (horarios)
  const [horarios, setHorarios] = useState([
    // Inicializamos con un único horario vacío
    { dia: "", hora_inicio: "", hora_fin: "" },
  ]);

  // Maneja cambios en cada horario
  const handleHorarioChange = (index, e) => {
    const { name, value } = e.target;
    setHorarios((prevHorarios) => {
      const updated = [...prevHorarios];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };
      return updated;
    });
  };

  // Agregar un nuevo campo de horario
  const handleAgregarHorario = () => {
    setHorarios((prev) => [...prev, { dia: "", hora_inicio: "", hora_fin: "" }]);
  };

  // Eliminar un horario
  const handleEliminarHorario = (index) => {
    setHorarios((prev) => prev.filter((_, i) => i !== index));
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construimos el payload para dataRecord
    const payload = {
      id_peticion,
      horarios: horarios.map((h) => ({
        dia: h.dia,
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin,
      })),
    };

    fetch("http://localhost/web-backend/api/incidents/paytime/dataRecord.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          Swal.fire("Exito", data.message, "success");

          // Opcional: redirigir a otra página o limpiar el formulario
          navigate("/");
        } else {
          Swal.fire("Error", data.message || "No se pudo registrar horarios", "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Registrar Horarios del Tiempo de Pago</h1>
      <p>
        <strong>ID Petición:</strong> {id_peticion}
      </p>

      <Form onSubmit={handleSubmit}>
        {horarios.map((horario, index) => (
          <div key={index} className="border p-3 mb-3">
            <Row className="mb-3">
              <Form.Group as={Col} controlId={`dia-${index}`}>
                <Form.Label>Día</Form.Label>
                <Form.Control
                  type="date"
                  name="dia"
                  value={horario.dia}
                  onChange={(e) => handleHorarioChange(index, e)}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId={`hora_inicio-${index}`}>
                <Form.Label>Hora Inicio</Form.Label>
                <Form.Control
                  type="time"
                  name="hora_inicio"
                  value={horario.hora_inicio}
                  onChange={(e) => handleHorarioChange(index, e)}
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId={`hora_fin-${index}`}>
                <Form.Label>Hora Fin</Form.Label>
                <Form.Control
                  type="time"
                  name="hora_fin"
                  value={horario.hora_fin}
                  onChange={(e) => handleHorarioChange(index, e)}
                  required
                />
              </Form.Group>
            </Row>
            {/* Botón para eliminar este horario, si se desea */}
            {horarios.length > 1 && (
              <Button
                variant="danger"
                onClick={() => handleEliminarHorario(index)}
              >
                Eliminar este horario
              </Button>
            )}
          </div>
        ))}

        <div className="d-flex justify-content-between mb-3">
          <Button variant="dark" onClick={handleAgregarHorario}>
            Agregar Otro Horario
          </Button>
        </div>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Regresar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Horarios
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TiempoPagoHorarios;
