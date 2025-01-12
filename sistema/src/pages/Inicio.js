import React from "react";
import { Carousel } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";

const Inicio = () => {
  return (
    <div>
      {/* Contenido principal */}
      <header className="bg-light text-dark py-5">
        <div className="container text-center">
          <h1 className="display-4">Sistema de Administración Escolar</h1>
          <p className="lead">
            Simplifica la gestión académica con nuestra plataforma segura y
            confiable.
          </p>
        </div>
      </header>

      {/* Carrusel de experiencias */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">
            Experiencias de nuestros usuarios
          </h2>
          <Carousel>
            <Carousel.Item>
              <div className="d-flex justify-content-center">
                <img
                  src="/img/user1.jpg" // Reemplaza con la ruta de tus imágenes
                  alt="Usuario 1"
                  className="rounded-circle"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
              <Carousel.Caption>
                <p>
                  "Gracias a este sistema, puedo gestionar las actividades de la
                  escuela de forma mucho más eficiente."
                </p>
                <h5>María López, Directora Escolar</h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <div className="d-flex justify-content-center">
                <img
                  src="/img/user2.jpg" // Reemplaza con la ruta de tus imágenes
                  alt="Usuario 2"
                  className="rounded-circle"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
              <Carousel.Caption>
                <p>
                  "La plataforma me ayuda a mantener organizadas las
                  calificaciones y asistencia de mis estudiantes."
                </p>
                <h5>José Pérez, Profesor</h5>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <div className="d-flex justify-content-center">
                <img
                  src="/img/user3.jpg" // Reemplaza con la ruta de tus imágenes
                  alt="Usuario 3"
                  className="rounded-circle"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
              <Carousel.Caption>
                <p>
                  "Como madre, puedo seguir el progreso académico de mis hijos
                  desde cualquier lugar."
                </p>
                <h5>Luisa Fernández, Madre de familia</h5>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </section>

      {/* Sección de características */}
      <section className="container my-5">
        <h2 className="text-center mb-5">Características principales</h2>
        <div className="row text-center">
          <div className="col-md-4">
            <FontAwesomeIcon
              icon={faSchool}
              size="3x"
              className="mb-3 text-primary"
            />
            <h3>Gestión académica</h3>
            <p>
              Organiza horarios, asignaturas y calificaciones en un solo lugar.
            </p>
          </div>
          <div className="col-md-4">
            <img
              src="/img/icon2.png" // Reemplaza con la ruta de tus imágenes
              alt="Comunicación eficiente"
              style={{ width: "100px" }}
            />
            <h3>Comunicación eficiente</h3>
            <p>
              Conecta a estudiantes, padres y profesores con notificaciones en
              tiempo real.
            </p>
          </div>
          <div className="col-md-4">
            <img
              src="/img/icon3.png" // Reemplaza con la ruta de tus imágenes
              alt="Análisis y reportes"
              style={{ width: "100px" }}
            />
            <h3>Análisis y reportes</h3>
            <p>Obtén reportes detallados para tomar decisiones informadas.</p>
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="bg-dark text-light py-5">
        <div className="container text-center">
          <h2>¡Únete a miles de escuelas que confían en nosotros!</h2>
          <p className="lead">
            Regístrate ahora y empieza a transformar la forma en que gestionas
            tu institución educativa.
          </p>
          <a href="/registro" className="btn btn-secondary btn-lg">
            Comienza ahora
          </a>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
