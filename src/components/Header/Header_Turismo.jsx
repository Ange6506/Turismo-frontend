import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // Importa useLocation
import './Header_Turismo.css';

function Header_Turismo() {
  const location = useLocation();  // Obtener el estado pasado
  const navigate = useNavigate();  // Inicializar useNavigate

  const user = location.state?.user;  // Acceder al user desde el estado

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpia los datos del usuario, por ejemplo, eliminando el user del estado
    // Aquí puedes manejar lo que quieras, como eliminar tokens, etc.
    navigate('/');  // Redirige al Home
  };

  // Verifica que el `user` existe antes de mostrarlo
  return (
    <header className="header">
      <div className="container">
        <h1 className="main-title">¡Bienvenido a Tu Destino Turístico!</h1>
        <p className="tagline">Explora, descubre y disfruta de nuestro hermoso sitio.</p>
        
        {/* Verifica si hay un usuario logueado */}
        {user ? (
          <div className="user-info">
            <p className="greeting">¡Hola, {user.nombre_usuario}!</p>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <p className="tagline">No has iniciado sesión</p> // Mensaje cuando el usuario no está autenticado
        )}
      </div>
    </header>
  );
}

export default Header_Turismo;
