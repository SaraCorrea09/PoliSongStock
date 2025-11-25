import React, { useState, useEffect, useRef } from "react";

function GestionVinilos() {
  const usuarioRaw = localStorage.getItem("usuarioLogeado");
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;
  const usuarioId = usuario?.usuario_id ?? null;

  const [vinilos, setVinilos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    artista: "",
    anio: "",
    precio: "",
    cantidad: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [viniloAEliminar, setViniloAEliminar] = useState(null);

  const API_URL = "http://localhost:5000/api/vinilos";

  const toastRef = useRef(null);

  // ==========================
  // Cargar vinilos
  // ==========================
  useEffect(() => {
    if (!usuarioId) return;
    recargar();
  }, [usuarioId]);

  const recargar = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((todos) => {
        setVinilos(todos.filter((v) => v.usuario_id == usuarioId));
      });
  };

  // ==========================
  // Mostrar toast
  // ==========================
  const mostrarToast = (mensaje, tipo = "success") => {
    const toast = toastRef.current;
    toast.querySelector(".toast-body").innerText = mensaje;

    toast.classList.remove("bg-success", "bg-danger");
    toast.classList.add(tipo === "success" ? "bg-success" : "bg-danger");

    const bsToast = new window.bootstrap.Toast(toast);
    bsToast.show();
  };

  // ==========================
  // Input handler
  // ==========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================
  // Agregar vinilo
  // ==========================
  const agregarVinilo = async (e) => {
    e.preventDefault();

    const nuevo = {
      ...form,
      anio: Number(form.anio),
      precio: Number(form.precio),
      cantidad: Number(form.cantidad),
      usuario_id: usuarioId,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });

    if (res.ok) {
      recargar();
      limpiarForm();
      mostrarToast("Vinilo agregado correctamente");
    } else {
      mostrarToast("Error al agregar vinilo", "danger");
    }
  };

  // ==========================
  // Cargar datos para editar
  // ==========================
  const comenzarEdicion = (vinilo) => {
    setEditandoId(vinilo.vinilo_id);
    setForm({
      nombre: vinilo.nombre,
      artista: vinilo.artista,
      anio: vinilo.anio,
      precio: vinilo.precio,
      cantidad: vinilo.cantidad,
    });
  };

  // ==========================
  // Guardar edición
  // ==========================
  const guardarEdicion = async () => {
    const actualizado = {
      ...form,
      anio: Number(form.anio),
      precio: Number(form.precio),
      cantidad: Number(form.cantidad),
    };

    const res = await fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizado),
    });

    if (res.ok) {
      recargar();
      limpiarForm();
      setEditandoId(null);
      mostrarToast("Vinilo actualizado correctamente");
    } else {
      mostrarToast("Error al actualizar vinilo", "danger");
    }
  };

  // ==========================
  // Eliminar con modal
  // ==========================
  const confirmarEliminar = (vinilo) => {
    setViniloAEliminar(vinilo);
    const modal = new window.bootstrap.Modal(
      document.getElementById("modalEliminar")
    );
    modal.show();
  };

  const eliminarVinilo = async () => {
    const res = await fetch(`${API_URL}/${viniloAEliminar.vinilo_id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      recargar();
      mostrarToast("Vinilo eliminado");
    } else {
      mostrarToast("No se pudo eliminar el vinilo", "danger");
    }

    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("modalEliminar")
    );
    modal.hide();

    setViniloAEliminar(null);
  };

  // ==========================
  // Utilidades
  // ==========================
  const limpiarForm = () => {
    setForm({ nombre: "", artista: "", anio: "", precio: "", cantidad: "" });
  };

  // ==========================
  // Render
  // ==========================
  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Gestionar mis Vinilos 💿</h1>

      {/* TOAST */}
      <div
        className="toast position-fixed top-0 end-0 m-4 text-white"
        ref={toastRef}
        role="alert"
      >
        <div className="toast-body">Mensaje</div>
      </div>

      {/* MODAL ELIMINAR */}
      <div
        className="modal fade"
        id="modalEliminar"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirmar eliminación</h5>
            </div>
            <div className="modal-body">
              ¿Seguro que deseas eliminar el vinilo{" "}
              <strong>{viniloAEliminar?.nombre}</strong>?
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={eliminarVinilo}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* FORM */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h4 className="fw-bold mb-3">
              {editandoId ? "Editar Vinilo" : "Agregar Vinilo"}
            </h4>

            <input name="nombre" type="text" className="form-control mb-3" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
            <input name="artista" type="text" className="form-control mb-3" placeholder="Artista" value={form.artista} onChange={handleChange} />
            <input name="anio" type="number" className="form-control mb-3" placeholder="Año" value={form.anio} onChange={handleChange} />
            <input name="precio" type="number" className="form-control mb-3" placeholder="Precio" value={form.precio} onChange={handleChange} />
            <input name="cantidad" type="number" className="form-control mb-3" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} />

            {editandoId ? (
              <>
                <button className="btn btn-warning w-100" onClick={guardarEdicion}>
                  Guardar Cambios
                </button>
                <button
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => {
                    setEditandoId(null);
                    limpiarForm();
                  }}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button className="btn btn-dark w-100" onClick={agregarVinilo}>
                Guardar Vinilo
              </button>
            )}
          </div>
        </div>

        {/* TABLA */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h4 className="fw-bold mb-3">Mis Vinilos Publicados</h4>

            {vinilos.length === 0 ? (
              <p className="text-muted">No tienes vinilos publicados.</p>
            ) : (
              <table className="table table-striped text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Artista</th>
                    <th>Año</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vinilos.map((v) => (
                    <tr key={v.vinilo_id}>
                      <td>{v.nombre}</td>
                      <td>{v.artista}</td>
                      <td>{v.anio}</td>
                      <td>${v.precio}</td>
                      <td>{v.cantidad}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => comenzarEdicion(v)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => confirmarEliminar(v)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionVinilos;
