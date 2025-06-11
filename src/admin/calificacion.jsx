import React, { useEffect, useState } from "react";
import styles from "../styles/admin/calificacion.module.css";
import {
    getCalificaciones,
    addCalificacion,
    updateCalificacion,
    deleteCalificacion,
} from "../services/admin/api";

const Calificacion = () => {
    const [calificaciones, setCalificaciones] = useState([]);
    const [puntuacion, setPuntuacion] = useState("");
    const [editando, setEditando] = useState(null);

    const cargarCalificaciones = async () => {
        const data = await getCalificaciones();
        setCalificaciones(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editando) {
            await updateCalificacion(editando, puntuacion);
        } else {
            await addCalificacion(puntuacion);
        }
        setPuntuacion("");
        setEditando(null);
        cargarCalificaciones();
    };

    const handleEditar = (cal) => {
        setPuntuacion(cal.puntuacion);
        setEditando(cal.id_calificacion);
    };

    const handleEliminar = async (id) => {
        await deleteCalificacion(id);
        cargarCalificaciones();
    };

    useEffect(() => {
        cargarCalificaciones();
    }, []);

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Calificaciones</h2>

            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={puntuacion}
                    onChange={(e) => setPuntuacion(e.target.value)}
                    className={styles.input}
                    placeholder="Puntuación"
                />
                <button type="submit" className={styles.botonAgregar}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.filaEncabezado}>
                        <th className={styles.celdaEncabezado}>ID</th>
                        <th className={styles.celdaEncabezado}>Puntuación</th>
                        <th className={styles.celdaEncabezado}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {calificaciones.map((cal) => (
                        <tr key={cal.id_calificacion} className={styles.fila}>
                            <td className={styles.celda}>{cal.id_calificacion}</td>
                            <td className={styles.celda}>{cal.puntuacion}</td>
                            <td className={styles.celda}>
                                <button
                                    onClick={() => handleEditar(cal)}
                                    className={styles.botonEditar}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(cal.id_calificacion)}
                                    className={styles.botonEliminar}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calificacion;
