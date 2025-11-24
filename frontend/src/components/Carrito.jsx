import React, { useEffect, useState } from "react";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodo, setMetodo] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  // Obtener usuario desde localStorage igual que AdminPanel
  const usuario = {
    usuario_id: localStorage.getItem("usuarioId"),
    nombre:
      localStorage.getItem("usuarioNombre") ||
      localStorage.getItem("nombreUsuario"),
    rol:
      localStorage.getItem("usuarioRol") ||
      localStorage.getItem("rolDetectado") ||
      localStorage.getItem("rolGuardado"),
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(data);
  }, []);

  const eliminarCancion = (id) => {
    const nuevo = carrito.filter((c) => c.id !== id);
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.setItem("carrito", JSON.stringify([]));
  };

  const total = carrito.length;

  // 👉 Enviar compra a las APIs reales
  const registrarCompra = async () => {
    if (!usuario.usuario_id) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }

    for (const item of carrito) {
      const compra = {
        comprador_id: usuario.usuario_id,
        vendedor_id: item.vendedor_id,
      };

      if (item.tipo === "cancion") {
        compra.cancion_id = item.id;
        await fetch("http://localhost:5000/api/compras-canciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(compra),
        });
      } else if (item.tipo === "vinilo") {
        compra.cancion_id = item.id; // así lo definieron tus compañeros 🤷‍♂️
        await fetch("http://localhost:5000/api/compras-vinilo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(compra),
        });
      }
    }
  };

  const procesarPago = async () => {
    if (!metodo) return;

    await registrarCompra();

    setTimeout(() => {
      setConfirmado(true);
      vaciarCarrito();
      setTimeout(() => setMostrarPago(false), 2000);
    }, 1500);
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4 text-center">🛒 Tu carrito de compras</h1>

      {carrito.length === 0 && (
        <div className="alert alert-info text-center p-4 shadow-sm">
          <h5 className="fw-bold">Tu carrito está vacío</h5>
          <p>Agrega canciones o vinilos desde el catálogo 🎵</p>
        </div>
      )}

      <div className="row g-4">
        {carrito.map((c) => (
          <div className="col-md-6" key={c.id}>
            <div className="card shadow-sm p-3 d-flex flex-row align-items-center">

              <div
                className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center"
                style={{ width: "55px", height: "55px", fontSize: "20px" }}
              >
                {c.tipo === "vinilo" ? "💿" : "🎵"}
              </div>

              <div className="ms-3 flex-grow-1">
                <h5 className="fw-bold mb-1">{c.titulo}</h5>
                <p className="text-muted mb-1">{c.autor}</p>
                {c.duracion && (
                  <small className="text-secondary">
                    Duración: {c.duracion}
                  </small>
                )}
              </div>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => eliminarCancion(c.id)}
              >
                ✖
              </button>
            </div>
          </div>
        ))}
      </div>

      {carrito.length > 0 && (
        <div className="card shadow-sm p-4 mt-5">
          <h4 className="fw-bold mb-3">Resumen del carrito</h4>
          <p className="mb-2">
            Items seleccionados: <strong>{total}</strong>
          </p>

          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-danger flex-grow-1" onClick={vaciarCarrito}>
              Vaciar carrito
            </button>

            <button
              className="btn btn-success flex-grow-1"
              onClick={() => setMostrarPago(true)}
            >
              Comprar ahora ✔
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {mostrarPago && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              {!confirmado ? (
                <>
                  <div className="modal-header bg-dark text-white rounded-top-4">
                    <h5 className="modal-title">💳 Pasarela de Pago</h5>
                    <button
                      className="btn-close btn-close-white"
                      onClick={() => setMostrarPago(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <p className="fw-semibold">Selecciona método de pago:</p>

                    <div className="d-flex flex-column gap-3">
                      <div
                        className={`p-3 rounded-3 border ${
                          metodo === "tarjeta" ? "border-primary" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setMetodo("tarjeta")}
                      >
                        💳 Tarjeta
                      </div>

                      <div
                        className={`p-3 rounded-3 border ${
                          metodo === "nequi" ? "border-primary" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setMetodo("nequi")}
                      >
                        📱 Nequi
                      </div>

                      <div
                        className={`p-3 rounded-3 border ${
                          metodo === "bancolombia" ? "border-primary" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setMetodo("bancolombia")}
                      >
                        🟡 Bancolombia
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setMostrarPago(false)}
                    >
                      Cancelar
                    </button>

                    <button
                      className="btn btn-success"
                      disabled={!metodo}
                      onClick={procesarPago}
                    >
                      Pagar ahora ✔
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-5">
                  <div className="display-3 text-success mb-3">✔</div>
                  <h4 className="fw-bold">¡Pago exitoso!</h4>
                  <p className="text-muted">Tu compra ha sido procesada 🎶</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
