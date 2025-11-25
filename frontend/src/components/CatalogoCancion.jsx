import React, { useEffect, useState } from "react";
import { esAdmin } from "../utils/auth";
import { agregarAlCarrito } from "../utils/carrito";
import ToastCarrito from "../components/ToastCarrito";

function CatalogoCancion() {
  const [canciones, setCanciones] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [compradas, setCompradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, mensaje: "", tipo: "" });
  

  const usuarioId = Number(localStorage.getItem("usuarioId"));
  const usuarioEsAdmin = esAdmin();

  // ------------------------------------------------------
  // ESTADO FILTROS
  // ------------------------------------------------------
  const [filtros, setFiltros] = useState({
    nombre: "",
    artista: "",
    genero: "",
    precioMin: "",
    precioMax: "",
  });

  const handleFiltro = (e) => {
    setFiltros({ ...filtros, [ e.target.name ]: e.target.value });
  };

  const aplicarFiltros = () => {
    let lista = [...canciones];

    if (filtros.nombre)
      lista = lista.filter((x) =>
        x.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      );

    if (filtros.artista)
      lista = lista.filter((x) =>
        x.artista.toLowerCase().includes(filtros.artista.toLowerCase())
      );

    if (filtros.genero)
      lista = lista.filter((x) =>
        x.genero.toLowerCase().includes(filtros.genero.toLowerCase())
      );

    if (filtros.precioMin)
      lista = lista.filter((x) => Number(x.precio) >= Number(filtros.precioMin));

    if (filtros.precioMax)
      lista = lista.filter((x) => Number(x.precio) <= Number(filtros.precioMax));

    setFiltradas(lista);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, canciones]);

  // ------------------------------------------------------
  // ESTADO MODALES
  // ------------------------------------------------------
  const [nueva, setNueva] = useState({
    nombre: "",
    artista: "",
    genero: "",
    duracion: "",
    tamano_kb: "",
    calidad_kbps: "",
    precio: "",
    usuario_vendedor_id: usuarioId,
  });

  const [editando, setEditando] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (editando) {
      setEditando({ ...editando, [name]: value });
    } else {
      setNueva({ ...nueva, [name]: value });
    }
  };

  // ------------------------------------------------------
  // CARGAR CANCIONES
  // ------------------------------------------------------
  const cargarCanciones = () => {
    fetch("http://localhost:5000/api/canciones/")
      .then((res) => res.json())
      .then((data) => {
        const adaptadas = (Array.isArray(data) ? data : []).map((c) => ({
          id: c.id,
          nombre: c.nombre,
          artista: c.artista,
          genero: c.genero,
          precio: c.precio,
          duracion: c.duracion,
          tamano_kb: c.tamano_kb,
          calidad_kbps: c.calidad_kbps,
          vendedor_id: c.vendedor_id || usuarioId,
        }));

        setCanciones(adaptadas);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    cargarCanciones();
  }, []);

  // ------------------------------------------------------
  // Cargar compras
  // ------------------------------------------------------
  useEffect(() => {
    if (!usuarioId) return;

    fetch(`http://localhost:5000/api/traer-compras-canciones/comprador/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => {
        const ids = (data.compras || []).map((c) => c.cancion_id);
        setCompradas(ids);
      })
      .catch((err) => console.error("Error cargando compras:", err));
  }, [usuarioId]);

  const yaComprada = (id) => compradas.includes(id);

  // ------------------------------------------------------
  // CREAR
  // ------------------------------------------------------
  const mostrarToast = (mensaje, tipo = "success") => {
    setToast({ show: true, mensaje, tipo });
    setTimeout(() => setToast({ show: false, mensaje: "", tipo: "" }), 2500);
  };

  const crearCancion = async () => {
    try {
      const payload = {
        ...nueva,
        usuario_vendedor_id: usuarioId,
      };

      const res = await fetch("http://localhost:5000/api/canciones/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.ok) {
        mostrarToast("Error: " + data.error, "error");
        return;
      }

      document.getElementById("btnCerrarModalCrear").click();

      setNueva({
        nombre: "",
        artista: "",
        genero: "",
        duracion: "",
        tamano_kb: "",
        calidad_kbps: "",
        precio: "",
        usuario_vendedor_id: usuarioId,
      });

      cargarCanciones();
      mostrarToast("Canción creada con éxito!");
    } catch {
      mostrarToast("Error al crear canción", "error");
    }
  };

  // ------------------------------------------------------
  // EDITAR
  // ------------------------------------------------------
  const abrirEditar = (c) => {
    setEditando({
      id: c.id,
      nombre: c.nombre,
      artista: c.artista,
      genero: c.genero,
      duracion: c.duracion,
      tamano_kb: c.tamano_kb,
      calidad_kbps: c.calidad_kbps,
      precio: c.precio,
      vendedor_id: usuarioId,
    });
  };

  const editarCancionFn = async () => {
    try {
      const payload = {
        nombre: editando.nombre,
        artista: editando.artista,
        genero: editando.genero,
        duracion: editando.duracion,
        tamano_kb: editando.tamano_kb,
        calidad_kbps: editando.calidad_kbps,
        precio: editando.precio,
        vendedor_id: usuarioId,
      };

      const respuesta = await fetch(`http://localhost:5000/api/canciones/${editando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await respuesta.json();

      if (!data.ok) {
        mostrarToast("Error: " + data.error, "error");
        return;
      }

      document.getElementById("btnCerrarModalEditar").click();
      setEditando(null);
      cargarCanciones();
      mostrarToast("Canción editada con éxito!");

    } catch {
      mostrarToast("Error al editar canción", "error");
    }
  };

  // ------------------------------------------------------
  // ELIMINAR
  // ------------------------------------------------------
  
  const eliminarCancion = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta canción?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/canciones/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.ok) {
        mostrarToast("Error: " + data.error, "error");
        return;
      }

      cargarCanciones();
      mostrarToast("Canción eliminada!");

    } catch {
      mostrarToast("Error al eliminar canción", "error");
    }
  };

  if (loading) return <p>Cargando canciones…</p>;

  return (
    <div className="container mt-4">

      <ToastCarrito show={toast.show} mensaje={toast.mensaje} tipo={toast.tipo} />

      {/* BOTÓN CREAR */}
      {usuarioEsAdmin && (
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalCrearCancion">
            <i className="fa-solid fa-plus"></i> Crear Canción
          </button>
        </div>
      )}

      <h2 className="fw-bold mb-4 text-center">
        <i className="fa-solid fa-music"></i> Catálogo de Canciones
      </h2>

      {/* FILTROS */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-3">

          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              placeholder="Filtrar por nombre"
              className="form-control"
              value={filtros.nombre}
              onChange={handleFiltro}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              name="artista"
              placeholder="Filtrar por artista"
              className="form-control"
              value={filtros.artista}
              onChange={handleFiltro}
            />
          </div>

          <div className="col-md-2">
            <input
              type="text"
              name="genero"
              placeholder="Género"
              className="form-control"
              value={filtros.genero}
              onChange={handleFiltro}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="precioMin"
              placeholder="Precio min"
              className="form-control"
              value={filtros.precioMin}
              onChange={handleFiltro}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="precioMax"
              placeholder="Precio max"
              className="form-control"
              value={filtros.precioMax}
              onChange={handleFiltro}
            />
          </div>

        </div>
      </div>

      {/* LISTADO */}
      <div className="row">
        {filtradas.map((c) => (
          <div key={c.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">

              <div className="bg-dark text-white d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                Sin imagen
              </div>

              <div className="card-body">
                <h5 className="fw-bold">{c.nombre}</h5>
                <p>
                  <strong>Artista:</strong> {c.artista}<br />
                  <strong>Género:</strong> {c.genero}<br />
                  <strong>Precio:</strong> ${c.precio}
                </p>

                <p className="text-muted small">
                  Dur: {c.duracion} • {c.tamano_kb} KB • {c.calidad_kbps} kbps
                </p>

                {usuarioEsAdmin ? (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning w-50"
                      data-bs-toggle="modal"
                      data-bs-target="#modalEditarCancion"
                      onClick={() => abrirEditar(c)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger w-50"
                      onClick={() => eliminarCancion(c.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <>
                    {yaComprada(c.id) ? (
                      <button className="btn btn-secondary w-100" disabled>
                        Ya comprada
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() =>
                          agregarAlCarrito(
                            {
                              id: c.id,
                              nombre: c.nombre,
                              artista: c.artista,
                              precio: c.precio,
                              vendedor_id: c.vendedor_id,
                              tipo: "cancion",
                            },
                            "cancion"
                          )
                        }
                      >
                        Agregar al carrito
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALES — CREAR Y EDITAR (iguales a los tuyos, no los modifico) */}

      {/* MODAL CREAR */}
      <div className="modal fade" id="modalCrearCancion" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Crear Canción</h5>
              <button id="btnCerrarModalCrear" type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {["nombre", "artista", "genero", "duracion", "tamano_kb", "calidad_kbps", "precio"].map((campo) => (
                <div className="mb-2" key={campo}>
                  <label className="form-label">{campo}</label>
                  <input
                    type="text"
                    name={campo}
                    className="form-control"
                    value={nueva[campo]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-success" onClick={crearCancion}>Guardar</button>
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL EDITAR */}
      <div className="modal fade" id="modalEditarCancion" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Editar Canción</h5>
              <button id="btnCerrarModalEditar" type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {editando &&
                ["nombre", "artista", "genero", "duracion", "tamano_kb", "calidad_kbps", "precio"].map((campo) => (
                  <div className="mb-2" key={campo}>
                    <label className="form-label">{campo}</label>
                    <input
                      type="text"
                      name={campo}
                      className="form-control"
                      value={editando[campo]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-warning" onClick={editarCancionFn}>Guardar cambios</button>
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default CatalogoCancion;
