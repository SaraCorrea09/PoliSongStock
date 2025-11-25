import React, { useEffect, useState } from "react";
import { esAdmin } from "../utils/auth";
import { agregarAlCarrito } from "../utils/carrito";

function CatalogoCancion() {
  const [canciones, setCanciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Para el CRUD de Admin
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    artista: "",
    genero: "",
    precio: 0,
    duracion: "",
    tamano_mb: "",
    calidad_kbps: "",
    imagen: null,
  });

  const [mostrarForm, setMostrarForm] = useState(false);

  // ============================
  // Cargar canciones
  // ============================
  const cargarCanciones = () => {
    fetch("http://localhost:5000/api/canciones/")
      .then((res) => res.json())
      .then((data) => {
        const cancionesAdaptadas = (Array.isArray(data) ? data : []).map((c) => ({
          id: c.id,
          nombre: c.nombre || c.titulo || "",
          artista: c.artista || c.autor || "",
          genero: c.genero || "",
          precio: c.precio || c.precio_cancion || 0,
          duracion: c.duracion || "",
          tamano_mb: c.tamano_mb || "",
          calidad_kbps: c.calidad_kbps || "",
          imagen: c.imagen || c.imagen_base64 || null,
          vendedor_id: c.vendedor_id || c.usuario_id || null,
        }));

        setCanciones(cancionesAdaptadas);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando canciones:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarCanciones();
  }, []);

  // ============================
  // CRUD PARA ADMINS
  // ============================
const guardarCancion = async () => {
  const method = modoEdicion ? "PUT" : "POST";
  const url = modoEdicion
    ? `http://localhost:5000/api/canciones/${form.id}`
    : `http://localhost:5000/api/canciones`;

  // Conversión correcta MB → KB
  const tamanoKB = Number(form.tamano_mb) * 1024;

  // Para POST usa usuario_vendedor_id
  // Para PUT usa vendedor_id
  const dataEnviar = {
    nombre: form.nombre,
    artista: form.artista,
    genero: form.genero,
    duracion: form.duracion,
    tamano_kb: tamanoKB,
    calidad_kbps: Number(form.calidad_kbps),
    precio: Number(form.precio),
    ...(modoEdicion
      ? { vendedor_id: form.vendedor_id || 1 } // PUT
      : { usuario_vendedor_id: form.vendedor_id || 1 } // POST
    ),
  };

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataEnviar),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Error backend:", err);
      alert("Error al guardar la canción");
      return;
    }

    setMostrarForm(false);
    setModoEdicion(false);
    cargarCanciones();
  } catch (err) {
    console.error("Error guardando:", err);
    alert("Error al guardar");
  }
};
  const eliminarCancion = async (id) => {
    if (!window.confirm("¿Eliminar esta canción?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/canciones/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Error eliminando canción");
        return;
      }

      cargarCanciones();
    } catch (err) {
      console.error(err);
      alert("Error eliminando canción");
    }
  };

  const abrirEdicion = (c) => {
    setForm(c);
    setModoEdicion(true);
    setMostrarForm(true);
  };

  const abrirNuevo = () => {
    setForm({
      id: null,
      nombre: "",
      artista: "",
      genero: "",
      precio: 0,
      duracion: "",
      tamano_mb: "",
      calidad_kbps: "",
      imagen: null,
    });
    setModoEdicion(false);
    setMostrarForm(true);
  };

  // ============================
  // Render
  // ============================
  if (loading) return <p className="text-center">Cargando canciones...</p>;
  if (canciones.length === 0) return <p className="text-center">No hay canciones disponibles.</p>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 text-center">
        <i className="fa-solid fa-music"></i> Catálogo de Canciones
      </h2>

      {/* ======================= */}
      {/* FORMULARIO ADMIN */}
      {/* ======================= */}
      {esAdmin() && (
        <>
          <button className="btn btn-success mb-3" onClick={abrirNuevo}>
            <i className="fa-solid fa-plus"></i> Nueva Canción
          </button>

          {mostrarForm && (
            <div className="card mb-4 p-3 shadow">
              <h5 className="fw-bold">{modoEdicion ? "Editar Canción" : "Nueva Canción"}</h5>

              <input
                className="form-control mt-2"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Artista"
                value={form.artista}
                onChange={(e) => setForm({ ...form, artista: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Género"
                value={form.genero}
                onChange={(e) => setForm({ ...form, genero: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Precio"
                type="number"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
              />

              <input
                className="form-control mt-2"
                placeholder="Duración"
                value={form.duracion}
                onChange={(e) => setForm({ ...form, duracion: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Tamaño en MB"
                value={form.tamano_mb}
                onChange={(e) => setForm({ ...form, tamano_mb: e.target.value })}
              />

              <input
                className="form-control mt-2"
                placeholder="Calidad en kbps"
                value={form.calidad_kbps}
                onChange={(e) => setForm({ ...form, calidad_kbps: e.target.value })}
              />

              <button className="btn btn-primary mt-3" onClick={guardarCancion}>
                Guardar
              </button>
              <button
                className="btn btn-secondary mt-3 ms-2"
                onClick={() => setMostrarForm(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </>
      )}

      <div className="row">
        {canciones.map((cancion) => (
          <div key={cancion.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {cancion.imagen ? (
                <img
                  src={
                    cancion.imagen.startsWith("data:")
                      ? cancion.imagen
                      : `data:image/png;base64,${cancion.imagen}`
                  }
                  className="card-img-top"
                  alt={cancion.nombre}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-dark text-white"
                  style={{ height: "200px" }}
                >
                  Sin imagen
                </div>
              )}

              <div className="card-body">
                <h5 className="fw-bold">{cancion.nombre}</h5>
                <p>
                  <strong>Artista:</strong> {cancion.artista} <br />
                  <strong>Género:</strong> {cancion.genero} <br />
                  <strong>Precio:</strong> ${cancion.precio}
                </p>

                <p className="text-muted small">
                  Duración: {cancion.duracion} • {cancion.tamano_mb} MB •{" "}
                  {cancion.calidad_kbps} kbps
                </p>

                {/* ============================== */}
                {/* OPCIONES PARA ADMIN */}
                {/* ============================== */}
                {esAdmin() && (
                  <>
                    <button
                      className="btn btn-warning w-100 mb-2"
                      onClick={() => abrirEdicion(cancion)}
                    >
                      <i className="fa-solid fa-pen"></i> Editar
                    </button>

                    <button
                      className="btn btn-danger w-100"
                      onClick={() => eliminarCancion(cancion.id)}
                    >
                      <i className="fa-solid fa-trash"></i> Eliminar
                    </button>
                  </>
                )}

                {/* ============================== */}
                {/* OPCIONES PARA CLIENTES */}
                {/* ============================== */}
                {!esAdmin() && (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() =>
                      agregarAlCarrito(
                        {
                          id: cancion.id,
                          nombre: cancion.nombre,
                          artista: cancion.artista,
                          precio: cancion.precio,
                          vendedor_id: cancion.vendedor_id,
                          tipo: "cancion",
                          cantidad: 1,
                          precio_total: cancion.precio,
                        },
                        "cancion"
                      )
                    }
                  >
                    <i className="fa-solid fa-cart-plus"></i> Agregar al carrito
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoCancion;
