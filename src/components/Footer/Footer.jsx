import React from 'react';
import './Footer.css'; // si deseas aplicar estilos separados, puedes crear este archivo

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <h3 className="footer-title">Tu Destino Turístico</h3>
        <p>Explora la magia de nuestro destino y déjate sorprender por sus maravillas naturales y culturales.</p>
        <div className="footer-links">
          <a href="#">Inicio</a>
          <a href="#">Galería</a>
          <a href="#">Actividades</a>
          <a href="#">Contacto</a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Tu Destino Turístico. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
