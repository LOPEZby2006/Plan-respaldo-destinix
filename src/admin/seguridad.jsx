import React, { useEffect, useState } from "react";
import {
    getSeguridad,
    addSeguridad,
    updateSeguridad,
    deleteSeguridad,
} from "../services/admin/api";
import styles from "../styles/admin/seguridad.module.css";

const Seguridad = () => {
    const [registros, setRegistros] = useState([]);
    const [email_usu, setEmailUsu] = useState("");
    const [contra_usu, setContraUsu] = useState("");
    const [token_reset, setTokenReset] = useState("");
    const [expira_reset, setExpiraReset] = useState("");
    const [verificado, setVerificado] = useState("");
    const [token_verificacion, setTokenVerificacion] = useState("");
    const [editando, setEditando] = useState(null);

    const cargarSeguridad = async () => {
        const data = await getSeguridad();
        setRegistros(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevoRegistro = {
            email_usu,
            contra_usu,
            token_reset,
            expira_reset,
            verificado,
            token_verificacion,
        };

        if (editando) {
            await updateSeguridad(editando, nuevoRegistro);
        } else {
            await addSeguridad(nuevoRegistro);
        }

        setEmailUsu("");
        setContraUsu("");
        setTokenReset("");
        setExpiraReset("");
        setVerificado("");
        setTokenVerificacion("");
        setEditando(null);
        cargarSeguridad();
    };

    const handleEditar = (registro) => {
        setEmailUsu(registro.email_usu);
        setContraUsu(registro.contra_usu);
        setTokenReset(registro.token_reset);
        setExpiraReset(registro.expira_reset);
        setVerificado(registro.verificado);
        setTokenVerificacion(registro.token_verificacion);
        setEditando(registro.id_seguridad);
    };

    const handleEliminar = async (id) => {
        await deleteSeguridad(id);
        cargarSeguridad();
    };

    useEffect(() => {
        cargarSeguridad();
    }, []);

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Seguridad</h2>

            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input
                    type="email"
                    value={email_usu}
                    onChange={(e) => setEmailUsu(e.target.value)}
                    className={styles.input}
                    placeholder="Email"
                />
                <input
                    type="text"
                    value={contra_usu}
                    onChange={(e) => setContraUsu(e.target.value)}
                    className={styles.input}
                    placeholder="Contraseña"
                />
                <input
                    type="text"
                    value={token_reset}
                    onChange={(e) => setTokenReset(e.target.value)}
                    className={styles.input}
                    placeholder="Token Reset"
                />
                <input
                    type="text"
                    value={expira_reset}
                    onChange={(e) => setExpiraReset(e.target.value)}
                    className={styles.input}
                    placeholder="Expira Reset"
                />
                <input
                    type="text"
                    value={verificado}
                    onChange={(e) => setVerificado(e.target.value)}
                    className={styles.input}
                    placeholder="Verificado"
                />
                <input
                    type="text"
                    value={token_verificacion}
                    onChange={(e) => setTokenVerificacion(e.target.value)}
                    className={styles.input}
                    placeholder="Token Verificación"
                />
                <button type="submit" className={styles.botonEnviar}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.encabezado}>
                        <th className={styles.celda}>ID</th>
                        <th className={styles.celda}>Email</th>
                        <th className={styles.celda}>Contraseña</th>
                        <th className={styles.celda}>Token Reset</th>
                        <th className={styles.celda}>Expira Reset</th>
                        <th className={styles.celda}>Verificado</th>
                        <th className={styles.celda}>Token Verificación</th>
                        <th className={styles.celda}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map((registro) => (
                        <tr key={registro.id_seguridad}>
                            <td className={styles.celda}>{registro.id_seguridad}</td>
                            <td className={styles.celda}>{registro.email_usu}</td>
                            <td className={styles.celda}>{registro.contra_usu}</td>
                            <td className={styles.celda}>{registro.token_reset}</td>
                            <td className={styles.celda}>{registro.expira_reset}</td>
                            <td className={styles.celda}>{registro.verificado}</td>
                            <td className={styles.celda}>{registro.token_verificacion}</td>
                            <td className={styles.celda}>
                                <button
                                    onClick={() => handleEditar(registro)}
                                    className={styles.botonEditar}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(registro.id_seguridad)}
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

export default Seguridad;
