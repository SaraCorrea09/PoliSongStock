import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import CatalogoVinilos from "./components/CatalogoVinilos";

function App() {
  return (
    <Router>
      <Routes>

        {/* Todas las páginas dentro del Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<CatalogoVinilos />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
