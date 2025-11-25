export function esAdmin() {
  try {
    // Caso 1: usuario guardado como objeto
    const usuarioRaw = localStorage.getItem("usuarioLogeado");
    if (usuarioRaw) {
      try {
        const usuario = JSON.parse(usuarioRaw);
        if (usuario?.rol === "admin") return true;
      } catch {}
    }

    // Caso 2: solo se guardó el rol manualmente
    const rolGuardado = localStorage.getItem("usuarioRol");
    if (rolGuardado === "admin") return true;

    return false;
  } catch {
    return false;
  }
}
