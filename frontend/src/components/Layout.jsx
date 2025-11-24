import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../logo.png";

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

const handleLogout = () => {

  // Limpia absolutamente todo lo del usuario
  localStorage.removeItem("usuarioNombre");
  localStorage.removeItem("nombreUsuario");
  localStorage.removeItem("usuarioId");
  localStorage.removeItem("usuarioRol");
  localStorage.removeItem("rolDetectado");
  localStorage.removeItem("rolGuardado");
  localStorage.removeItem("usuarioLogeado");
  localStorage.removeItem("logeado");

  // Limpia cualquier otro dato del proyecto
  localStorage.clear();

  // Limpia el Contexto → esto hace que el navbar se actualice de inmediato
  logout();

  // Redirige al Home
  navigate("/");

  // 🔹 Recarga suave para que no quede nada en memoria del frontend
  setTimeout(() => {
    window.location.reload();
  }, 200);
};

  const renderMenu = () => {
    // Usuario no autenticado
    if (!user) {
      return (
        <>
          <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/registrarUsuario">Registrarse</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/login">Iniciar Sesión</Link></li>
        </>
      );
    }

    // Admin
    if (user.rol === "admin") {
      return (
        <>
          <li className="nav-item"><Link className="nav-link" to="/adminPanel">Inicio</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/userList">Usuarios</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/catalogoVinilos">Vinilos</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/catalogoCancion">Canciones</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/reportes">Reportes</Link></li>
          <li className="nav-item">
            <button className="btn btn-danger ms-3" onClick={handleLogout}>Cerrar Sesión</button>
          </li>
        </>
      );
    }

    // Seller y Buyer
    if (user.rol === "seller" || user.rol === "buyer") {
      return (
        <>
          <li className="nav-item"><Link className="nav-link" to="/userPanel">Inicio</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/catalogoVinilos">Vinilos</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/catalogoCancion">Canciones</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/recopilaciones">Recopilaciones</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/carrito">Carrito</Link></li>


          {user.rol === "seller" && (
            <li className="nav-item"><Link className="nav-link" to="/gestionVinilos">Vender</Link></li>
          )}
          <li className="nav-item"><Link className="nav-link" to="/compras">Compras</Link></li>


          <li className="nav-item">
            <button className="btn btn-danger ms-3" onClick={handleLogout}>Cerrar Sesión</button>
          </li>
        </>
      );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <div className="container-fluid">

          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img 
              src={logo}
              alt="Logo"
              width="100"
              height="100"
              className="me-2"
            />
            PoliSongStock
          </Link>

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
              {renderMenu()}
            </ul>
          </div>

        </div>
      </nav>

      {/* CONTENIDO */}
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
