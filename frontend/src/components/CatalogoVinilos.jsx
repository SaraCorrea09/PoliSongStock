import { useState, useEffect } from "react";

function CatalogoVinilos() {
  const [vinilos, setVinilos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtros, setFiltros] = useState({
    genero: "",
    precio_min: "",
    precio_max: "",
    disponible: ""
  });

  // API temporal (te la dejo mientras haces la tuya en Flask)
  const API_TEMPORAL = "https://mocki.io/v1/7f2f20f3-c59d-4b3c-a0c7-3c2a4e8c79b2";

  // Controlar cambios en los filtros
  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Construcción dinámica del query
  const construirQuery = () => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== "") params.append(key, value);
    });
    return params.toString();
  };

  const buscarVinilos = async () => {
    try {
      setLoading(true);

      const query = construirQuery();
      const url = query
        ? `${API_TEMPORAL}?${query}`
        : API_TEMPORAL;

      console.log("API llamada:", url);

      const response = await fetch(url);
      const data = await response.json();

      setVinilos(data);
    } catch (error) {
      console.error("Error obteniendo vinilos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar catálogo al inicio
  useEffect(() => {
    buscarVinilos();
  }, []);

  return (
    <div className="container py-4">

      {/* TÍTULO */}
      <h1 className="text-center fw-bold mb-4" style={{ fontSize: "2.7rem" }}>
        <i class="fa-solid fa-compact-disc"></i> Catálogo de Vinilos Premium
      </h1>
      <p className="text-center text-muted mb-4">
        Explora colecciones únicas, filtra por género, precio y disponibilidad.
      </p>

      {/* FILTROS */}
      <div className="card p-4 shadow-lg mb-5" style={{ borderRadius: "20px" }}>
        <h5 className="fw-bold mb-3">Filtros avanzados</h5>

        <div className="row g-3">

          <div className="col-md-3">
            <input
              type="text"
              name="genero"
              className="form-control"
              placeholder="Género (Rock, Pop...)"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              name="precio_min"
              className="form-control"
              placeholder="Precio mínimo"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              name="precio_max"
              className="form-control"
              placeholder="Precio máximo"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <select
              name="disponible"
              className="form-select"
              onChange={handleChange}
            >
              <option value="">Disponibilidad</option>
              <option value="true">Disponible</option>
              <option value="false">Agotado</option>
            </select>
          </div>

        </div>

        <div className="text-end mt-4">
          <button className="btn btn-dark px-4 py-2" onClick={buscarVinilos}>
            Aplicar filtros 🔍
          </button>
        </div>
      </div>

      {/* LISTADO */}
      {loading ? (
        <h3 className="text-center">Cargando vinilos...</h3>
      ) : vinilos.length === 0 ? (
        <p className="text-center text-danger fw-bold">
          No hay vinilos que coincidan con los filtros.
        </p>
      ) : (
        <div className="row g-4">

          {vinilos.map((v) => (
            <div className="col-md-4 col-lg-3" key={v.vinilo_id}>
              <div
                className="card shadow-sm h-100"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "180px",
                    background: "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "3rem"
                  }}
                >
                  🎧
                </div>

                <div className="card-body">
                  <h5 className="fw-bold">{v.nombre}</h5>
                  <p className="text-muted mb-1">{v.artista}</p>
                  <p className="mb-1">Año: {v.anio}</p>

                  <p className="fw-bold fs-5 text-success">
                    ${v.precio}
                  </p>

                  <span
                    className={`badge ${
                      v.cantidad > 0 ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {v.cantidad > 0 ? "Disponible" : "Agotado"}
                  </span>
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
