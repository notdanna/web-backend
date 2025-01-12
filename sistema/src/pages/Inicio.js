import React from "react";

const Inicio = () => {
  return (
    <div>
      {/* Contenido principal */}
      <header className="bg-light text-dark py-5">
        <div className="container text-center">
          <h1 className="display-4">
            Contribuimos a tu diagnóstico con imágenes de alta resolución
          </h1>
          <p className="lead">
            Resonancia Magnética desde <strong>$2,800</strong> IVA incluido
          </p>
        </div>
      </header>
      {/* Secciones adicionales */}
      <section className="container my-5">
        <div className="row text-center">
          <div className="col-md-4">
            <img
              src="/img/icon1.png" // Ruta de tu imagen
              alt="Cotiza y agenda tu cita"
              style={{ width: "100px" }}
            />
            <h3>Cotiza y agenda tu cita</h3>
            <p>Hazlo de forma sencilla y rápida.</p>
          </div>
          <div className="col-md-4">
            <img
              src="/img/icon2.png" // Ruta de tu imagen
              alt="Consulta tus resultados"
              style={{ width: "100px" }}
            />
            <h3>Consulta tus resultados</h3>
            <p>Accede a tus resultados en línea.</p>
          </div>
          <div className="col-md-4">
            <img
              src="/img/icon3.png" // Ruta de tu imagen
              alt="Adquiere tus lentes"
              style={{ width: "100px" }}
            />
            <h3>Adquiere tus lentes</h3>
            <p>Encuentra los mejores precios.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
