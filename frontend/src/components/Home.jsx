import React from "react";
import { Link } from "react-router-dom";


function Inicio() {
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* HERO */}
      <header className="bg-light py-5 text-center flex-grow-1">
        <h1 className="display-4 fw-bold">
          El sonido que conecta generaciones{" "}
          <i className="bi bi-music-note-beamed"></i>
        </h1>
        <p className="lead mt-3">
          Explora vinilos clásicos, canciones MP3, artistas independientes y colecciones únicas.
          El marketplace hecho para amantes de la música como tú.
        </p>

        <div className="mt-4">
          <a href="#" className="btn btn-primary btn-lg mx-2">
            Explorar Vinilos
          </a>
          <a href="#" className="btn btn-outline-primary btn-lg mx-2">
            Comprar MP3
          </a>
        </div>
      </header>

    </div>
  );
}

export default Inicio;
