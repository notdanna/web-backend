import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import "../css/registro.css";

const Registro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("../");
    }
  }, [navigate]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "";

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: email,
    contrasena: "",
    preferencia: "",
    nacimiento: "",
    codigoPostal: "",
    estado: "",
    municipio: "",
    colonia: "",
    calle: "",
    numero: "",
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
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Debe ingresar un correo electrónico válido.");
    }
    if (!formData.contrasena || formData.contrasena.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (!formData.preferencia) {
      errors.push("Debe seleccionar una preferencia.");
    }
    if (!formData.nacimiento || new Date(formData.nacimiento) > new Date()) {
      errors.push("Debe ingresar una fecha de nacimiento válida.");
    }
    if (!formData.codigoPostal) {
      errors.push("El código postal es obligatorio.");
    }
    if (!formData.estado) {
      errors.push("El estado es obligatorio.");
    }
    if (!formData.municipio) {
      errors.push("El municipio es obligatorio.");
    }
    if (!formData.colonia) {
      errors.push("La colonia es obligatoria.");
    }
    if (!formData.calle) {
      errors.push("La calle es obligatoria.");
    }
    if (!formData.numero) {
      errors.push("El número es obligatorio.");
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      swal({
        text: "Formulario enviado correctamente (simulación).",
        icon: "success",
        button: {
          text: "Aceptar",
          className: "btn btn-dark",
        },
      }).then(() => {
        navigate("../");
      });
    }
  };

  return (
    <div className="container mt-5 mb-4">
      <h2 className="text-center">Vamos a hacerte un Xclusive member.</h2>
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
            <Form.Label>Apellidos*</Form.Label>
            <Form.Control
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellidos"
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Correo*</Form.Label>
          <Form.Control
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo"
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
          <Form.Label>Preferencia de compra*</Form.Label>
          <Form.Select
            id="preferencia"
            name="preferencia"
            value={formData.preferencia}
            onChange={handleChange}
          >
            <option value="">Elige una opción</option>
            <option value="Ropa">Ropa</option>
            <option value="Calzado">Calzado</option>
            <option value="Accesorios">Accesorios</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha de nacimiento*</Form.Label>
          <Form.Control
            type="date"
            id="nacimiento"
            name="nacimiento"
            value={formData.nacimiento}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            name="terminos"
            id="terminos"
            checked={formData.terminos}
            onChange={handleChange}
            label="Acepto la Política de privacidad y los Términos de uso de Xclusive Store."
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
