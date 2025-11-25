// src/utils/carrito.js
// carrito.js

export const agregarAlCarrito = (producto) => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoCarrito = {
        id: producto.vinilo_id || producto.id || null,
        vinilo_id: producto.vinilo_id || producto.id || null,
        nombre: producto.nombre,
        artista: producto.artista,
        precio: producto.precio,
        cantidad: 1,
        tipo: producto.tipo || "vinilo",
        duracion: producto.duracion || null,

        // ← Aquí está el vendedor REAL
        vendedor_id: producto.usuario_id || producto.vendedor_id || null,
    };

    carrito.push(productoCarrito);

    localStorage.setItem("carrito", JSON.stringify(carrito));
};


export function agregarARecopilacion(cancion) {
  const rec = JSON.parse(localStorage.getItem("recopilacion")) || [];

  rec.push({
    ...cancion,
    titulo: cancion.nombre,
    autor: cancion.artista,
  });

  localStorage.setItem("recopilacion", JSON.stringify(rec));
  alert("Canción agregada a tu recopilación 🎵");
}
