import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserPanel() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const n = localStorage.getItem("usuarioNombre") || localStorage.getItem("nombreUsuario");
    if (!n) {
      navigate("/login");
      return;
    }
    setNombre(n);
  }, []);

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-0">Bienvenid@ {nombre} <i class="fa-solid fa-door-open" style={{ color: "#C9AE5D" }}></i></h1>
          <p className="text-muted">Selecciona una opción para empezar.</p>
        </div>

        <div className="text-end">
          <button className="btn btn-outline-info me-2" onClick={() => navigate("/perfil")}>
            Mi perfil
          </button>
        </div>
      </div>

      {/* GRID DE CARDS */}
      <div className="row g-4 justify-content-center">

        {/* CARD VINILOS */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card shadow-lg border-0 text-center p-4 option-card"
            onClick={() => navigate("/catalogoVinilos")}
            style={{ cursor: "pointer", borderRadius: 12 }}
          >
            <div className="display-4 mb-3">💿</div>
            <h5 className="fw-bold mb-2">Vinilos</h5>
            <p className="text-muted small">
              Explora nuestro catálogo de vinilos exclusivos.
            </p>
          </div>
        </div>

        {/* CARD MP3 */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card shadow-lg border-0 text-center p-4 option-card"
            onClick={() => navigate("/catalogoCancion")}
            style={{ cursor: "pointer", borderRadius: 12 }}
          >
            <div className="display-4 mb-3">🎵</div>
            <h5 className="fw-bold mb-2">Canciones MP3</h5>
            <p className="text-muted small">
              Compra canciones individuales en formato digital.
            </p>
          </div>
        </div>
                {/* CARD RECOPILACIONES */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card shadow-lg border-0 text-center p-4 option-card"
            onClick={() => navigate("/recopilaciones")}
            style={{ cursor: "pointer", borderRadius: 12 }}
          >
            <div className="display-4 mb-3"><i class="fa-solid fa-sliders"></i></div>
            <h5 className="fw-bold mb-2">Recopilaciones</h5>
            <p className="text-muted small">
              Gestiona tus recopilaciones y busca recopilaciones deseadas.
            </p>
          </div>
        </div>

        {/* CARD CARRITO */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card shadow-lg border-0 text-center p-4 option-card"
            onClick={() => navigate("/carrito")}
            style={{ cursor: "pointer", borderRadius: 12 }}
          >
            <div className="display-4 mb-3">🛒</div>
            <h5 className="fw-bold mb-2">Mi carrito</h5>
            <p className="text-muted small">
              Revisa y gestiona tus productos seleccionados.
            </p>
          </div>
        </div>

        {/* CARD VENDER VINILOS */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card shadow-lg border-0 text-center p-4 option-card"
            onClick={() => navigate("/gestionVinilos")}
            style={{ cursor: "pointer", borderRadius: 12 }}
          >
            <div className="display-4 mb-3">📀</div>
            <h5 className="fw-bold mb-2">Vender Vinilos</h5>
            <p className="text-muted small">
              Publica tus propios vinilos y gana dinero.
            </p>
          </div>
        </div>
                {/* CARD HISTORIAL */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card shadow-lg border-0 text-center p-4 option-card"
            onClick={() => navigate("/compras")}
            style={{ cursor: "pointer", borderRadius: 12 }}
          >
            <div className="display-4 mb-3"><i class="fa-solid fa-receipt"></i></div>
            <h5 className="fw-bold mb-2">Mis compras</h5>
            <p className="text-muted small">
              Revisa el historial de tus compras realizadas.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserPanel;
