import React, { useEffect, useState } from "react";

function Recopilaciones() {
  const [misRecopilaciones, setMisRecopilaciones] = useState([]);
  const [publicas, setPublicas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionada, setSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    publica: true,
  });

  useEffect(() => {
    // Datos falsos por ahora (simulación)
    setMisRecopilaciones([
      { id: 1, nombre: "Mis Rock Favoritos", descripcion: "Clásicos", publica: true, canciones: [ "Queen - Bohemian Rhapsody", "Bon Jovi - It's my life" ] },
      { id: 2, nombre: "Relax para programar", descripcion: "Lofi vibes", publica: false, canciones: [ "Lofi Girl - Study", "JazzHop - Coding" ] }
    ]);

    setPublicas([
      { id: 10, nombre: "Bailable mezclado", descripcion: "Reggaeton + Salsa", usuario: "Juan", publica: true, canciones: [ "Marc Anthony - Vivir mi vida" ] },
      { id: 11, nombre: "Trap Hits", descripcion: "Top mundial", usuario: "Laura", publica: true, canciones: [ "Bad Bunny - Dákiti" ] }
    ]);
  }, []);

  // ---------- CRUD ----------
  const crearRecopilacion = () => {
    if (!form.nombre.trim()) return;

    const nueva = {
      id: Date.now(),
      ...form,
      canciones: []
    };

    setMisRecopilaciones([ ...misRecopilaciones, nueva ]);
    limpiarFormulario();
  };

  const editarRecopilacion = () => {
    const actualizadas = misRecopilaciones.map((r) =>
      r.id === seleccionada.id ? { ...seleccionada, ...form } : r
    );
    setMisRecopilaciones(actualizadas);
    setModoEdicion(false);
    limpiarFormulario();
  };

  const eliminarRecopilacion = (id) => {
    if (!window.confirm("¿Eliminar esta recopilación?")) return;
    setMisRecopilaciones(misRecopilaciones.filter((r) => r.id !== id));
    setSeleccionada(null);
  };

  const limpiarFormulario = () => {
    setForm({ nombre: "", descripcion: "", publica: true });
  };

  // ---------- Buscar públicas ----------
  const publicasFiltradas = publicas.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container py-4">

      <h1 className="fw-bold text-center mb-4">🎵 Gestión de Recopilaciones</h1>

      <div className="row">

        {/* PANEL IZQUIERDO */}
        <div className="col-md-4">

          {/* FORMULARIO */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                {modoEdicion ? "Editar recopilación" : "Crear nueva recopilación"}
              </h4>

              <label className="form-label">Nombre</label>
              <input
                className="form-control mb-3"
                value={form.nombre}
                onChange={(e) =>
                  setForm({ ...form, nombre: e.target.value })
                }
              />

              <label className="form-label">Descripción</label>
              <input
                className="form-control mb-3"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.publica}
                  onChange={(e) =>
                    setForm({ ...form, publica: e.target.checked })
                  }
                />
                <label className="form-check-label">Hacer pública</label>
              </div>

              {/* BOTONES */}
              {!modoEdicion ? (
                <button className="btn btn-success w-100" onClick={crearRecopilacion}>
                  Crear recopilación
                </button>
              ) : (
                <>
                  <button className="btn btn-primary w-100 mb-2" onClick={editarRecopilacion}>
                    Guardar cambios
                  </button>
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setModoEdicion(false);
                      limpiarFormulario();
                    }}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* MIS RECOPILACIONES */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold mb-3">📁 Mis recopilaciones</h4>

              {misRecopilaciones.map((rec) => (
                <div
                  key={rec.id}
                  className="p-2 mb-2 rounded border hover-shadow"
                  style={{ cursor: "pointer", background: "#fafafa" }}
                  onClick={() => {
                    setSeleccionada(rec);
                    setModoEdicion(false);
                    setForm(rec);
                  }}
                >
                  <div className="fw-bold">{rec.nombre}</div>
                  <small className="text-muted">{rec.descripcion}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="col-md-8">

          {/* BUSCADOR */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3">🔍 Buscar recopilaciones públicas</h4>

              <input
                className="form-control"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {/* RESULTADOS */}
              <div className="mt-3">
                {publicasFiltradas.map((r) => (
                  <div className="border p-3 mb-2 rounded">
                    <div className="fw-bold">{r.nombre}</div>
                    <small className="text-muted">de {r.usuario}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DETALLES */}
          {seleccionada && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="fw-bold">{seleccionada.nombre}</h3>
                <p className="text-muted">{seleccionada.descripcion}</p>

                <span className={`badge ${seleccionada.publica ? "bg-success" : "bg-secondary"}`}>
                  {seleccionada.publica ? "Pública" : "Privada"}
                </span>

                {/* BOTONES CRUD */}
                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setModoEdicion(true);
                      setForm(seleccionada);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => eliminarRecopilacion(seleccionada.id)}
                  >
                    Eliminar
                  </button>
                </div>

                {/* CANCIONES */}
                <h5 className="mt-4">🎧 Canciones</h5>
                <ul className="list-group">
                  {seleccionada.canciones.map((c, idx) => (
                    <li className="list-group-item">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Recopilaciones;
