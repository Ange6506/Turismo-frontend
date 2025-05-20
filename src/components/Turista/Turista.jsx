import { useState } from 'react';
import Header from '../Header/Header_Turismo';
import Footer from '../Footer/Footer';
import './Turista.css';
import imagen1 from '../../assets/img/playa.jpg';
import imagen2 from '../../assets/img/montaña.jpg';
import imagen3 from '../../assets/img/ciudad.jpg';

function Turista() {
  const [visits, setVisits] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.reload(); // recarga para volver a Home
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
          <h2>Atracciones destacadas</h2>
          <ul>
            <p>🏖️ Playa Blanca - Sol, arena y mar turquesa</p>
            <p>🏞️ Sendero Verde - Naturaleza pura y aire fresco</p>
            <p>🏙️ Centro Histórico - Cultura y arquitectura colonial</p>
          </ul>
        </section>

       
      </main>

      <Footer />
    </>
  );
}

export default Turista;
