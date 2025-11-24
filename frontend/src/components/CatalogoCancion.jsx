import React, { useEffect, useState } from "react";

function CatalogoCanciones() {
  const [canciones, setCanciones] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [recopilaciones, setRecopilaciones] = useState([]);
  const [modalRecopilacion, setModalRecopilacion] = useState(null);

  const usuarioId = localStorage.getItem("usuarioId");

  // ===============================
  // 🔹 Cargar canciones desde API
  // ===============================
  useEffect(() => {
    const cargarCanciones = async () => {
      try {
        const res = await fetch("http://TU_API/canciones"); // <- CAMBIAR CUANDO TENGAS LA API
        const data = await res.json();

        // Si aún no tienes API, usa datos temporales bonitos:
        const fallback = [
          {
            id: 1,
            titulo: "Shine On You",
            autor: "Pink Floyd",
            duracion: "5:12",
            portada: "https://i.imgur.com/bQfQJ2W.jpeg",
            vinilosAsociados: [
              { id: 22, nombre: "The Best of Pink Floyd", precio: 89000 }
            ]
          },
          {
            id: 2,
            titulo: "Waves",
            autor: "Joji",
            duracion: "3:25",
            portada: "https://i.imgur.com/x6H6owT.jpeg",
            vinilosAsociados: []
          },
          {
            id: 3,
            titulo: "Lost In Yesterday",
            autor: "Tame Impala",
            duracion: "4:08",
            portada: "https://i.imgur.com/OwZb1Bt.jpeg",
            vinilosAsociados: [
              { id: 51, nombre: "Slow Rush Vinyl", precio: 120000 }
            ]
          }
        ];

        setCanciones(data || fallback);
      } catch (e) {
        console.error("Error cargando canciones:", e);
      }
    };

    cargarCanciones();

    // Recopilaciones del usuario
    const recs = JSON.parse(localStorage.getItem("recopilaciones")) || [];
    setRecopilaciones(recs.filter(r => r.creadorId === usuarioId));

    // Carrito
    setCarrito(JSON.parse(localStorage.getItem("carrito")) || []);
  }, []);


  // ===============================
  // 🔹 Agregar al carrito
  // ===============================
  const agregarCarrito = (c) => {
    const nuevo = [...carrito, c];
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  // ===============================
  // 🔹 Agregar a recopilación
  // ===============================
  const agregarARecopilacion = (idRec, cancion) => {
    const todas = JSON.parse(localStorage.getItem("recopilaciones")) || [];

    const actualizado = todas.map((rec) =>
      rec.id === idRec
        ? { ...rec, canciones: [...rec.canciones, cancion] }
        : rec
    );

    localStorage.setItem("recopilaciones", JSON.stringify(actualizado));
    setRecopilaciones(actualizado.filter((r) => r.creadorId === usuarioId));
    setModalRecopilacion(null);

    alert("Agregado a tu recopilación 🎵");
  };

  return (
    <div className="container py-5">
      
      <h1 className="fw-bold mb-4">
        Catálogo de Canciones 🎵
      </h1>

      {/* GRID DE CANCIONES */}
      <div className="row g-4">
        {canciones.map((c) => (
          <div className="col-md-4 col-lg-3" key={c.id}>
            <div className="card shadow-lg border-0 h-100">
              
              {/* Imagen */}
              <img
                src={c.portada || "https://i.imgur.com/Z5wQ1.png"}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                alt="portada"
              />

              <div className="card-body">
                <h5 className="fw-bold">{c.titulo}</h5>
                <p className="text-muted mb-1">{c.autor}</p>
                <small className="text-secondary">
                  ⏱ {c.duracion}
                </small>

                {/* Si pertenece a un vinilo */}
                {c.vinilosAsociados.length > 0 && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <small className="text-success fw-bold">
                      🟣 Disponible en vinilo:
                    </small>
                    {c.vinilosAsociados.map(v => (
                      <div key={v.id}>
                        <small>{v.nombre} – ${v.precio}</small>
                      </div>
                    ))}
                  </div>
                )}

                {/* BOTONES */}
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => agregarCarrito(c)}
                >
                  Agregar al carrito 🛒
                </button>

                <button
                  className="btn btn-outline-success w-100 mt-2"
                  onClick={() => setModalRecopilacion(c)}
                >
                  Agregar a recopilación ➕
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>


      {/* ======================================
         MODAL: Seleccionar recopilación
      ======================================= */}
      {modalRecopilacion && (
        <div className="modal-backdrop-custom">
          <div className="modal-card p-4 shadow-lg">
            <h5 className="fw-bold mb-3">
              Agregar "{modalRecopilacion.titulo}" a una recopilación
            </h5>

            {recopilaciones.length === 0 && (
              <p className="text-muted">No tienes recopilaciones todavía.</p>
            )}

            {recopilaciones.map((rec) => (
              <button
                key={rec.id}
                className="btn btn-outline-dark w-100 mb-2"
                onClick={() =>
                  agregarARecopilacion(rec.id, modalRecopilacion)
                }
              >
                {rec.nombre}
              </button>
            ))}

            <button
              className="btn btn-secondary w-100 mt-2"
              onClick={() => setModalRecopilacion(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Estilos del modal */}
      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-card {
          background: white;
          border-radius: 12px;
          width: 400px;
        }
      `}</style>

    </div>
  );
}

export default CatalogoCanciones;
