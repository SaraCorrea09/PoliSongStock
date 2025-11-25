import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import RegistrarUsuario from "./RegistrarUsuario";
import CatalogoVinilos from "./CatalogoVinilos";
import { useNavigate } from "react-router-dom";
import CatalogoCanciones from "./CatalogoCancion";
import ReporteVentas from "./ReporteVentas";

function AdminPanel() {
  const [section, setSection] = useState("home");
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const nombre =
      localStorage.getItem("usuarioNombre") ||
      localStorage.getItem("nombreUsuario");

    const rol =
      localStorage.getItem("usuarioRol") ||
      localStorage.getItem("rolDetectado") ||
      localStorage.getItem("rolGuardado");

    if (!nombre) {
      navigate("/login");
      return;
    }

    if (rol !== "admin") {
      navigate("/login");
      return;
    }

    setNombre(nombre);
  }, [navigate]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">
          Bienvenid@ {nombre}{" "}
          <i className="fa-solid fa-door-open" style={{ color: "#C9AE5D" }}></i>
        </h1>
        <div className="text-end">
          <button
            className="btn btn-outline-info me-2"
            onClick={() => navigate("/perfil")}
          >
            Mi perfil
          </button>
        </div>
      </div>

      {/* HOME */}
      {section === "home" && (
        <div className="row g-4">

          {/* USUARIOS */}
          <div className="col-md-3">
            <div
              className="card shadow-lg border-0 h-100 p-4 text-center option-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSection("usuarios")}
            >
              <h2 className="fw-bold">
                <i className="fa-solid fa-users"></i> Usuarios
              </h2>
              <p className="text-muted">Administrar usuarios del sistema</p>
            </div>
          </div>

          {/* VINILOS */}
          <div className="col-md-3">
            <div
              className="card shadow-lg border-0 h-100 p-4 text-center option-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSection("catalogo")}
            >
              <h2 className="fw-bold">
                <i className="fa-solid fa-compact-disc"></i> Vinilos
              </h2>
              <p className="text-muted">Gestionar vinilos y contenido</p>
            </div>
          </div>

          {/* CANCIONES */}
          <div className="col-md-3">
            <div
              className="card shadow-lg border-0 h-100 p-4 text-center option-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSection("canciones")}
            >
              <h2 className="fw-bold">
                <i className="fa-solid fa-music"></i> Canciones
              </h2>
              <p className="text-muted">Gestionar canciones del sistema</p>
            </div>
          </div>

          {/* REPORTES */}
          <div className="col-md-3">
            <div
              className="card shadow-lg border-0 h-100 p-4 text-center option-card"
              style={{ cursor: "pointer" }}
              onClick={() => setSection("reportes")}
            >
              <h2 className="fw-bold">
                <i className="fa-solid fa-chart-line"></i> Reportes
              </h2>
              <p className="text-muted">Ver estadísticas del sistema</p>
            </div>
          </div>

        </div>
      )}

      {/* USUARIOS */}
      {section === "usuarios" && (
        <div>
          <button className="btn btn-dark mb-3" onClick={() => setSection("home")}>
            <i class="fa-solid fa-angles-left"></i> Volver
          </button>
          <UserList onRegistrar={() => setSection("registrarUsuario")} />
        </div>
      )}

      {section === "registrarUsuario" && (
        <div>
          <button className="btn btn-dark mb-3" onClick={() => setSection("usuarios")}>
            <i class="fa-solid fa-angles-left"></i> Volver
          </button>
          <RegistrarUsuario />
        </div>
      )}

      {/* VINILOS */}
      {section === "catalogo" && (
        <div>
          <button className="btn btn-dark mb-3" onClick={() => setSection("home")}>
            <i class="fa-solid fa-angles-left"></i> Volver
          </button>
          <CatalogoVinilos />
        </div>
      )}

      {/* CANCIONES */}
      {section === "canciones" && (
        <div>
          <button className="btn btn-dark mb-3" onClick={() => setSection("home")}>
            ⬅ Volver
          </button>
          <CatalogoCanciones />
        </div>
      )}

      {/* REPORTES */}
      {section === "reportes" && (
        <div>
          <button className="btn btn-dark mb-3" onClick={() => setSection("home")}>
            <i class="fa-solid fa-angles-left"></i> Volver
          </button>
          <ReporteVentas />
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
