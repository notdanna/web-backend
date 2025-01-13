import React from "react";

const Oficinas = () => {
  return (
    <div>
      {/* Sección principal con encabezado */}
      <header
        className="py-5"
        style={{
          backgroundColor: "#0a1f44",
          color: "#fff",
        }}
      >
        <div className="container text-center">
          <h1 className="display-4">Nuestras Oficinas</h1>
          <p className="lead">
            Encuentra nuestras oficinas principales y conoce más sobre cómo
            estamos a tu disposición.
          </p>
        </div>
      </header>

      {/* Sección del mapa con iframe */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <h2 className="text-center mb-4">Ubicación de nuestras oficinas</h2>
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3760.8600891188116!2d-99.14889792488137!3d19.504654338375982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f94c06d75fd7%3A0x3fe1567da2190ac9!2sESCOM%20-%20Escuela%20Superior%20de%20C%C3%B3mputo%20-%20IPN!5e0!3m2!1sen!2smx!4v1736651022086!5m2!1sen!2smx"
                  style={{
                    border: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detalles de contacto */}
      <section
        className="py-5"
        style={{ backgroundColor: "#0a1f44", color: "#fff" }}
      >
        <div className="container">
          <h2 className="text-center mb-4">Contáctanos</h2>
          <div className="row text-center">
            <div className="col-md-4">
              <h4>Teléfono</h4>
              <p>+52 55 1234 5678</p>
            </div>
            <div className="col-md-4">
              <h4>Correo electrónico</h4>
              <p>onecorse@gmail.com</p>
            </div>
            <div className="col-md-4">
              <h4>Horario</h4>
              <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Envíanos un mensaje</h2>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Ingresa tu nombre"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Ingresa tu correo"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Mensaje
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="4"
                    placeholder="Escribe tu mensaje"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-dark w-100">
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Oficinas;
