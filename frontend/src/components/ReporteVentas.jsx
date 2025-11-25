import React, { useEffect, useState } from "react";
import { esAdmin } from "../utils/auth";

function ReporteVentas() {
  const [loading, setLoading] = useState(true);
  const [ventasCanciones, setVentasCanciones] = useState([]);
  const [ventasVinilos, setVentasVinilos] = useState([]);

  const [totalCanciones, setTotalCanciones] = useState(0);
  const [totalVinilos, setTotalVinilos] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);

  // Suponiendo que el admin quiere ver TODAS las ventas:
  const ADMIN_ID = 1; // puedes cambiar esto según tu login

  const cargarVentas = async () => {
    try {
     // =============================
// Cargar compras de canciones
// =============================
const resCanciones = await fetch(
  `http://localhost:5000/api/traer-compras-canciones/comprador/${ADMIN_ID}`
);
const dataC = await resCanciones.json();

const ventasC = Array.isArray(dataC.compras) ? dataC.compras : [];
setVentasCanciones(ventasC);

// calcular total vendido en canciones (usa campo precio en la respuesta)
let sumaCanciones = 0;
ventasC.forEach((c) => {
  const precio = Number(c.precio ?? 0);
  if (!Number.isNaN(precio)) sumaCanciones += precio;
});
setTotalCanciones(sumaCanciones);



      // =============================
      // Cargar compras de vinilos
      // =============================
      const resVinilos = await fetch(
        `http://localhost:5000/api/traer-compras-vinilos/comprador/${ADMIN_ID}`
      );
      const dataV = await resVinilos.json();

      const ventasV = Array.isArray(dataV.compras) ? dataV.compras : [];
      setVentasVinilos(ventasV);

      let sumaVinilos = 0;
      ventasV.forEach((v) => {
        if (v.precio) sumaVinilos += Number(v.precio);
      });
      setTotalVinilos(sumaVinilos);

      // =============================
      // TOTAL GENERAL
      // =============================
      setTotalGeneral(sumaCanciones + sumaVinilos);

      setLoading(false);
    } catch (err) {
      console.error("Error cargando reportes:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  if (!esAdmin()) return <h2>No autorizado</h2>;
  if (loading) return <p>Cargando reporte...</p>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 text-center">
        <i className="fa-solid fa-chart-line"></i> Reporte de Ventas
      </h2>

      <div className="card shadow p-4 mb-4">
        <h4 className="fw-bold mb-3">Resumen General</h4>

        <p><strong>Total vendido en canciones:</strong> ${totalCanciones.toFixed(2)}</p>
        <p><strong>Total vendido en vinilos:</strong> ${totalVinilos.toFixed(2)}</p>

        <hr />

        <h3 className="fw-bold text-success">
          Total General: ${totalGeneral.toFixed(2)}
        </h3>
      </div>

      <div className="card shadow p-4">
        <h4 className="fw-bold mb-3">Resumen de ventas</h4>

        <p><strong>Canciones vendidas:</strong> {ventasCanciones.length}</p>
        <p><strong>Vinilos vendidos:</strong> {ventasVinilos.length}</p>
      </div>
    </div>
  );
}

export default ReporteVentas;
