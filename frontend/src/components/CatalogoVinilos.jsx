import { useState, useEffect } from "react";

function CatalogoVinilos() {
  const [vinilos, setVinilos] = useState([]);
  const [filtros, setFiltros] = useState({
    genero: "",
    precio_min: "",
    precio_max: "",
    calidad: "",
    disponible: ""
  });

  // Manejar cambios de los inputs
  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Llamar al backend Flask
  const buscarVinilos = async () => {
    const params = new URLSearchParams(filtros);
    const response = await fetch(`http://localhost:5000/api/vinilos?${params}`);
    const data = await response.json();
    setVinilos(data);
  };

  // Cargar todos los vinilos al iniciar
  useEffect(() => {
    buscarVinilos();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🎵 Catálogo de Vinilos</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          name="genero"
          placeholder="Género"
          onChange={handleChange}
        />
        <input
          type="number"
          name="precio_min"
          placeholder="Precio mínimo"
          onChange={handleChange}
        />
        <input
          type="number"
          name="precio_max"
          placeholder="Precio máximo"
          onChange={handleChange}
        />
        <select name="disponible" onChange={handleChange}>
          <option value="">Disponibilidad</option>
          <option value="true">Disponible</option>
          <option value="false">Agotado</option>
        </select>
        <button onClick={buscarVinilos}>Filtrar</button>
      </div>

      {vinilos.length === 0 ? (
        <p>No hay vinilos que coincidan con los filtros.</p>
      ) : (
        <div>
          {vinilos.map((v) => (
            <div
              key={v.vinilo_id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{v.nombre} - {v.artista}</h3>
              <p>Año: {v.anio}</p>
              <p>Precio: ${v.precio}</p>
              <p>Disponibles: {v.cantidad}</p>
              <p>Vendedor ID: {v.vendedor_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogoVinilos;
