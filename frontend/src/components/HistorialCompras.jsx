import React, { useEffect, useState } from "react";

function HistorialCompras() {
  const [canciones, setCanciones] = useState([]);
  const [vinilos, setVinilos] = useState([]);

  const usuarioId = localStorage.getItem("usuarioId");

  useEffect(() => {
    if (!usuarioId) return;

    const cargarDatos = async () => {
      const r1 = await fetch(
        `http://localhost:5000/api/traer-compras-canciones/comprador/${usuarioId}`
      );
      const d1 = await r1.json();
      setCanciones(d1.compras || []);

      const r2 = await fetch(
        `http://localhost:5000/api/traer-compras-vinilos/comprador/${usuarioId}`
      );
      const d2 = await r2.json();
      setVinilos(d2.compras || []);
    };

    cargarDatos();
  }, [usuarioId]);

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4 text-center">📜 Historial de Compras</h1>

      <h3 className="mt-4">🎵 Canciones compradas</h3>
      <div className="row g-4">
        {canciones.map((c) => (
          <div className="col-md-4" key={c.id}>
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold">{c.titulo}</h5>
              <p className="text-muted">{c.autor}</p>
            </div>
          </div>
        ))}

        {canciones.length === 0 && (
          <p className="text-muted">No has comprado canciones aún.</p>
        )}
      </div>

      <h3 className="mt-5">💿 Vinilos comprados</h3>
      <div className="row g-4">
        {vinilos.map((v) => (
          <div className="col-md-4" key={v.id}>
            <div className="card shadow-sm p-3">
              <h5 className="fw-bold">{v.titulo}</h5>
              <p className="text-muted">{v.autor}</p>
            </div>
          </div>
        ))}

        {vinilos.length === 0 && (
          <p className="text-muted">No has comprado vinilos aún.</p>
        )}
      </div>
    </div>
  );
}

export default HistorialCompras;
