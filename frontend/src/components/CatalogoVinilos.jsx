import { useState, useEffect } from "react";
import { esAdmin } from "../utils/auth";
import { agregarAlCarrito } from "../utils/carrito";

function CatalogoVinilos() {
  const [vinilos, setVinilos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container py-4">

      <h1 className="text-center fw-bold mb-4">
        <i className="fa-solid fa-compact-disc"></i> Catálogo de Vinilos
      </h1>

      {loading ? (
        <h3 className="text-center">Cargando vinilos...</h3>
      ) : (
        <div className="row g-4">

          {vinilos.map((v) => (
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

                  <span className={`badge ${v.cantidad > 0 ? "bg-success" : "bg-danger"}`}>
                    {v.cantidad > 0 ? "Disponible" : "Agotado"}
                  </span>

                  {/* SOLO CLIENTES (NO ADMINS) */}
                  {!esAdmin() && v.cantidad > 0 && (
                    <button
                      className="btn btn-primary w-100 mt-2"
                      onClick={() =>
                        agregarAlCarrito({ ...v, precio: v.precio }, "vinilo")
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
      )}
    </div>
  );
}

export default CatalogoVinilos;
