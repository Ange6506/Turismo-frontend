import { useState, useEffect } from 'react';
import Header from '../Header/Header_Turismo';
import Footer from '../Footer/Footer';
import './Guia.css';

import imagen1 from '../../assets/img/playa.jpg';
import imagen2 from '../../assets/img/montaña.jpg';
import imagen3 from '../../assets/img/ciudad.jpg';

function Guia() {
  const [visits, setVisits] = useState(0);
  const [tours, setTours] = useState([]);
const API_URL = import.meta.env.VITE_API_URL;

  const [nuevoTour, setNuevoTour] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion: '',
    categoria: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [tourEditando, setTourEditando] = useState(null);

  const imagenesIntercaladas = [imagen1, imagen2, imagen3];

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/getTours`);
        const data = await response.json();
        if (response.ok) {
          setTours(data.tours || []);
        } else {
          alert('Error al cargar los tours');
        }
      } catch (error) {
        console.error('Error al cargar tours:', error);
        alert('Error de conexión con el servidor');
      }
    };

    fetchTours();
  }, []);

  const abrirModalEditar = (tour) => {
    setTourEditando({ ...tour });
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setTourEditando(null);
    setModalVisible(false);
  };

  const handleChangeEditar = (e) => {
    const { name, value } = e.target;
    setTourEditando((prev) => ({
      ...prev,
      [name]: name === 'precio' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const guardarEdicion = async () => {
    const { _id, id, nombre, descripcion, precio, duracion, categoria } = tourEditando;

    if (!nombre || !descripcion || precio === '' || !duracion || !categoria) {
      alert('Por favor completa todos los campos');
      return;
    }

    const precioFloat = parseFloat(precio);
    if (isNaN(precioFloat) || precioFloat <= 0) {
      alert('Por favor ingresa un precio válido mayor que cero');
      return;
    }

    const tourId = _id || id;

    try {
      const response = await fetch(`${API_URL}/api/users/updateTour/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: precioFloat,
          duracion,
          categoria,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Tour actualizado correctamente');

        setTours((prevTours) =>
          prevTours.map((tour) =>
            (tour._id === tourId || tour.id === tourId)
              ? { ...tour, nombre, descripcion, precio: precioFloat, duracion, categoria }
              : tour
          )
        );
        cerrarModal();
      } else {
        alert(`Error: ${data.message || 'No se pudo actualizar el tour'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  };

  const agregarTour = async () => {
    const { nombre, descripcion, precio, duracion, categoria } = nuevoTour;

    if (!nombre || !descripcion || precio === '' || !duracion || !categoria) {
      alert('Por favor completa todos los campos');
      return;
    }

    const precioFloat = parseFloat(precio);
    if (isNaN(precioFloat) || precioFloat <= 0) {
      alert('Por favor ingresa un precio válido mayor que cero');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/createTour`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: precioFloat,
          duracion,
          categoria,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Tour agregado correctamente');
        setNuevoTour({
          nombre: '',
          descripcion: '',
          precio: '',
          duracion: '',
          categoria: '',
        });
        setTours((prevTours) => [...prevTours, { id: data.id, nombre, descripcion, precio: precioFloat, duracion, categoria }]);
      } else {
        alert(`Error: ${data.message || 'No se pudo agregar el tour'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  };

  // Función para eliminar un tour
  const eliminarTour = async (tourId) => {
    if (!window.confirm('¿Seguro que quieres eliminar este tour?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}api/users/deleteTour/${tourId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Tour eliminado correctamente');
        setTours((prevTours) => prevTours.filter((tour) => (tour._id || tour.id) !== tourId));
      } else {
        const data = await response.json();
        alert(`Error al eliminar tour: ${data.message || 'No se pudo eliminar el tour'}`);
      }
    } catch (error) {
      console.error('Error al eliminar tour:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <>
      <Header />

      <main>
        <section className="carousel">
          <h2>Explora nuestros destinos</h2>
          <div className="carousel-images">
            <img src={imagen1} alt="Playa" />
            <img src={imagen2} alt="Montaña" />
            <img src={imagen3} alt="Ciudad" />
          </div>
        </section>

        <section className="info">
          <h2>¡Bienvenido a Tu Próxima Aventura!</h2>
          <p>
            Descubre los mejores lugares para vacacionar. Desde playas paradisíacas hasta ciudades llenas de historia,
            tenemos el destino perfecto para ti.
          </p>
        </section>

        <section className="visitas">
          <button onClick={() => setVisits(visits + 1)} className="btn-visitar">
            Has visitado esta página {visits} veces
          </button>
        </section>

        <section className="atracciones">
          <h2>Tours Disponibles</h2>
          <div className="atracciones-list">
            {tours.length === 0 ? (
              <p>Cargando tours...</p>
            ) : (
              tours
                .filter((tour) => tour && typeof tour === 'object')
                .map((tour, index) => (
                  <div key={tour._id || tour.id || index} className="atraccion-item">
                    <img
                      src={imagenesIntercaladas[index % imagenesIntercaladas.length]}
                      alt={tour.nombre || 'Tour'}
                      className="atraccion-img"
                    />
                    <h3>{tour.nombre || 'Sin nombre'}</h3>
                    <p>{tour.descripcion || ''}</p>
                    <p>Precio: ${tour.precio}</p>
                    <p>Duración: {tour.duracion}</p>
                    <p>Categoría: {tour.categoria}</p>
                    <div className="buttons">
                      <button className="btn-edit" onClick={() => abrirModalEditar(tour)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => eliminarTour(tour._id || tour.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        {modalVisible && tourEditando && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Editar Tour</h2>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del tour"
                value={tourEditando.nombre}
                onChange={handleChangeEditar}
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={tourEditando.descripcion}
                onChange={handleChangeEditar}
              />
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={tourEditando.precio}
                onChange={handleChangeEditar}
              />
              <input
                type="text"
                name="duracion"
                placeholder="Duración"
                value={tourEditando.duracion}
                onChange={handleChangeEditar}
              />
              <input
                type="text"
                name="categoria"
                placeholder="Categoría"
                value={tourEditando.categoria}
                onChange={handleChangeEditar}
              />
              <div className="modal-buttons">
                <button onClick={guardarEdicion}>Guardar</button>
                <button onClick={cerrarModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <section className="agregar-tour">
          <h2>➕ Agregar Nuevo Tour</h2>
          <input
            type="text"
            placeholder="Nombre del tour"
            value={nuevoTour.nombre}
            onChange={(e) => setNuevoTour({ ...nuevoTour, nombre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoTour.descripcion}
            onChange={(e) => setNuevoTour({ ...nuevoTour, descripcion: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoTour.precio}
            onChange={(e) => setNuevoTour({ ...nuevoTour, precio: e.target.value })}
          />
          <input
            type="text"
            placeholder="Duración"
            value={nuevoTour.duracion}
            onChange={(e) => setNuevoTour({ ...nuevoTour, duracion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Categoría"
            value={nuevoTour.categoria}
            onChange={(e) => setNuevoTour({ ...nuevoTour, categoria: e.target.value })}
          />
          <button onClick={agregarTour}>Agregar Tour</button>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Guia;
