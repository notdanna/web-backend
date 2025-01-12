import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCode, faScroll } from "@fortawesome/free-solid-svg-icons";

const Conocenos = () => {
  return (
    <div>
      {/* Sección principal */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(to right, #0a1f44, #0d3c6e)",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-5">Conócenos</h1>
              <p className="lead">
                Somos un sistema diseñado para transformar la gestión educativa
                de tu institución. Con herramientas tecnológicas avanzadas y un
                enfoque en la excelencia, ayudamos a escuelas a optimizar sus
                procesos y mejorar la experiencia educativa.
              </p>
            </div>
            <div className="col-md-6">
              <div className="col-md-6 text-center">
                <FontAwesomeIcon
                  icon={faScroll}
                  size="9x"
                  className="mb-3"
                  style={{ color: "#fff" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Propósito, Misión, Visión, Valores */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-3">
            <h4 className="text-dark">PROPÓSITO</h4>
            <p>
              Brindar herramientas tecnológicas accesibles para transformar la
              gestión educativa.
            </p>
          </div>
          <div className="col-md-3">
            <h4 className="text-dark">MISIÓN</h4>
            <p>
              Simplificar y mejorar los procesos administrativos y académicos en
              instituciones educativas.
            </p>
          </div>
          <div className="col-md-3">
            <h4 className="text-dark">VISIÓN</h4>
            <p>
              Ser el sistema de referencia en gestión escolar, reconocido por su
              innovación y confiabilidad.
            </p>
          </div>
          <div className="col-md-3">
            <h4 className="text-dark">VALORES</h4>
            <p>
              Innovación, accesibilidad, excelencia, seguridad y compromiso con
              la educación.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestra Tecnología */}
      <section className="container py-5">
        <h2 className="text-center mb-4">Nuestra Tecnología</h2>
        <div className="row align-items-center">
          <div className="col-md-6">
            <p>
              Nuestro sistema combina lo mejor de la tecnología con un diseño
              intuitivo para brindar soluciones eficientes a las instituciones
              educativas. Desde la organización de calificaciones hasta la
              gestión de horarios, garantizamos precisión, seguridad y facilidad
              de uso.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <FontAwesomeIcon
              icon={faCode}
              size="8x"
              className="mb-3"
              style={{ color: "#000" }}
            />
          </div>
        </div>
      </section>

      {/* Centro Nacional de Referencia */}
      <section className="container py-5">
        <h2 className="text-center mb-4">Centro Nacional de Referencia</h2>
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <FontAwesomeIcon
              icon={faGlobe}
              size="8x"
              className="mb-3"
              style={{ color: "#000" }}
            />
          </div>
          <div className="col-md-6">
            <p>
              Nuestro sistema cuenta con un equipo dedicado a mantener la
              calidad y seguridad de la información. Las instituciones
              educativas que confían en nosotros tienen acceso a análisis
              avanzados, soporte técnico y actualizaciones continuas para
              mantenerse a la vanguardia.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Conocenos;
