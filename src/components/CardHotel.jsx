import React, { useState, useEffect } from 'react';
import styles from '../styles/Cards.module.css';
import { checkSession, addComentario, getComentariosByHotel } from '../services/api';
import Swal from 'sweetalert2';

const CardHotel = ({ hotel }) => {
    const [showModal, setShowModal] = useState(false);
    const [comentario, setComentario] = useState('');
    const [calificacion, setCalificacion] = useState(0);
    const [usuario, setUsuario] = useState(null);
    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await checkSession();
            setUsuario(session.loggedIn ? session.id_persona : null);
        };
        fetchSession();
    }, []);

    const obtenerComentarios = async () => {
        try {
            const response = await getComentariosByHotel(hotel.id_hoteles);
            if (response.success && Array.isArray(response.data)) {
                setComentarios(response.data);
            }
        } catch (error) {
            console.error("Error al obtener comentarios:", error);
        }
    };

    const abrirModal = async () => {
        await obtenerComentarios();
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
    };

    const enviarComentario = async (e) => {
        e.preventDefault();

        if (!usuario) {
            Swal.fire({
                icon: 'error',
                title: 'Debes iniciar sesión para comentar.',
            });
            return;
        }

        const nuevoComentario = {
            persona_id_persona: usuario,
            id_hoteles: hotel.id_hoteles,
            contenido: comentario,
            id_calificacion: calificacion,
        };

        try {
            const response = await addComentario(nuevoComentario);

            if (response.success) {
                await obtenerComentarios(); // Recargar comentarios desde backend
                setComentario('');
                setCalificacion(0);

                Swal.fire({
                    icon: 'success',
                    title: 'Comentario enviado correctamente.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar comentario.',
                    text: response.message || 'Hubo un problema al procesar tu comentario.',
                });
            }
        } catch (error) {
            console.error("Error enviando comentario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error al enviar tu comentario.',
            });
        }
    };

    return (
        <>
            <div className={styles.cardcontainer}>
                <div className={styles.card}>
                    {hotel.img && (
                        <img className={styles.cardimg} src={hotel.img} alt={hotel.titulo_hotel} />
                    )}
                    <div className={styles.cardbody}>
                        <h5 className={styles.cardtitle}>{hotel.titulo_hotel || "Cargando..."}</h5>
                        <p className={styles.carddescription}>{hotel.descripcion_hotel}</p>
                        <button className={styles.readmorebutton} onClick={abrirModal}>
                            Leer más
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={styles.modaloverlay} onClick={cerrarModal}>
                    <div className={styles.modalcontent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modaltitle}>{hotel.titulo_hotel}</h2>
                        {hotel.img && (
                            <img className={styles.cardimg} src={hotel.img} alt={hotel.titulo_hotel} />
                        )}
                        <p className={styles.modaldescription}>{hotel.descripcion_hotel}</p>
                        <h3 className={styles.modalsubtitle}>Comentarios:</h3>
                        {comentarios.length > 0 ? (
                            <ul className={styles.commentlist}>
                                {comentarios.map((coment, index) => (
                                    <li key={index} className={styles.commentitem}>
                                        <strong>Calificación:</strong> {coment.id_calificacion} ★<br />
                                        <span>{coment.contenido}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay comentarios aún.</p>
                        )}

                        <form onSubmit={enviarComentario} className={styles.commentform}>
                            <textarea
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Escribe tu comentario"
                                required
                            ></textarea>

                            <div className={styles.startrating}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${star <= calificacion ? "filled" : ""}`}
                                        onClick={() => setCalificacion(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <button className={styles.readmorebutton} type="submit">
                                Enviar Comentario
                            </button>
                        </form>

                        <button className={styles.closebutton} onClick={cerrarModal}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardHotel;
