import React, { useEffect, useState } from "react";

function HistorialCompras() {
  const [canciones, setCanciones] = useState([]);
  const [vinilos, setVinilos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const usuarioId = localStorage.getItem("usuarioId");

  useEffect(() => {
    if (!usuarioId) {
      setLoading(false);
      setError("No hay usuarioId en localStorage");
      return;
    }

    const cargarDatos = async () => {
      setLoading(true);
      setError(null);

      try {
        const r1 = await fetch(
          `http://localhost:5000/api/traer-compras-canciones/comprador/${usuarioId}`
        );
        if (!r1.ok) throw new Error("Error HTTP canciones: " + r1.status);
        const d1 = await r1.json();
        setCanciones(d1.compras || []);

        const r2 = await fetch(
          `http://localhost:5000/api/traer-compras-vinilos/comprador/${usuarioId}`
        );
        if (!r2.ok) throw new Error("Error HTTP vinilos: " + r2.status);
        const d2 = await r2.json();
        setVinilos(d2.compras || []);
      } catch (err) {
        console.error("Error cargando historial:", err);
        setError("Error al cargar historial");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuarioId]);

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4 text-center">
        <i className="fa-solid fa-receipt"></i> Historial de Compras
      </h1>

      {loading && <p>Cargando historial...</p>}
      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* CANCIONES */}
      {/* -------------------------------------------- */}
      <h3 className="mt-4">
        <i className="fa-solid fa-headphones"></i> Canciones compradas
      </h3>

      <div className="row g-4">
        {canciones.length > 0 ? (
          canciones.map((c) => (
            <div className="col-md-4" key={c.compra_id}>
              <div className="card shadow-sm p-3">
                <h5 className="fw-bold">
                  {c.titulo || c.nombre || `Canción #${c.cancion_id}`}
                </h5>

                <p className="text-muted">{c.autor || c.artista || "Desconocido"}</p>

                {/* PRECIO */}
                <p className="fw-bold text-success">
                  Precio: $
                  {c.precio ||
                    c.precio_cancion ||
                    c.valor ||
                    c.cancion_precio ||
                    "N/A"}
                </p>

                <p className="text-muted">Fecha: {c.fecha_compra || "N/A"}</p>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-muted">No has comprado canciones aún.</p>
        )}
      </div>

      {/* -------------------------------------------- */}
      {/* VINILOS */}
      {/* -------------------------------------------- */}
      <h3 className="mt-5">
        <i className="fa-solid fa-compact-disc"></i> Vinilos comprados
      </h3>

      <div className="row g-4">
        {vinilos.length > 0 ? (
          vinilos.map((v) => (
            <div className="col-md-4" key={v.compra_id}>
              <div className="card shadow-sm p-3">
                <h5 className="fw-bold">
                  {v.nombre_vinilo || v.nombre || `Vinilo #${v.vinilo_id}`}
                </h5>

                <p className="text-muted">{v.autor || v.artista || "Desconocido"}</p>

                {/* PRECIO */}
                <p className="fw-bold text-success">
                  Precio: $
                  {v.precio ||
                    v.precio_vinilo ||
                    v.valor ||
                    v.vinilo_precio ||
                    "N/A"}
                </p>

                <p className="text-muted">Fecha: {v.fecha_compra || "N/A"}</p>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-muted">No has comprado vinilos aún.</p>
        )}
      </div>
    </div>
  );
}

export default HistorialCompras;
