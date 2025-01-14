import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    if (Object.keys(formData.horario).includes(name)) {
      setFormData((prev) => ({
        ...prev,
        horario: {
          ...prev.horario,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validarFormulario = () => {
    const { dia, hora_inicio, hora_fin } = formData.horario;
    const { curp_peticion, descripcion_incidencia } = formData;

    if (
      !curp_peticion.trim() ||
      !dia ||
      !hora_inicio ||
      !hora_fin ||
      !descripcion_incidencia.trim()
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son obligatorios.",
      });
      return false;
    }

    if (
      new Date(`1970-01-01T${hora_inicio}`) >=
      new Date(`1970-01-01T${hora_fin}`)
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La hora de inicio debe ser menor que la hora de fin.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const payload = {
      curp_peticion: formData.curp_peticion.trim(),
      rol_origen: 4,
      rol_destino: 3,
      id_tramite: 3, // Identificador para Corrimiento de Horario
      horario: {
        dia: formData.horario.dia,
        hora_inicio: formData.horario.hora_inicio,
        hora_fin: formData.horario.hora_fin,
      },
      descripcion_incidencia: formData.descripcion_incidencia.trim(),
    };

    fetch("http://localhost/web-backend/api/incidents/scheduleShift/data.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // Guardar en localStorage
          localStorage.setItem("id_peticion", data.id_peticion);

          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "La petición se creó correctamente.",
          }).then(() => {
            // Redirigir al segundo formulario
            navigate("/corrimiento-horario-next", {
              state: { id_peticion: data.id_peticion },
            });
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Hubo un problema al crear la petición.",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al conectar con la API.",
        });
        console.error("Error al conectar con la API:", error);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Corrimiento de Horario</h1>
      <Form
        onSubmit={handleSubmit}
        className="p-4 shadow-lg"
        style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
      >
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
        <Form.Group className="mb-3">
          <Form.Label>Descripción de la Incidencia</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion_incidencia"
            value={formData.descripcion_incidencia}
            onChange={handleChange}
            placeholder="Ejemplo: El docente faltó por motivos de salud..."
            required
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Regresar
          </Button>
          <Button type="submit" variant="dark">
            Siguiente
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CorrimientoHorario;
