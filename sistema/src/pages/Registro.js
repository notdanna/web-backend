import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import swal from "sweetalert";
import "../css/registro.css";

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    primer_ap: "", // Apellido paterno
    numero_empleado: "", // Número de empleado
    curp: "",
    contrasena: "",
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
    if (!formData.primer_ap || formData.primer_ap.length < 2) {
      errors.push("El apellido paterno debe tener al menos 2 caracteres.");
    }

    if (!formData.numero_empleado || isNaN(formData.numero_empleado)) {
      errors.push("Debe ingresar un número de empleado válido.");

    }

    if (!formData.contrasena || formData.contrasena.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres.");
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
        const response = await fetch("http://localhost/web-backend/api/session/signin.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            curp: formData.curp,
            contrasena: formData.contrasena,
            nombre: formData.nombre,
            primer_ap: formData.primer_ap,
            numero_empleado: parseInt(formData.numero_empleado, 10),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          swal({
            text: "Usuario registrado correctamente.",
            icon: "success",
            button: {
              text: "Aceptar",
              className: "btn btn-dark",
            },
          }).then(() => {
            navigate("../");
          });
        } else {
          throw new Error(data.message || "Error al registrar usuario.");
        }
      } catch (error) {
        swal({
          text: `Error: ${error.message}`,
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
      <h2 className="text-center">Registro de Usuario</h2>
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
            <Form.Label>Apellido Paterno*</Form.Label>
            <Form.Control
              type="text"
              id="primer_ap"
              name="primer_ap"
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
            type="number"
            id="numero_empleado"
            name="numero_empleado"
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
            label="Acepto los términos y condiciones."
          />
        </Form.Group>
        <Button variant="dark" type="submit" className="w-100">
          Registrar
        </Button>
      </Form>
    </div>
  );
};

export default Registro;
