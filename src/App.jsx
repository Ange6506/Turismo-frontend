import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa Routes y Route

import Home from './components/Home/Home';
import Turista from './components/Turista/Turista'; // Importa la página de Turista
import Guia from './components/Guia/Guia'; // Asegúrate de tener un componente para la página de Guia
import Admin from './components/Admin/Admin'; // Asegúrate de tener un componente para la página de Guia

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Ruta para Home */}
        <Route path="/turismo" element={<Turista />} /> {/* Ruta para Turista */}
        <Route path="/guia" element={<Guia />} /> {/* Ruta para Guía */}
        <Route path="/Admin" element={<Admin />} /> {/* Ruta para Guía */}

      </Routes>
    </Router>
  );
}

export default App;
