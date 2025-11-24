import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout"; 
import Home from "./components/Home"; 
import Login from "./components/Login"; 
import CatalogoVinilos from "./components/CatalogoVinilos"; 
import RegistrarUsuario from "./components/RegistrarUsuario"; 
import AdminPanel from "./components/AdminPanel"; 
import UserList from "./components/UserList"; 
import UsuarioPanel from "./components/UsuarioPanel"; 
import CatalogoCancion from "./components/CatalogoCancion"; 
import GestionVinilos from "./components/GestionVinilos";
import EditarPerfil from "./components/EditarPerfil";
import Carrito from "./components/Carrito";
import Recopilaciones from "./components/Recopilaciones";
import HistorialCompras from "./components/HistorialCompras";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/catalogoVinilos" element={<CatalogoVinilos />} />
            <Route path="/registrarUsuario" element={<RegistrarUsuario />} />
            <Route path="/adminPanel" element={<AdminPanel />} />
            <Route path="/userList" element={<UserList />} />
            <Route path="/userPanel" element={<UsuarioPanel />} />
            <Route path="/catalogoCancion" element={<CatalogoCancion />} />
            <Route path="/recopilaciones" element={<Recopilaciones />} />
            <Route path="/gestionVinilos" element={<GestionVinilos />} />
            <Route path="/perfil" element={<EditarPerfil />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/compras" element={<HistorialCompras/>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
