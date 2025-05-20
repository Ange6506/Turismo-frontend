import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Home.css';

// Imágenes locales para mostrar intercaladas
import imagen1 from '../../assets/img/playa.jpg';
import imagen2 from '../../assets/img/montaña.jpg';
import imagen3 from '../../assets/img/ciudad.jpg';

function Home() {
 const API_URL = import.meta.env.VITE_API_URL;
  const [count, setCount] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // selectedPlace ahora es un objeto con { place, index }
  const [selectedPlace, setSelectedPlace] = useState({ place: null, index: null });
  const [places, setPlaces] = useState([]);

  const navigate = useNavigate();

  const imagenesLocales = [imagen1, imagen2, imagen3];

  useEffect(() => {
    if (user) {
      switch (user.rol_id) {
        case 1:
          navigate('/turismo', { state: { user } });
          break;
        case 2:
          navigate('/guia', { state: { user } });
          break;
        case 3:
          navigate('/admin', { state: { user } });
          break;
        default:
          setError('Rol de usuario no reconocido.');
          break;
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/getTours`);
        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (response.ok) {
          setPlaces(data.tours || []);
        } else {
          console.error('Error al obtener destinos:', data.message);
          setPlaces([]);
        }
      } catch (error) {
        console.error('Error al conectarse con el servidor:', error);
        setPlaces([]);
      }
    };

    fetchPlaces();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
      ? `${API_URL}/api/users/register`
      : `${API_URL}/api/users/login`;
    const body = { username, contraseña: password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setShowAuth(false);
        if (data.user) {
          setUser(data.user);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Ocurrió un error. Intenta nuevamente.');
    }
  };

  return (
    <>
      <Header setShowAuth={setShowAuth} />

      <main>
        <section className="carousel">
          <h2 className="carousel-title">Galería de Destinos</h2>

          {selectedPlace && selectedPlace.place ? (
            <div className="details">
              <button
                className="back-button"
                onClick={() => setSelectedPlace({ place: null, index: null })}
              >
                ← Volver
              </button>
              <h3>{selectedPlace.place.nombre}</h3>
              <img
                src={
                  imagenesLocales[
                    selectedPlace.index % imagenesLocales.length
                  ]
                }
                alt={selectedPlace.place.nombre}
                className="detail-image"
              />
              <p><strong>Descripción:</strong> {selectedPlace.place.descripcion}</p>
              <p><strong>Precio:</strong> ${selectedPlace.place.precio}</p>
              <p><strong>Duración:</strong> {selectedPlace.place.duracion} horas</p>
              <p><strong>Categoría:</strong> {selectedPlace.place.categoria}</p>
            </div>
          ) : (
            <div className="carousel-images">
              {places.map((place, index) => (
                <div key={place.id || index} className="place-card">
                  <img
                    src={imagenesLocales[index % imagenesLocales.length]}
                    alt={place.nombre}
                    className="carousel-image"
                  />
                  <h3>{place.nombre}</h3>
                  <button
                    className="details-button"
                    onClick={() => setSelectedPlace({ place, index })}
                  >
                    Detalles
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="info">
          <div className="container">
            <h2>Descubre las Maravillas</h2>
            <p className="info-description">
              Vive la experiencia en este increíble destino turístico con diversas actividades,
              paisajes impresionantes, y una rica cultura local. ¡No te lo pierdas!
            </p>
          </div>
        </section>

        <section className="explore">
          <div className="container">
            <button
              className="explore-button"
              onClick={() => setCount(count + 1)}
            >
              Has explorado este sitio {count} veces
            </button>
            <p>Haz clic para contar más visitas</p>
          </div>
        </section>
      </main>

      <Footer />

      {showAuth && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-modal" onClick={() => setShowAuth(false)}>
              ✖
            </button>
            <h2>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="submit-button">
                {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
              </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <p>
              {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}{' '}
              <span
                className="toggle-link"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
