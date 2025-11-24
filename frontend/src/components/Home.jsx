import React from "react";
import "../Home.css";
import { Link } from "react-router-dom";


function Home() {
  return (
    <div>

      {/* SECCIÓN HERO */}
      <section className="text-center py-5 bg-dark text-light">
        <h1 className="display-4 fw-bold mb-3">
          Bienvenido a <span  className="text-gold">PoliSongStock</span>
        </h1>
        <p className="lead mb-4">
          El marketplace musical donde puedes comprar, vender y descubrir vinilos,
          canciones MP3 y colecciones exclusivas.
        </p>
           <Link to="/RegistrarUsuario" className="btn btn-outline-warning py-2 ">
            Registrarme ahora
          </Link>
      </section>

      {/* SECCIÓN DESCRIPCIÓN */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">¿Qué puedes hacer aquí?</h2>

        <div className="row g-4">

          {/* CARD 1 */}
          <div className="col-md-4">
            <div className="card shadow-lg border-0 h-100 p-4 text-center">
              <div className="mb-3" style={{ fontSize: "48px" }}>💿</div>
              <h4 className="fw-bold">Comprar Vinilos</h4>
              <p className="text-muted mt-2">
                Explora un catálogo completo de vinilos clásicos y modernos.
                Filtra por género, precio, calidad y disponibilidad.
              </p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="col-md-4">
            <div className="card shadow-lg border-0 h-100 p-4 text-center">
              <div className="mb-3" style={{ fontSize: "48px" }}>🎵</div>
              <h4 className="fw-bold">Comprar Canciones MP3</h4>
              <p className="text-muted mt-2">
                Adquiere canciones en formato digital con calidad certificada.
                Perfectas para tu biblioteca musical.
              </p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="col-md-4">
            <div className="card shadow-lg border-0 h-100 p-4 text-center">
              <div className="mb-3" style={{ fontSize: "48px" }}>🛒</div>
              <h4 className="fw-bold">Vender tu Música</h4>
              <p className="text-muted mt-2">
                ¿Eres vendedor? Publica tus vinilos o canciones MP3 y llega
                a miles de compradores interesados.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN ROLES */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">¿Quién puede usar PoliSongStock?</h2>

          <div className="row g-4">

            {/* COMPRADOR */}
            <div className="col-md-6">
              <div className="p-4 shadow-sm bg-white rounded">
                <h4 className="fw-bold"><i class="fa-solid fa-bag-shopping" style={{ color: "purple" }}></i> TÚ como comprador</h4>
                <ul className="mt-3">
                  <li>Buscar y filtrar vinilos</li>
                  <li>Comprar canciones MP3</li>
                  <li>Gestionar compras y pedidos</li>
                  <li>Crear colecciones privadas o públicas</li>
                </ul>
              </div>
            </div>

            {/* VENDEDOR */}
            <div className="col-md-6">
              <div className="p-4 shadow-sm bg-white rounded">
                <h4 className="fw-bold"><i class="fa-solid fa-user-tag" style={{ color: "green" }}></i> TÚ como vendedor</h4>
                <ul className="mt-3">
                  <li>Publicar vinilos y canciones</li>
                  <li>Gestionar catálogo personal</li>
                  <li>Ver estadísticas de ventas</li>
                  <li>Editar precios, stock y calidad</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="text-center py-5 back-gold">
        <h2 className="fw-bold mb-3">Únete hoy mismo al marketplace musical</h2>
        <p className="lead mb-4">Crea tu cuenta gratis y comienza a explorar PoliSongStock.</p>
            <Link to="/RegistrarUsuario" className="btn btn-outline-light btn-lg px-4 py-3 fs-4">
              Crear cuenta ahora <i className="fa-regular fa-face-laugh-wink"></i>
            </Link>
      </section>

    </div>
  );
}

export default Home;
