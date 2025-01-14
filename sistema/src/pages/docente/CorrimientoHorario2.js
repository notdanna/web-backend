import React, { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const CorrimientoHorario2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [idPeticion, setIdPeticion] = useState("");
  const [horarios, setHorarios] = useState([
    { dia: "", hora_inicio: "", hora_fin: "" },
  ]);

  useEffect(() => {
    const idFromState = location.state?.id_peticion;
    const idFromStorage = localStorage.getItem("id_peticion");

    if (idFromState) {
      setIdPeticion(idFromState);
    } else if (idFromStorage) {
      setIdPeticion(idFromStorage);
    }
  }, [location]);

  const handleHorarioChange = (index, e) => {
    const { name, value } = e.target;
    setHorarios((prevHorarios) =>
      prevHorarios.map((horario, i) =>
        i === index ? { ...horario, [name]: value } : horario
      )
    );
  };

  const handleAddHorario = () => {
    setHorarios((prevHorarios) => [
      ...prevHorarios,
      { dia: "", hora_inicio: "", hora_fin: "" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id_peticion: parseInt(idPeticion, 10),
      horarios: horarios.map((horario) => ({
        dia: horario.dia,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
      })),
    };

    fetch(
      "http://localhost/web-backend/api/incidents/scheduleShift/dataRecord.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then(() => {
        navigate("/inicio-docente");
      })
      .catch((error) => {
        console.error("Error al enviar los horarios:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        Formulario de Corrimiento de Horarios
      </h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="id_peticion" className="mb-3">
          <Form.Label>ID de Petición</Form.Label>
          <Form.Control
            type="text"
            value={idPeticion || "No disponible"}
            readOnly
            disabled
          />
        </Form.Group>

        <h5>Horarios</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>Día</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map((horario, index) => (
              <tr key={index}>
                <td>
                  <Form.Control
                    type="date"
                    name="dia"
                    value={horario.dia}
                    onChange={(e) => handleHorarioChange(index, e)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="time"
                    name="hora_inicio"
                    value={horario.hora_inicio}
                    onChange={(e) => handleHorarioChange(index, e)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="time"
                    name="hora_fin"
                    value={horario.hora_fin}
                    onChange={(e) => handleHorarioChange(index, e)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={handleAddHorario} className="mb-3">
          Agregar Horario
        </Button>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button variant="dark" type="submit">
            Enviar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CorrimientoHorario2;
