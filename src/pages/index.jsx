import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "../styles/style.module.css";
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';



function Index() {
  useEffect(() => {
    let prevScrollPos = window.pageYOffset;
    const navbar = document.querySelector('nav');

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollPos > currentScrollPos) {
        navbar.style.top = "0";
        navbar.style.opacity = "1";
      } else {
        navbar.style.top = "-100px";
        navbar.style.opacity = "0";
      }
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    alert('Formulario enviado con éxito.');
  };

  return (
    <div className={styles.container}>

      <header className={styles.Banner}>
        <div className={styles.bannerContent}>
          <img src="../imagenes/LOGODES.png" alt="Logo de Turismo en Bogotá" className={styles.logo} />
          <div className={styles.bannerText}>
            <h1 className={styles.h1}>DESTINIX</h1>
            <h4 className={styles.h4}>Don&apos;t stop traveling</h4>
          </div>
        </div>
      </header>

      <nav className={styles.navbar}>
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#sobre-nosotros">Sobre Nosotros</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#contacto">Contáctanos</a></li>
          <li><a href="#testimonios">Testimonios</a></li>
          <li><a href="#mapa">Mapa</a></li>
          <li><a href="#redes-sociales">Redes</a></li>
          <li><Link to="./login">Iniciar Sesión</Link></li>
        </ul>
      </nav>

      <main>
        <section id="inicio" className={styles.intro}>
          <h2 className={styles.h2}>Bienvenido a Bogotá</h2>

          <img
            src="./imagenes/panoramicabogota.jpg"
            alt="Vista panorámica de Bogotá"
            className={styles.image}
          />
          <p className={styles.p}>
            Explora la vibrante cultura, la historia rica y los hermosos paisajes de Bogotá. Desde museos fascinantes hasta una gastronomía diversa y exquisita, ¡tenemos todo lo que necesitas para vivir una experiencia inolvidable!
          </p>
          <p className={styles.p}>
            Bogotá es una ciudad cosmopolita situada a más de 2.600 metros sobre el nivel del mar. Su ubicación en el corazón de los Andes le otorga un clima templado durante todo el año, perfecto para recorrer sus calles llenas de historia, arte urbano, y arquitectura colonial y contemporánea.
          </p>

          <p className={styles.p}>
            Entre los lugares más emblemáticos que no puedes dejar de visitar se encuentra el Cerro de Monserrate, que ofrece una vista panorámica impresionante de la ciudad; el Museo del Oro, que alberga una de las colecciones prehispánicas más importantes del mundo; y la Candelaria, un barrio lleno de historia, cultura y color.
          </p>
          <p className={styles.p}>
            La vida cultural en Bogotá es muy activa: teatros, ferias del libro, conciertos al aire libre y una vibrante escena musical y artística te esperan en cada rincón. Además, cuenta con una red de ciclovías y parques como el Simón Bolívar, donde puedes conectarte con la naturaleza sin salir de la ciudad.
          </p>

          <p className={styles.p}>
            No puedes irte sin probar una bandeja de ajiaco, un tamal santafereño o una taza de café colombiano recién molido. La oferta gastronómica va desde puestos tradicionales hasta restaurantes de talla internacional que fusionan sabores andinos con técnicas modernas.
          </p>

          <p className={styles.p}>
            En <strong>DESTINIX</strong>, no solo te ayudamos a descubrir Bogotá, sino que nos aseguramos de que cada momento sea especial. Nuestro objetivo es que te lleves recuerdos auténticos, vivencias únicas y la sensación de haber conocido una ciudad que late con el alma de todo un país.
          </p>
        </section>

        <section id="sobre-nosotros" className={styles.about}>
          <h2 className={styles.h2}>Sobre Nosotros</h2>
          <p className={styles.p}>
            En <strong>DESTINIX</strong> somos más que una agencia de turismo: somos apasionados por Bogotá y por compartir lo mejor que esta ciudad tiene para ofrecer. Desde nuestra fundación, hemos trabajado incansablemente para brindar a nuestros visitantes experiencias únicas, auténticas y memorables.
          </p>

          <p className={styles.p}>
            Nuestro equipo está conformado por profesionales locales con una profunda conexión con la ciudad. Conocemos sus secretos mejor guardados, sus calles llenas de historia y los rincones donde la cultura y la vida cotidiana se encuentran. Cada miembro del equipo está comprometido en hacer que tu visita a Bogotá sea inolvidable.
          </p>

          <p className={styles.p}>
            Creemos en un turismo responsable, sostenible y ético, que respeta las tradiciones y contribuye positivamente al entorno local. Por eso, colaboramos con comunidades, emprendimientos locales y artistas independientes para promover un intercambio cultural enriquecedor.
          </p>

          <p className={styles.p}>
            Ya sea tu primera vez en la ciudad o un regreso lleno de nostalgia, te ayudaremos a descubrir nuevos paisajes, sabores y emociones. Desde tours históricos y gastronómicos, hasta escapadas naturales y actividades urbanas, diseñamos itinerarios adaptados a tus gustos, intereses y ritmo.
          </p>

          <p className={styles.p}>
            En DESTINIX, cada viaje cuenta una historia. Queremos que la tuya esté llena de momentos especiales, encuentros inolvidables y la magia que solo Bogotá puede ofrecer.
          </p>


        </section>

        <section id="servicios" className={styles.services}>
          <h2 className={styles.h2}>Servicios</h2>
          <p className={styles.p}>
            En DESTINIX nos enfocamos en cubrir todos los aspectos de tu viaje para que no tengas que preocuparte por nada. Desde el momento en que llegas hasta el último día de tu aventura, estamos aquí para ayudarte.
          </p>
          <p className={styles.p}>
            Estos son algunos de nuestros servicios más destacados:
          </p>

          <div className={styles.cardContainer}>
            {[
              {
                img: "/imagenes/hotel2.jpg",
                title: "Hotelería",
                text: "Ofrecemos una selección de hoteles y alojamientos que se adaptan a todos los presupuestos y preferencias.",
                link: "/login",
              },
              {
                img: "/imagenes/comida.jpg",
                title: "Restaurantes",
                text: "Disfruta de la exquisita gastronomía bogotana en nuestros restaurantes recomendados.",
                link: "/login",
              },
              {
                img: "/imagenes/monserrate222.jpg",
                title: "Turismo",
                text: "Descubre los rincones más emblemáticos de Bogotá con nuestros recorridos cuidadosamente diseñados.",
                link: "/login",
              }
            ].map((service, index) => (
              <div className={styles.card} key={index}>
                <img src={service.img} alt={service.title} className={styles.cardImg} />
                <div className={styles.cardBody}>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <Link to={service.link} className={styles.btn}>Leer Más</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contacto" className={styles.contact}>
          <h2 className={styles.h2}>Contáctanos</h2>
          <p className={styles.p}>
            Si tienes alguna pregunta o necesitas más información, no dudes en ponerte en contacto con nosotros. Estamos disponibles para resolver cualquier inquietud y ayudarte a planear tu próximo viaje.
          </p>
          <p className={styles.p}>
            También puedes encontrarnos en nuestras redes sociales o visitarnos en nuestras oficinas ubicadas en el centro de Bogotá. ¡Estaremos encantados de atenderte!
          </p>

          <form onSubmit={handleFormSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Correo Electrónico:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Mensaje:</label>
              <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <button type="submit" className={styles.btn}>Enviar</button>
          </form>
        </section>
      </main>

      <section id="testimonios" className={styles.testimonials}>
        <h2 className={styles.h2}>Testimonios</h2>
        <p className={styles.p}>Lo que nuestros clientes dicen sobre nosotros:</p>
        <div className={styles.testimoniallist}>
          <blockquote>
            “Una experiencia inolvidable. El equipo fue amable y muy profesional. ¡Recomiendo 100%!”
            <footer>– Laura G., México</footer>
          </blockquote>
          <blockquote>
            “Gracias a DESTINIX conocí Bogotá de una forma única. Cada tour fue bien organizado y divertido.”
            <footer>– Carlos M., Argentina</footer>
          </blockquote>
          <blockquote>
            “Todo estuvo perfecto, desde el hotel hasta las actividades. Definitivamente volveré.”
            <footer>– Andrea P., España</footer>
          </blockquote>
        </div>
      </section>

      <section id="mapa" className={styles.mapsection}>
        <h2 className={styles.h2}>¿Dónde estamos?</h2>
        <p className={styles.p}>Visítanos en nuestras oficinas principales en el corazón de Bogotá.</p>
        <div className={styles.mapcontainer}>
          <iframe
            title="Ubicación"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8420400715383!2d-74.07209268523757!3d4.710988043078876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99b0b4b703b9%3A0xf1f8ed88e63a2a6e!2sBogot%C3%A1!5e0!3m2!1ses!2sco!4v1614110983593!5m2!1ses!2sco"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section id="redes-sociales" className={styles.socialmedia}>
        <h2 className={styles.h2}>Síguenos en redes sociales</h2>
        <p className={styles.p}>Mantente al día con nuestras promociones, eventos y noticias.</p>
        <div className={styles.socialicons}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i> Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i> Instagram
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i> Twitter
          </a>
        </div>

      </section>


      <footer className={styles.footer}>
        <p className={styles.p}>© 2025 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Index;
