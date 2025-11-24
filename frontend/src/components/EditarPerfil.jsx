import React, { useEffect, useState } from "react";

function EditarPerfil() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado para los toasts
  const [toast, setToast] = useState({ mensaje: "", tipo: "", visible: false });

  useEffect(() => {
    const usuarioRaw = localStorage.getItem("usuarioLogeado");
    if (!usuarioRaw) {
      setToast({ mensaje: "No se encontró información del usuario", tipo: "error", visible: true });
      setLoading(false);
      return;
    }

    try {
      const usuario = JSON.parse(usuarioRaw);
      setNombre(usuario.nombre || "");
      setCorreo(usuario.correo || "");
      setTelefono(usuario.telefono || "");
    } catch (err) {
      console.error("Error parseando usuarioLogeado", err);
      setToast({ mensaje: "Error cargando datos del usuario", tipo: "error", visible: true });
    } finally {
      setLoading(false);
    }
  }, []);

  const validarTelefono = (tel) => /^\d{7,15}$/.test(tel);

  const showToast = (mensaje, tipo) => {
    setToast({ mensaje, tipo, visible: true });
    setTimeout(() => {
      setToast({ mensaje: "", tipo: "", visible: false });
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !correo || !telefono) {
      showToast("Todos los campos son obligatorios", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      showToast("Correo inválido", "error");
      return;
    }

    if (!validarTelefono(telefono)) {
      showToast("Teléfono inválido: solo números, entre 7 y 15 dígitos", "error");
      return;
    }

    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
      showToast("Usuario no identificado", "error");
      return;
    }

    const data = { nombre, correo, telefono };
    if (contrasenaNueva) {
      data.contrasena = contrasenaNueva; // 
    }

    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${usuarioId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.ok) {
        showToast("Perfil actualizado correctamente", "success");

        // Actualizamos localStorage con los nuevos datos
        const usuarioActualizado = {
          ...JSON.parse(localStorage.getItem("usuarioLogeado")),
          nombre,
          correo,
          telefono,
        };
        localStorage.setItem("usuarioLogeado", JSON.stringify(usuarioActualizado));

        setContrasenaNueva("");
      } else {
        showToast(result.error || "Error al actualizar perfil", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error conectándose con el servidor", "error");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="container col-12 col-md-8 col-lg-4 mt-4 mb-5">
      <div className="card shadow-lg border-0 rounded-4" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="card-body p-4">
                    <div className="text-center mb-4">
            <div className="rounded-circle mx-auto d-flex justify-content-center align-items-center"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "#0d6efd22",
                  fontSize: "40px",
                }}
              >
                <i class="fa-solid fa-pen-to-square"></i>
            </div> 
              <h3 className="fw-bold mt-3">Editar Perfil</h3>
       
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre completo</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <input
                type="email"
                className="form-control form-control-lg rounded-3"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Teléfono</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <hr />

            <div className="mb-3">
              <label className="form-label fw-semibold">Nueva contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg rounded-3"
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
                placeholder="Ingresa la nueva contraseña"
              />
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 py-2 mt-2 rounded-3 fw-semibold"
            >
              Guardar cambios
            </button>
          </form>

          {/* TOAST */}
          {toast.visible && (
            <div
              className={`toast-message mt-3 text-center py-2 rounded ${
                toast.tipo === "success" ? "bg-success text-white" : "bg-danger text-white"
              }`}
              style={{
                opacity: toast.visible ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
              }}
            >
              {toast.mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;
