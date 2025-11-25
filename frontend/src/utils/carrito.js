export function agregarAlCarrito(item, tipo) {
  const usuarioRaw = localStorage.getItem("usuarioLogeado");
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;

  const comprador_id = usuario?.id ?? null;
  const vendedor_id = usuario?.id ?? null; // vendedor es el mismo usuario

  // Normalizamos ID real del producto
  let idReal = null;

  if (tipo === "vinilo") {
    idReal = item.vinilo_id ?? item.id;
  } else if (tipo === "cancion") {
    idReal = item.cancion_id ?? item.id;
  }

  if (!idReal) {
    console.error("ERROR: el producto no tiene ID válido:", item);
    return;
  }

  const producto = {
    ...item,
    tipo,
    comprador_id,
    vendedor_id,
    vinilo_id: tipo === "vinilo" ? idReal : null,
    cancion_id: tipo === "cancion" ? idReal : null,
    id: idReal, // mantener compatibilidad
    precio: Number(item.precio) || 0,
  };

  // Guardar en localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
