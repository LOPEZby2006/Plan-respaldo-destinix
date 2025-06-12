// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/Header';
import Slider from '../components/Slider';
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  // Estado para mostrar sección de clima
  const [showWeather, setShowWeather] = useState(false);

  // Información clima simulada
  const weather = {
    temp: 14,
    condition: 'Nublado',
    city: 'Bogotá',
    icon: '☁️',
  };

  // Lista de eventos culturales (puedes extender o traer de API)
  const culturalEvents = [
    { id: 1, name: "Festival Iberoamericano de Teatro", date: "Octubre 15 - 31" },
    { id: 2, name: "Feria del Libro de Bogotá", date: "Abril 25 - Mayo 6" },
    { id: 3, name: "Jazz al Parque", date: "Septiembre 5 - 8" },
  ];

  return (
    <div className={styles.fondo}>
      <div className={styles.bloque}>
        <Sidebar />

        <main>
          <Header />

          {/* Carrusel visual con lugares destacados */}
          <Slider />

          {/* Bienvenida al usuario */}
          <h1 className={styles.title}>Hola, bienvenido a tu experiencia en Bogotá</h1>
          <p className={styles.pno}>Descubre lo mejor de la ciudad desde tu panel turístico</p>

          {/* Botón para mostrar clima */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button
              onClick={() => setShowWeather(!showWeather)}
              className={styles.buttonPrimary}
              aria-expanded={showWeather}
              aria-controls="weatherSection"
            >
              {showWeather ? 'Ocultar clima' : 'Mostrar clima actual'}
            </button>
          </div>

          {showWeather && (
            <section
              id="weatherSection"
              className={styles.infoSection}
              aria-label="Información del clima actual en Bogotá"
            >
              <h2>🌤️ Clima actual en {weather.city}</h2>
              <p style={{ fontSize: '1.5rem' }}>
                {weather.icon} {weather.condition}, {weather.temp}°C
              </p>
            </section>
          )}

          {/* Tips turísticos */}
          <section className={styles.tipsContainer}>
            <h2>🧳 Tips útiles para tu visita</h2>
            <div className={styles.tipsGrid}>
              {/* Tus tipCards existentes */}
              <div className={styles.tipCard}>
                <h4>🕓 Mejores horarios</h4>
                <p>Visita lugares turísticos en la mañana (9 a.m. - 12 p.m.) para evitar multitudes.</p>
              </div>
              <div className={styles.tipCard}>
                <h4>🚖 Transporte seguro</h4>
                <p>Usa apps como DiDi, Uber o taxis autorizados. Evita abordar taxis en la calle.</p>
              </div>
              <div className={styles.tipCard}>
                <h4>💰 Lleva efectivo</h4>
                <p>Muchos pequeños comercios aceptan solo efectivo. Lleva billetes pequeños para pagos rápidos.</p>
              </div>
              <div className={styles.tipCard}>
                <h4>📱 Internet local</h4>
                <p>Compra una SIM card prepago (Claro, Tigo, Movistar) para mantenerte conectado.</p>
              </div>
              <div className={styles.tipCard}>
                <h4>🌦️ Clima cambiante</h4>
                <p>El clima en Bogotá puede variar mucho. Lleva siempre chaqueta ligera e impermeable.</p>
              </div>
              <div className={styles.tipCard}>
                <h4>🌎 Costumbres locales</h4>
                <p>La gente es amable. Saludar con un “buenos días” o “buenas tardes” es bien recibido.</p>
              </div>
            </div>
          </section>

          {/* Eventos culturales */}
          <section className={styles.infoSection} aria-label="Eventos culturales en Bogotá">
            <h2>🎭 Próximos eventos culturales</h2>
            <ul>
              {culturalEvents.map(event => (
                <li key={event.id}>
                  <strong>{event.name}</strong> - {event.date}
                </li>
              ))}
            </ul>
          </section>

          {/* Curiosidades de Bogotá */}
          <section className={styles.infoSection}>
            <h2>📚 Curiosidades de Bogotá</h2>
            <ul>
              <li>📍 Bogotá está a más de 2.600 metros sobre el nivel del mar.</li>
              <li>🏛️ La Candelaria es el barrio más antiguo, lleno de historia y arte urbano.</li>
              <li>🚲 La ciudad tiene una de las redes de ciclovía más grandes del mundo.</li>
            </ul>
          </section>

          {/* Gastronomía típica */}
          <section className={styles.infoSection}>
            <h2>🍲 Gastronomía que debes probar</h2>
            <ul>
              <li>🥣 Ajiaco: sopa típica con pollo, papa y guasca.</li>
              <li>🍖 Bandeja paisa: un plato abundante con arroz, carne, fríjoles y huevo frito.</li>
              <li>🧀 Chocolate con queso: sí, se come así. Ideal en las mañanas frías.</li>
            </ul>
          </section>

          {/* Qué evitar */}
          <section className={styles.infoSection}>
            <h2>🚫 Cosas que debes evitar</h2>
            <ul>
              <li>❌ No tomes agua directamente del grifo en lugares rurales.</li>
              <li>❌ No uses el celular en la calle sin precaución.</li>
              <li>❌ Evita zonas solitarias después de las 8:00 p.m. si no conoces la ciudad.</li>
            </ul>
          </section>

          {/* Recomendaciones personalizadas */}
          <section className={styles.recomendaciones}>
            <h2>📌 Recomendaciones según tu interés</h2>
            <div className={styles.recoGrid}>
              <div className={styles.recoCard}>
                <h4>🏞️ Naturaleza y aire libre</h4>
                <p>Visita Monserrate, el Jardín Botánico y el Parque Simón Bolívar para reconectar con la naturaleza.</p>
              </div>
              <div className={styles.recoCard}>
                <h4>🖼️ Arte y cultura</h4>
                <p>Explora el Museo del Oro, Museo Botero y los murales urbanos en La Candelaria.</p>
              </div>
              <div className={styles.recoCard}>
                <h4>🍽️ Restaurantes recomendados</h4>
                <p>Prueba Andrés Carne de Res, La Puerta Falsa o el restaurante Casa Vieja para cocina local.</p>
              </div>
              <div className={styles.recoCard}>
                <h4>🛍️ Compras y souvenirs</h4>
                <p>Dirígete a Usaquén, el Centro Comercial Andino o San Victorino según tu presupuesto.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
