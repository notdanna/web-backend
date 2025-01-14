import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Col, Row } from "react-bootstrap";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import "../css/registro.css";

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    curp: "",
    contrasena: "",
    numeroEmpleado: "",
    terminos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.nombre || formData.nombre.length < 2) {
      errors.push("El nombre debe tener al menos 2 caracteres.");
    }
    if (!formData.apellido || formData.apellido.length < 2) {
      errors.push("El apellido debe tener al menos 2 caracteres.");
    }
    if (!formData.curp || formData.curp.length !== 17) {
      errors.push("El CURP debe tener 18 caracteres.");
    }
    if (!formData.contrasena || formData.contrasena.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (!formData.numeroEmpleado) {
      errors.push("El número de empleado es obligatorio.");
    }
    if (!formData.terminos) {
      errors.push("Debe aceptar los términos y condiciones.");
    }

    if (errors.length > 0) {
      swal({
        text: errors.join("\n"),
        icon: "error",
        button: {
          text: "Aceptar",
          className: "btn btn-dark",
        },
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost/web-backend/api/session/signin.php",
          {
            curp: formData.curp,
            contrasena: formData.contrasena,
          }
        );

        const result = response.data;

        if (result.status === "success") {
          swal({
            text: result.message,
            icon: "success",
            button: {
              text: "Aceptar",
              className: "btn btn-dark",
            },
          }).then(() => {
            navigate("../login"); // Redirige tras el éxito
          });
        } else {
          swal({
            text: result.message,
            icon: "error",
            button: {
              text: "Aceptar",
              className: "btn btn-dark",
            },
          });
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        swal({
          text: "Hubo un error al conectar con el servidor.",
          icon: "error",
          button: {
            text: "Aceptar",
            className: "btn btn-dark",
          },
        });
      }
    }
  };

  return (
    <div className="container mt-5 mb-4">
      <h2 className="text-center">Vamos a hacerte un miembro de OneCorse.</h2>
      <br />
      <Form id="registroForm" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Nombre*</Form.Label>
            <Form.Control
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Apellido Paterno</Form.Label>
            <Form.Control
              type="text"
              id="apellido"
              name="apellido"
              value={formData.primer_ap}
              onChange={handleChange}
              placeholder="Apellido Paterno"
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Curp*</Form.Label>
          <Form.Control
            id="curp"
            type="text"
            name="curp"
            value={formData.curp}
            onChange={handleChange}
            placeholder="CURP"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña*</Form.Label>
          <Form.Control
            id="contrasena"
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="Contraseña"
          />
          <Form.Text className="text-muted">
            <ul>
              <li>8 caracteres como mínimo</li>
              <li>Letras mayúsculas, minúsculas y un número</li>
            </ul>
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Número de Empleado*</Form.Label>
          <Form.Control
            id="numeroEmpleado"
            type="text"
            name="numeroEmpleado"
            value={formData.numero_empleado}
            onChange={handleChange}
            placeholder="Número de Empleado"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            name="terminos"
            id="terminos"
            checked={formData.terminos}
            onChange={handleChange}
            label="Acepto recibir correos y alertas de OneCorse."
          />
        </Form.Group>
        <Button variant="dark" type="submit" className="w-100">
          Crear una cuenta
        </Button>
      </Form>
    </div>
  );
};

export default Registro;
