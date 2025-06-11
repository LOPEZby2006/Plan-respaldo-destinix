import React, { useEffect, useState } from "react";
import {
    getRol,
    addRol,
    updateRol,
    deleteRol,
} from "../services/admin/api";
import styles from "../styles/admin/rol.module.css";

const Rol = () => {
    const [registros, setRegistros] = useState([]);
    const [Tipo_Rol, setTipoRol] = useState("");
    const [editando, setEditando] = useState(null);

    const cargarRoles = async () => {
        const data = await getRol();
        setRegistros(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevoRegistro = { Tipo_Rol };

        if (editando) {
            await updateRol(editando, nuevoRegistro);
        } else {
            await addRol(nuevoRegistro);
        }

        setTipoRol("");
        setEditando(null);
        cargarRoles();
    };

    const handleEditar = (registro) => {
        setTipoRol(registro.Tipo_Rol);
        setEditando(registro.idRol);
    };

    const handleEliminar = async (id) => {
        await deleteRol(id);
        cargarRoles();
    };

    useEffect(() => {
        cargarRoles();
    }, []);

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Roles</h2>

            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input
                    type="text"
                    value={Tipo_Rol}
                    onChange={(e) => setTipoRol(e.target.value)}
                    className={styles.input}
                    placeholder="Tipo de Rol"
                />
                <button type="submit" className={styles.botonAgregar}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.filaEncabezado}>
                        <th className={styles.celdaEncabezado}>ID</th>
                        <th className={styles.celdaEncabezado}>Tipo de Rol</th>
                        <th className={styles.celdaEncabezado}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map((registro) => (
                        <tr key={registro.idRol}>
                            <td className={styles.celda}>{registro.idRol}</td>
                            <td className={styles.celda}>{registro.Tipo_Rol}</td>
                            <td className={styles.celda}>
                                <button
                                    onClick={() => handleEditar(registro)}
                                    className={styles.botonEditar}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(registro.idRol)}
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

export default Rol;
