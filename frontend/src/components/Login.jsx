import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // ⬅️ IMPORTANTE

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();   // ⬅️ PARA ACTUALIZAR EL CONTEXTO

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: email,
          contrasena: password,
        }),
      });

      const data = await response.json();
      console.log("RESPUESTA DEL BACKEND:", data);

      if (data.ok) {
        // 🔹 Guardar en localStorage (tu código)
        localStorage.setItem("usuarioNombre", data.usuario.nombre);
        localStorage.setItem("usuarioId", data.usuario.usuario_id);
        localStorage.setItem("usuarioRol", data.usuario.rol);
        localStorage.setItem("usuarioLogeado", JSON.stringify(data.usuario));

        // 🔹 Guardar en AuthContext (necesario para que cambie el navbar)
        login({
          nombre: data.usuario.nombre,
          usuario_id: data.usuario.usuario_id,
          rol: data.usuario.rol
        });

        // 🔥 Redirección por rol
        const rol = data.usuario.rol;

        if (rol === "admin") {
          navigate("/adminPanel");
        } else if (rol === "buyer" || rol === "seller") {
          navigate("/userPanel");
        } else {
          setError("Rol desconocido");
        }

      } else {
        setError(data.error || "Credenciales inválidas");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="card shadow-lg border-0 p-4" style={{ width: "380px",  backgroundColor: "#F5F5F5" }}>
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
            <i className="fa-solid fa-headphones"></i>
          </div> 
          <h3 className="fw-bold mt-3">Iniciar Sesión</h3>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Ingresa para continuar al marketplace musical
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo electrónico</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="tucorreo@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger text-center py-2">{error}</div>
          )}

          <button
            className="btn btn-success w-100 btn-lg mt-2"
            type="submit"
            style={{ transition: "0.3s" }}
          >
            Ingresar <i className="fa-solid fa-right-to-bracket"></i>
          </button>
        </form>

        <p className="text-center text-muted mt-3" style={{ fontSize: "14px" }}>
          ¿No tienes una cuenta?{" "}
          <a href="/registrarUsuario" className="text-primary fw-semibold">
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
