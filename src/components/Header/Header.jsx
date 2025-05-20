import React from 'react';
import './Header.css';

function Header({ setShowAuth, user }) {
  return (
    <header className="header">
      <div className="container">
        <h1 className="main-title">¡Bienvenido a Tu Destino Turístico!</h1>
        <p className="tagline">Explora, descubre y disfruta de nuestro hermoso sitio.</p>
        
        {/* Solo muestra el botón si no hay usuario autenticado */}

          <button className="auth-button" onClick={() => setShowAuth(true)}>
            Iniciar sesión
          </button>

      </div>
    </header>
  );
}

export default Header;
