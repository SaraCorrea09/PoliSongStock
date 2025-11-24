// RegistrarUsuario.jsx
import React, { useEffect, useState } from "react";

function RegistrarUsuario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("seller");

  const [estaLogeado, setEstaLogeado] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);

  // --- ESTADO PARA EL MENSAJE DE EXITO ---
  const [mensajeExito, setMensajeExito] = useState("");

  const detectarUsuarioLocal = () => {
    try {
      const usuarioLogeadoRaw = localStorage.getItem("usuarioLogeado");
      let usuarioLogeado = null;

      if (usuarioLogeadoRaw) {
        try {
          usuarioLogeado = JSON.parse(usuarioLogeadoRaw);
        } catch {}
      }

      const rolGuardado = localStorage.getItem("usuarioRol");

      const logeado = !!(usuarioLogeado || rolGuardado);
      const rolDetectado =
        usuarioLogeado?.rol || (rolGuardado ? rolGuardado : null);

      setEstaLogeado(logeado);
      setEsAdmin(rolDetectado === "admin");

      setRol("seller");
    } catch {
      setEstaLogeado(false);
      setEsAdmin(false);
    }
  };

  useEffect(() => {
    detectarUsuarioLocal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rolParaEnviar = esAdmin ? rol : "seller";

    const data = {
      nombre,
      correo,
      telefono,
      contrasena,
      rol: rolParaEnviar,
    };

    try {
      const response = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ok) {
        setNombre("");
        setCorreo("");
        setTelefono("");
        setContrasena("");

        setMensajeExito("🎉 Usuario creado exitosamente");

        setTimeout(() => {
          setMensajeExito("");
        }, 3000);
      } else {
        setMensajeExito("❌ Error al registrar usuario");
        setTimeout(() => setMensajeExito(""), 3000);
      }
    } catch (error) {
      setMensajeExito("❌ Error conectando al servidor");
      setTimeout(() => setMensajeExito(""), 3000);
    }
  };

  return (
    <div className="container col-12 col-md-8 col-lg-4 mt-4 mb-5">

      {/* TOAST / MENSAJE BONITO */}
      {mensajeExito && (
        <div
          className="alert alert-warning text-center fw-semibold rounded-3 shadow-sm"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            animation: "fadeIn 0.3s",
          }}
        >
          {mensajeExito}
        </div>
      )}

      <div
        className="card shadow-lg border-0 rounded-4"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div
              className="rounded-circle mx-auto d-flex justify-content-center align-items-center"
              style={{
                width: "80px",
                height: "80px",
                background: "#0d6efd22",
                fontSize: "40px",
              }}
            >
              <i className="fa-regular fa-address-card"></i>
            </div>

            <h3 className="fw-bold mt-3">Crear cuenta</h3>
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

            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg rounded-3"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            {estaLogeado && esAdmin && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Rol del usuario</label>
                <select
                  className="form-select form-select-lg rounded-3"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value="seller">Seller</option>
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-warning w-100 py-2 mt-2 rounded-3 fw-semibold"
            >
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrarUsuario;
