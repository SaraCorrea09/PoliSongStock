import React, { useEffect, useState } from "react";

// ======================================================
// TOAST VISUAL SIN ARCHIVOS EXTERNOS (Bootstrap)
// ======================================================
function Toast({ type = "success", message }) {
  if (!message) return null;

  return (
    <div
      className={`toast align-items-center text-white bg-${type} border-0 show`}
      role="alert"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "250px",
        borderRadius: "8px",
        padding: "10px"
      }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
}

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================
function Recopilaciones() {
  const usuarioId = localStorage.getItem("usuarioId");

  const [misRecop, setMisRecop] = useState([]);
  const [publicas, setPublicas] = useState([]);
  const [compras, setCompras] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toasts
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  // Form
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    publica: true,
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [seleccionada, setSeleccionada] = useState(null);
  const [busquedaPublicas, setBusquedaPublicas] = useState("");

  // Modals state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, nombre: "" });

  const [showPublicModal, setShowPublicModal] = useState(false);
  const [publicModalData, setPublicModalData] = useState(null);

  // ------------------------------------------------------
  // CARGA INICIAL
  // ------------------------------------------------------
  useEffect(() => {
    async function init() {
      if (!usuarioId) {
        setError("Debes iniciar sesión para ver tus recopilaciones.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        await Promise.all([cargarMisRecopilaciones(), cargarPublicas(), cargarCompras()]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [usuarioId]);

  // ------------------------------------------------------
  // FUNCIONES DE CARGA
  // ------------------------------------------------------
  const cargarMisRecopilaciones = async () => {
    const res = await fetch(`http://localhost:5000/api/recopilaciones/mias/${usuarioId}`);
    if (!res.ok) throw new Error("Error cargando tus recopilaciones");
    const d = await res.json();
    setMisRecop(d.recopilaciones || []);
  };

  const cargarPublicas = async () => {
    const res = await fetch(`http://localhost:5000/api/recopilaciones/publicas`);
    if (!res.ok) throw new Error("Error cargando recopilaciones públicas");
    const d = await res.json();
    setPublicas(d.recopilaciones || []);
  };

  const cargarCompras = async () => {
    const res = await fetch(`http://localhost:5000/api/traer-compras-canciones/comprador/${usuarioId}`);
    if (!res.ok) {
      console.warn("No se pudieron cargar compras");
      setCompras([]);
      return;
    }
    const d = await res.json();
    setCompras(d.compras || []);
  };

  // carga una recopilación pública completa (para el modal)
  const cargarPublicaPorId = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/recopilaciones/publicas/${id}`);
      const data = await res.json();
      if (!data.ok) {
        showToast("danger", data.error || "No se pudo cargar la recopilación");
        return;
      }
      setPublicModalData(data.recopilacion);
      setShowPublicModal(true);
    } catch (error) {
      console.error(error);
      showToast("danger", "Error obteniendo la recopilación pública");
    }
  };

  // ------------------------------------------------------
  // CRUD RECOPILACIONES
  // ------------------------------------------------------
  const crearRecopilacion = async () => {
    if (!form.nombre.trim()) return showToast("warning", "El nombre es obligatorio");

    try {
      const res = await fetch(`http://localhost:5000/api/recopilaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: Number(usuarioId),
          nombre: form.nombre,
          descripcion: form.descripcion,
          publica: !!form.publica,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }

      if (!res.ok) {
        console.error("Error servidor:", data);
        return showToast("danger", data.error || "No se pudo crear");
      }

      showToast("success", "Recopilación creada");
      await cargarMisRecopilaciones();
      limpiarFormulario();
    } catch (e) {
      console.error(e);
      showToast("danger", "Error de red al crear");
    }
  };

  const guardarEdicion = async () => {
    if (!form.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/recopilaciones/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, descripcion: form.descripcion, publica: !!form.publica }),
      });

      if (!res.ok) throw new Error();

      await cargarMisRecopilaciones();
      limpiarFormulario();
      setModoEdicion(false);
      showToast("success", "Cambios guardados");
    } catch (e) {
      console.error(e);
      showToast("danger", "No se pudo editar");
    }
  };

  // abrir modal de eliminar (en lugar del alert)
  const openDeleteModal = (rec) => {
    setDeleteTarget({ id: rec.id, nombre: rec.nombre });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const id = deleteTarget.id;
    try {
      const res = await fetch(`http://localhost:5000/api/recopilaciones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      // refrescar
      await cargarMisRecopilaciones();
      await cargarPublicas();

      if (seleccionada?.id === id) setSeleccionada(null);
      setShowDeleteModal(false);
      setDeleteTarget({ id: null, nombre: "" });
      showToast("success", "Recopilación eliminada");
    } catch (e) {
      console.error(e);
      showToast("danger", "No se pudo eliminar");
    }
  };

  const eliminarRecop = async (id) => {
    // función antigua ya no usada directamente; mantenida por compatibilidad
    try {
      const res = await fetch(`http://localhost:5000/api/recopilaciones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await cargarMisRecopilaciones();
      if (seleccionada?.id === id) setSeleccionada(null);
      showToast("success", "Eliminada correctamente");
    } catch (e) {
      console.error(e);
      showToast("danger", "No se pudo eliminar");
    }
  };

  const limpiarFormulario = () => {
    setForm({ id: null, nombre: "", descripcion: "", publica: true });
    setModoEdicion(false);
  };

  // ------------------------------------------------------
  // CANCIONES EN RECOPILACIÓN
  // ------------------------------------------------------
  const agregarCancionARecop = async (recopId, cancion) => {
    try {
      const res = await fetch(`http://localhost:5000/api/recopilaciones/${recopId}/agregar-cancion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancion_id: cancion.cancion_id || cancion.id }),
      });

      if (!res.ok) throw new Error();

      await cargarMisRecopilaciones();

      const rec = (await (await fetch(`http://localhost:5000/api/recopilaciones/mias/${usuarioId}`)).json()).recopilaciones.find((r) => r.id === recopId);

      setSeleccionada(rec);
      showToast("success", "Canción agregada");
    } catch (e) {
      console.error(e);
      showToast("danger", "Error al agregar canción");
    }
  };

  const quitarCancionDeRecop = async (recopId, cancionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/recopilaciones/${recopId}/eliminar-cancion/${cancionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      await cargarMisRecopilaciones();

      const rec = (await (await fetch(`http://localhost:5000/api/recopilaciones/mias/${usuarioId}`)).json()).recopilaciones.find((r) => r.id === recopId);

      setSeleccionada(rec);
      showToast("success", "Canción eliminada");
    } catch (e) {
      console.error(e);
      showToast("danger", "No se pudo quitar canción");
    }
  };

  const seleccionarRecop = (rec) => {
    // Si es tuya
    if (rec.usuario_id === Number(usuarioId)) {
      setSeleccionada(rec);
      setForm({ id: rec.id, nombre: rec.nombre, descripcion: rec.descripcion, publica: !!rec.publica });
      setModoEdicion(false);
      return;
    }

    // Si es pública de otro → cargar desde la API que trae canciones y abrir modal
    cargarPublicaPorId(rec.id);
  };

  // ------------------------------------------------------
  // FILTRO
  // ------------------------------------------------------
  const publicasFiltradas = publicas.filter((r) => r.nombre.toLowerCase().includes(busquedaPublicas.toLowerCase()));

  // ------------------------------------------------------
  // RENDER
  // ------------------------------------------------------
  return (
    <>
      <Toast type={toast.type} message={toast.message} />

      <div className="container py-4">
        <h1 className="fw-bold mb-4">
          <i className="fa-solid fa-sliders"></i> Recopilaciones
        </h1>

        {loading && <div className="alert alert-info">Cargando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {/* IZQUIERDA */}
          <div className="col-md-4">
            {/* FORM */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h5 className="fw-bold">{modoEdicion ? "Editar recopilación" : "Nueva recopilación"}</h5>

                <label className="form-label mt-2">Nombre</label>
                <input className="form-control" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />

                <label className="form-label mt-2">Descripción</label>
                <input className="form-control" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />

                <div className="form-check form-switch mt-3">
                  <input className="form-check-input" type="checkbox" checked={form.publica} onChange={(e) => setForm({ ...form, publica: e.target.checked })} />
                  <label className="form-check-label">Pública</label>
                </div>

                <div className="mt-3 d-flex gap-2">
                  {!modoEdicion ? (
                    <button className="btn btn-success flex-grow-1" onClick={crearRecopilacion}>Crear</button>
                  ) : (
                    <>
                      <button className="btn btn-primary flex-grow-1" onClick={guardarEdicion}>Guardar</button>
                      <button className="btn btn-secondary" onClick={limpiarFormulario}>Cancelar</button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* MIS RECOPILACIONES */}
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold">
                  <i className="fa-solid fa-folder-tree"></i> Mis recopilaciones
                </h6>

                {misRecop.length === 0 && <div className="text-muted">No tienes recopilaciones</div>}

                {misRecop.map((r) => (
                  <div key={r.id} className="p-2 mb-2 border rounded" style={{ cursor: "pointer", background: seleccionada?.id === r.id ? "#f6f9ff" : "#fff" }} onClick={() => seleccionarRecop(r)}>
                    <div className="fw-bold">{r.nombre}</div>
                    <small className="text-muted">{r.descripcion}</small>

                    <div className="mt-1 d-flex gap-2">
                      <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); openDeleteModal(r); }}>
                        Eliminar
                      </button>

                      <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); setModoEdicion(true); setForm({ id: r.id, nombre: r.nombre, descripcion: r.descripcion, publica: !!r.publica }); }}>
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DERECHA */}
          <div className="col-md-8">
            {/* CANCIONES COMPRADAS */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h6 className="fw-bold">
                  <i className="fa-solid fa-circle-play"></i> Canciones compradas
                </h6>

                {compras.length === 0 ? (
                  <div className="text-muted">No tienes canciones compradas</div>
                ) : (
                  <div className="list-group">
                    {compras.map((c) => (
                      <div key={c.compra_id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold">{c.titulo || c.nombre || `#${c.cancion_id}`}</div>
                          <small className="text-muted">{c.artista || c.autor || ""}</small>
                        </div>

                        <div className="d-flex gap-2">
                          <select className="form-select form-select-sm" style={{ width: 180 }} onChange={(e) => { const val = e.target.value; if (!val) return; agregarCancionARecop(Number(val), c); e.target.value = ""; }}>
                            <option value="">Agregar a...</option>
                            {misRecop.map((r) => (
                              <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                          </select>

                          <button className="btn btn-sm btn-outline-success" onClick={() => { if (!seleccionada) return showToast("warning", "Selecciona una recopilación"); agregarCancionARecop(seleccionada.id, c); }}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PUBLICAS */}
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold"><i className="fa-solid fa-magnifying-glass"></i> Recopilaciones públicas</h6>
                  <input className="form-control form-control-sm w-50" placeholder="Buscar..." value={busquedaPublicas} onChange={(e) => setBusquedaPublicas(e.target.value)} />
                </div>

                {publicasFiltradas.length === 0 ? (
                  <div className="text-muted">No se encontraron públicas</div>
                ) : (
                  publicasFiltradas.map((r) => (
                    <div key={r.id} className="border p-2 mb-2 rounded" style={{ cursor: 'pointer' }} onClick={() => cargarPublicaPorId(r.id)}>
                      <div className="fw-bold">{r.nombre}</div>
                      <small className="text-muted">de {r.usuario || r.usuario_name}</small>
                      <div>
                        <small className="text-muted">{r.descripcion}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* DETALLE */}
            {seleccionada ? (
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="fw-bold">{seleccionada.nombre}</h5>
                      <small className="text-muted">{seleccionada.descripcion}</small>
                    </div>

                    <span className={`badge ${seleccionada.publica ? "bg-success" : "bg-secondary"}`}>{seleccionada.publica ? "Pública" : "Privada"}</span>
                  </div>

                  <hr />

                  <h6>Canciones</h6>

                  {seleccionada.canciones?.length > 0 ? (
                    <ul className="list-group">
                      {seleccionada.canciones.map((song) => (
                        <li key={song.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold">{song.nombre}</div>
                            <small className="text-muted">{song.artista}</small>
                          </div>

                          <button className="btn btn-sm btn-outline-danger" onClick={() => quitarCancionDeRecop(seleccionada.id, song.id)}>Eliminar</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted">No hay canciones en esta recopilación</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="alert alert-secondary">Selecciona una recopilación para ver detalles</div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Delete Modal ---------- */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Eliminar recopilación</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que quieres eliminar <strong>{deleteTarget.nombre}</strong>?</p>
                <p className="text-muted small">Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Public Modal (ver canciones de otra persona) ---------- */}
      {showPublicModal && publicModalData && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{publicModalData.nombre} <small className="text-muted">por {publicModalData.usuario}</small></h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowPublicModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">{publicModalData.descripcion}</p>
                <hr />
                <h6>Canciones</h6>
                {publicModalData.canciones?.length > 0 ? (
                  <ul className="list-group">
                    {publicModalData.canciones.map((s) => (
                      <li key={s.cancion_id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{s.nombre}</div>
                          <small className="text-muted">{s.artista} {s.duracion ? `• ${s.duracion}` : ''}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-muted">No hay canciones públicas en esta recopilación</div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPublicModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Recopilaciones;
