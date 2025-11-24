import React, { useState, useEffect } from "react";

function GestionVinilos() {
  const usuarioId = localStorage.getItem("usuarioId");

  const [vinilos, setVinilos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    artista: "",
    anio: "",
    precio: "",
    cantidad: "",
  });

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("vinilos")) || [];
    setVinilos(guardados.filter((v) => v.vendedor_id == usuarioId));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarVinilo = (e) => {
    e.preventDefault();

    const nuevo = {
      vinilo_id: Date.now(),
      nombre: form.nombre,
      artista: form.artista,
      anio: Number(form.anio),
      precio: Number(form.precio),
      cantidad: Number(form.cantidad),
      vendedor_id: usuarioId,
    };

    const todos = JSON.parse(localStorage.getItem("vinilos")) || [];
    const actualizados = [...todos, nuevo];

    localStorage.setItem("vinilos", JSON.stringify(actualizados));
    setVinilos(actualizados.filter((v) => v.vendedor_id == usuarioId));

    setForm({ nombre: "", artista: "", anio: "", precio: "", cantidad: "" });

    alert("Vinilo agregado correctamente 🎵");
  };

  return (
    <div className="container py-5">

      <h1 className="fw-bold mb-4">Gestionar mis Vinilos 💿</h1>

      <div className="row">
        {/* FORMULARIO */}
        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h4 className="fw-bold mb-3">Agregar Vinilo</h4>

            <form onSubmit={agregarVinilo}>
              <input
                name="nombre"
                type="text"
                className="form-control mb-3"
                placeholder="Nombre del vinilo"
                value={form.nombre}
                onChange={handleChange}
                required
              />

              <input
                name="artista"
                type="text"
                className="form-control mb-3"
                placeholder="Artista"
                value={form.artista}
                onChange={handleChange}
                required
              />

              <input
                name="anio"
                type="number"
                className="form-control mb-3"
                placeholder="Año"
                value={form.anio}
                onChange={handleChange}
                required
              />

              <input
                name="precio"
                type="number"
                className="form-control mb-3"
                placeholder="Precio"
                value={form.precio}
                onChange={handleChange}
                required
              />

              <input
                name="cantidad"
                type="number"
                className="form-control mb-3"
                placeholder="Cantidad disponible"
                value={form.cantidad}
                onChange={handleChange}
                required
              />

              <button className="btn btn-dark w-100 mt-3" type="submit">
                Guardar Vinilo <i className="fa-solid fa-record-vinyl"></i>
              </button>
            </form>
          </div>
        </div>

        {/* LISTA DE VINILOS */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h4 className="fw-bold mb-3">Mis Vinilos Publicados</h4>

            {vinilos.length === 0 ? (
              <p className="text-muted">Aún no has publicado ningún vinilo.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Artista</th>
                      <th>Año</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vinilos.map((v) => (
                      <tr key={v.vinilo_id}>
                        <td>{v.nombre}</td>
                        <td>{v.artista}</td>
                        <td>{v.anio}</td>
                        <td>${v.precio.toLocaleString()}</td>
                        <td>{v.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}

export default GestionVinilos;
