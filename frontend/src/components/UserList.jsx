import { useEffect, useState } from "react";

function UserList({ onRegistrar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [filtro, setFiltro] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    rol: "",
  });

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/usuarios");
      const data = await res.json();
      if (data.ok) setUsuarios(data.usuarios);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const confirmarEliminarUsuario = async () => {
    try {
      await fetch(`http://localhost:5000/api/usuarios/${usuarioAEliminar}`, {
        method: "DELETE",
      });

      setMensaje("🗑 Usuario eliminado correctamente");
      setTimeout(() => setMensaje(""), 2500);

      setUsuarioAEliminar(null);
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error eliminando usuario");
      setTimeout(() => setMensaje(""), 2500);
    }
  };

  const abrirModalEditar = (u) => {
    setEditUser(u);
    setForm({
      nombre: u.nombre,
      correo: u.correo,
      telefono: u.telefono,
      rol: u.rol,
    });
  };

  const guardarEdicion = async () => {
    if (!editUser) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/usuarios/${editUser.usuario_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.ok) {
        setMensaje("✏ Usuario actualizado correctamente");
        setTimeout(() => setMensaje(""), 2500);

        setEditUser(null);
        cargarUsuarios();
      } else {
        setMensaje("❌ Error: " + data.error);
        setTimeout(() => setMensaje(""), 2500);
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al conectar con el servidor");
      setTimeout(() => setMensaje(""), 2500);
    }
  };

  // ASCENDER A ADMIN (solo para buyer o seller)
  const ascenderAAdmin = async (u) => {
    try {
      const res = await fetch(`http://localhost:5000/api/usuarios/${u.usuario_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: u.nombre,
          correo: u.correo,
          telefono: u.telefono,
          rol: "admin",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setMensaje(`⭐ ${u.nombre} ahora es administrador`);
        setTimeout(() => setMensaje(""), 2500);
        cargarUsuarios();
      } else {
        setMensaje("❌ " + (data.error || "No se pudo ascender"));
        setTimeout(() => setMensaje(""), 2500);
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al ascender usuario");
      setTimeout(() => setMensaje(""), 2500);
    }
  };

  // Cambiar rol genérico (buyer <-> seller) — opcional, no usado si solo quieres ascender
  const cambiarRolBuyerSeller = async (u) => {
    const nuevoRol = u.rol === "buyer" ? "seller" : "buyer";
    try {
      const res = await fetch(`http://localhost:5000/api/usuarios/${u.usuario_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: u.nombre,
          correo: u.correo,
          telefono: u.telefono,
          rol: nuevoRol,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMensaje(`🔄 Rol de ${u.nombre} cambiado a ${nuevoRol}`);
        setTimeout(() => setMensaje(""), 2500);
        cargarUsuarios();
      } else {
        setMensaje("❌ " + (data.error || "No se pudo cambiar rol"));
        setTimeout(() => setMensaje(""), 2500);
      }
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error cambiando rol");
      setTimeout(() => setMensaje(""), 2500);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">

      {/* NOTIFICACIÓN */}
      {mensaje && (
        <div
          className="alert alert-info text-center fw-semibold shadow-sm"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          {mensaje}
        </div>
      )}

      {/* FILTRO */}
      <input
        type="text"
        className="form-control mb-4 shadow-sm"
        placeholder="Buscar usuario por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <div className="row g-4">

        {/* AGREGAR USUARIO */}
        <div className="col-md-4">
          <div
            className="card shadow-sm border-0 p-4 text-center"
            style={{ cursor: "pointer", minHeight: "220px" }}
            onClick={onRegistrar}
          >
            <div>
              <div
                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "70px", height: "70px", fontSize: "32px" }}
              >
                <i className="fa-solid fa-plus"></i>
              </div>
              <h4 className="fw-bold">Agregar Usuario</h4>
              <p className="text-muted">Crear un nuevo usuario</p>
            </div>
          </div>
        </div>

        {/* LISTA */}
        {usuariosFiltrados.map((u) => (
          <div className="col-md-4" key={u.usuario_id}>
            <div className="card shadow-sm border-0 p-3">

              <h4 className="fw-bold">{u.nombre}</h4>
              <p className="mb-1"><i className="fa-solid fa-envelope"></i> {u.correo}</p>
              <p className="mb-1"><i className="fa-solid fa-phone-volume"></i> {u.telefono}</p>
              <p className="text-muted"><i className="fa-solid fa-fingerprint"></i> {u.rol}</p>

              <div className="d-flex gap-2 mt-3">

                <button
                  className="btn btn-warning w-100"
                  onClick={() => abrirModalEditar(u)}
                >
                  <i className="fa-solid fa-user-pen"></i> Editar
                </button>

                <button
                  className="btn btn-danger w-100"
                  onClick={() => setUsuarioAEliminar(u.usuario_id)}
                >
                  <i className="fa-solid fa-trash-can"></i> Eliminar
                </button>
              </div>

              {/* BOTÓN ASCENDER: solo para buyer o seller */}
              {(u.rol === "buyer" || u.rol === "seller") && (
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-success w-100"
                    onClick={() => ascenderAAdmin(u)}
                  >
                    <i className="fa-solid fa-star"></i> Ascender a Admin
                  </button>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {usuarioAEliminar && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">Confirmar eliminación</h5>
                <button
                  className="btn-close"
                  onClick={() => setUsuarioAEliminar(null)}
                ></button>
              </div>

              <div className="modal-body text-center">
                <p className="fw-semibold">
                  ¿Seguro que deseas eliminar este usuario?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setUsuarioAEliminar(null)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-danger"
                  onClick={confirmarEliminarUsuario}
                >
                  Eliminar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editUser && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header bg-warning">
                <h5 className="modal-title fw-bold">Editar Usuario</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditUser(null)}
                ></button>
              </div>

              <div className="modal-body">

                <label className="fw-bold">Nombre</label>
                <input
                  className="form-control mb-3"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />

                <label className="fw-bold">Correo</label>
                <input
                  className="form-control mb-3"
                  value={form.correo}
                  onChange={(e) =>
                    setForm({ ...form, correo: e.target.value })
                  }
                />

                <label className="fw-bold">Teléfono</label>
                <input
                  className="form-control mb-3"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                />

                <label className="fw-bold">Rol</label>
                <select
                  className="form-select"
                  value={form.rol}
                  onChange={(e) =>
                    setForm({ ...form, rol: e.target.value })
                  }
                >
                  <option value="buyer">buyer</option>
                  <option value="seller">seller</option>
                </select>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditUser(null)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-warning"
                  onClick={guardarEdicion}
                >
                  Guardar Cambios
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
