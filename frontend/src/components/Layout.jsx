import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className="navbar-brand fs-3" href="#">
          🎵 PoliSongStock
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/catalogo">Vinilos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">Iniciar Sesión</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* CONTENIDO (las páginas van aquí) */}
      <div className="flex-grow-1">
        <Outlet />
      </div>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        PoliSongStock © 2025 – Tu marketplace musical
      </footer>
    </div>
  );
}

export default Layout;
