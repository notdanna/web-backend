import React from "react";
import { Carousel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faFile, faLock } from "@fortawesome/free-solid-svg-icons";

const Inicio = () => {
  return (
    <div>
      {/* Contenido principal */}
      <header
        className="py-5"
        style={{
          backgroundColor: "#0a1f44", // Azul oscuro
          color: "#fff", // Texto blanco
        }}
      >
        <div className="container text-center">
          <h1 className="display-4">Sistema de Administración Escolar</h1>
          <p className="lead">
            Simplifica la gestión académica con nuestra plataforma segura y
            confiable.
          </p>
        </div>
      </header>

      {/* Carrusel de experiencias */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#fff", // Blanco
          color: "#0a1f44", // Azul oscuro
        }}
      >
        <div className="container">
          <h1 className="text-center mb-4">Experiencias</h1>
          <Carousel>
            <Carousel.Item>
              <div className="d-flex justify-content-center">
                <img
                  src="/img/user1.jpg" // Reemplaza con la ruta de tus imágenes
                  className="rounded-circle shadow-lg"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <Carousel.Caption>
                <blockquote>
                  <p className="fs-4 text-dark">
                    "Gracias a este sistema, puedo gestionar las actividades de
                    la escuela de forma mucho más eficiente."
                  </p>
                </blockquote>
                <h5 className="fw-bold" style={{ color: "#000" }}>
                  María López, Directora Escolar
                </h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <div className="d-flex justify-content-center">
                <img
                  src="/img/user2.jpg" // Reemplaza con la ruta de tus imágenes
                  className="rounded-circle shadow-lg"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <Carousel.Caption>
                <blockquote>
                  <p className="fs-4 text-dark">
                    "La plataforma me ayuda a mantener organizadas las
                    calificaciones y asistencia de mis estudiantes."
                  </p>
                </blockquote>
                <h5 className="fw-bold" style={{ color: "#000" }}>
                  José Pérez, Profesor
                </h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <div className="d-flex justify-content-center">
                <img
                  src="/img/user3.jpg" // Reemplaza con la ruta de tus imágenes
                  className="rounded-circle shadow-lg"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <Carousel.Caption>
                <blockquote>
                  <p className="fs-4 text-dark">
                    "Como madre, puedo seguir el progreso académico de mis hijos
                    desde cualquier lugar."
                  </p>
                </blockquote>
                <h5 className="fw-bold" style={{ color: "#000" }}>
                  Luisa Fernández, Madre de familia
                </h5>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </section>

      {/* Sección de características */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#0a1f44", // Azul oscuro
          color: "#fff", // Blanco
        }}
      >
        <div className="container">
          <h2 className="text-center mb-5">Características principales</h2>
          <div className="row text-center">
            <div className="col-md-4">
              <FontAwesomeIcon
                icon={faSchool}
                size="5x"
                className="mb-3"
                style={{ color: "#fff" }}
              />
              <h3>Gestión académica</h3>
              <p>
                Organiza horarios, asignaturas y calificaciones en un solo
                lugar.
              </p>
            </div>
            <div className="col-md-4">
              <FontAwesomeIcon
                icon={faLock}
                size="5x"
                className="mb-3"
                style={{ color: "#fff" }}
              />
              <h3>Seguridad</h3>
              <p>
                Mantén seguros tus datos en todo momento y sé parte del esquema
                OneCorse.
              </p>
            </div>
            <div className="col-md-4">
              <FontAwesomeIcon
                icon={faFile}
                size="5x"
                className="mb-3"
                style={{ color: "#fff" }}
              />
              <h3>Análisis y reportes</h3>
              <p>Obtén reportes detallados para tomar decisiones informadas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#fff", // Blanco
          color: "#0a1f44", // Azul oscuro
        }}
      >
        <div className="container text-center">
          <h2>¡Únete a miles de escuelas que confían en nosotros!</h2>
          <p className="lead">
            Regístrate ahora y empieza a transformar la forma en que gestionas
            tu institución educativa.
          </p>
          <a href="/registro" className="btn btn-dark btn-lg">
            Comienza ahora
          </a>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
