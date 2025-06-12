import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from "../styles/admin/comentario.module.css"

const Comentarios = ({ idHoteles }) => {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [idEditar, setIdEditar] = useState(null);

    // Cargar comentarios al inicio
    useEffect(() => {
        fetch(`http://localhost/destinix/comentariosadmin.php?id_hoteles=${idHoteles}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setComentarios(data.data);
            });
    }, [idHoteles]);

    const agregarComentario = () => {
        if (!nuevoComentario.trim()) return;

        fetch('http://localhost/destinix/comentariosadmin.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contenido: nuevoComentario,
                id_calificacion: 1, // Puedes cambiar esto según tu lógica
                id_hoteles: idHoteles
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setNuevoComentario('');
                    Swal.fire('¡Comentario agregado!', '', 'success');
                    // Recargar comentarios
                    return fetch(`http://localhost/destinix/comentariosadmin.php?id_hoteles=${idHoteles}`, {
                        credentials: 'include',
                    });
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .then(res => res && res.json())
            .then(data => data && data.success && setComentarios(data.data));
    };

    const eliminarComentario = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esto eliminará el comentario.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://localhost/destinix/comentariosadmin.php', {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `id_comentario=${id}`,
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Eliminado', '', 'success');
                            setComentarios(comentarios.filter(c => c.id_comentario !== id));
                        } else {
                            Swal.fire('Error', data.message, 'error');
                        }
                    });
            }
        });
    };

    const editarComentario = () => {
        fetch('http://localhost/destinix/comentariosadmin.php', {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_comentario: idEditar,
                contenido: nuevoComentario
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Comentario actualizado', '', 'success');
                    setNuevoComentario('');
                    setIdEditar(null);
                    return fetch(`http://localhost/destinix/comentariosadmin.php?id_hoteles=${idHoteles}`, {
                        credentials: 'include',
                    });
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .then(res => res && res.json())
            .then(data => data && data.success && setComentarios(data.data));
    };

    const seleccionarParaEditar = (comentario) => {
        setIdEditar(comentario.id_comentario);
        setNuevoComentario(comentario.contenido);
    };

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Comentarios del hotel</h2>

            <div className={styles.formulario}>
                <input
                type="text"
                className={styles.input}
                placeholder="Escribe un comentario..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                />
                {idEditar ? (
                <button className={styles.botonActualizar} onClick={editarComentario}>
                    Actualizar
                </button>
                ) : (
                <button className={styles.botonComentar} onClick={agregarComentario}>
                    Comentar
                </button>
                )}
            </div>

            <ul className={styles.listaComentarios}>
                {comentarios.map((comentario) => (
                <li key={comentario.id_comentario} className={styles.comentario}>
                    <div>
                    <p className={styles.textoComentario}>{comentario.contenido}</p>
                    <p className={styles.idPersona}>ID Persona: {comentario.persona_id_persona}</p>
                    </div>
                    <div className={styles.botones}>
                    <button className={styles.botonEditar} onClick={() => seleccionarParaEditar(comentario)}>
                        Editar
                    </button>
                    <button className={styles.botonEliminar} onClick={() => eliminarComentario(comentario.id_comentario)}>
                        Eliminar
                    </button>
                    </div>
                </li>
                ))}
            </ul>
            </div>

    );
};

export default Comentarios;
