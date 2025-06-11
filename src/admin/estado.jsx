import React, { useEffect, useState } from "react";
import {
    getEstados,
    addEstado,
    updateEstado,
    deleteEstado,
} from "../services/admin/api";
import styles from "../styles/admin/estado.module.css";

const Estado = () => {
    const [estados, setEstados] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    const cargarEstados = async () => {
        const data = await getEstados();
        setEstados(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!descripcion.trim()) return;
        if (editandoId) {
            await updateEstado(editandoId, descripcion);
        } else {
            await addEstado(descripcion);
        }
        setDescripcion("");
        setEditandoId(null);
        cargarEstados();
    };

    const handleEditar = (estado) => {
        setDescripcion(estado.desc_estado);
        setEditandoId(estado.id_estado);
    };

    const handleEliminar = async (id) => {
        await deleteEstado(id);
        cargarEstados();
    };

    useEffect(() => {
        cargarEstados();
    }, []);

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Estados</h2>

            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className={styles.input}
                    placeholder="Descripción del estado"
                />
                <button type="submit" className={styles.botonAgregar}>
                    {editandoId ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.filaEncabezado}>
                        <th className={styles.celda}>ID</th>
                        <th className={styles.celda}>Descripción</th>
                        <th className={styles.celda}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estados.map((estado) => (
                        <tr key={estado.id_estado} className={styles.fila}>
                            <td className={styles.celda}>{estado.id_estado}</td>
                            <td className={styles.celda}>{estado.desc_estado}</td>
                            <td className={styles.celda}>
                                <button
                                    onClick={() => handleEditar(estado)}
                                    className={styles.botonEditar}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(estado.id_estado)}
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

export default Estado;
