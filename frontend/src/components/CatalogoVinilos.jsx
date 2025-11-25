import { useState, useEffect } from "react";
import { esAdmin } from "../utils/auth";
import { agregarAlCarrito } from "../utils/carrito";
import ToastCarrito from "../components/ToastCarrito";

function CatalogoVinilos() {
  const [vinilos, setVinilos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Valores de filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroArtista, setFiltroArtista] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");


  const [toast, setToast] = useState({ show: false, mensaje: "" });

  const mostrarToast = (msg) => {
    setToast({ show: true, mensaje: msg });
  };

  const buscarVinilos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/api/vinilos/");
      const data = await res.json();
      setVinilos(data);
    } catch (error) {
      console.error("Error obteniendo vinilos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarVinilos();
  }, []);

  // 🔥 APLICAR TODOS LOS FILTROS
  const vinilosFiltrados = vinilos
    .filter((v) => {
      if (filtroNombre.trim() === "") return true;
      return v.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    })
    .filter((v) => {
      if (filtroArtista.trim() === "") return true;
      return v.artista.toLowerCase().includes(filtroArtista.toLowerCase());
    })
    .filter((v) => {
      if (filtroAnio.trim() === "") return true;
      return String(v.anio) === filtroAnio;
    })
    .filter((v) => {
      if (precioMin === "") return true;
      return v.precio >= Number(precioMin);
    })
    .filter((v) => {
      if (precioMax === "") return true;
      return v.precio <= Number(precioMax);
    });

  return (
    <div className="container py-4">
      <ToastCarrito
        show={toast.show}
        mensaje={toast.mensaje}
        onClose={() => setToast({ show: false, mensaje: "" })}
      />

      <h1 className="text-center fw-bold mb-4">
        <i className="fa-solid fa-compact-disc"></i> Catálogo de Vinilos
      </h1>

      {/* 🔥 FILTROS */}
      <div className="card p-3 mb-4 shadow-sm">

        <div className="row g-3">

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por artista"
              value={filtroArtista}
              onChange={(e) => setFiltroArtista(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Año"
              value={filtroAnio}
              onChange={(e) => setFiltroAnio(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Precio mínimo"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Precio máximo"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* LISTADO */}
      {loading ? (
        <h3 className="text-center">Cargando vinilos...</h3>
      ) : (
        <div className="row g-4">
          {vinilosFiltrados.length === 0 && (
            <p className="text-center text-muted">
              No hay vinilos que coincidan con los filtros.
            </p>
          )}

          {vinilosFiltrados.map((v) => (
            <div className="col-md-4 col-lg-3" key={v.vinilo_id}>
              <div className="card shadow-sm h-100">
                <div
                  className="bg-dark text-white d-flex justify-content-center align-items-center"
                  style={{ height: "180px", fontSize: "3rem" }}
                >
                  🎧
                </div>

                <div className="card-body">
                  <h5 className="fw-bold">{v.nombre}</h5>
                  <p className="text-muted">{v.artista}</p>
                  <p>Año: {v.anio}</p>

                  <p className="fw-bold fs-5 text-success">${v.precio}</p>

                  <span
                    className={`badge ${
                      v.cantidad > 0 ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {v.cantidad > 0 ? "Disponible" : "Agotado"}
                  </span>

                  {!esAdmin() && v.cantidad > 0 && (
                    <button
                      className="btn btn-primary w-100 mt-2"
                      onClick={() => {
                        agregarAlCarrito(
                          { ...v, precio: v.precio, tipo: "vinilo" },
                          "vinilo"
                        );
                        mostrarToast("Vinilo agregado al carrito 🎶");
                      }}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Agregar al carrito
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogoVinilos;
