import React, { useState, useEffect } from "react";
import {
    getPersonas,
    addPersona,
    updatePersona,
    deletePersona,
} from "../services/admin/api";
import styles from "../styles/admin/persona.module.css";

const Persona = () => {
    const [personas, setPersonas] = useState([]);
    const [formData, setFormData] = useState({
        nombre_usu: "",
        apellido_usu: "",
        tipo_documento: "",
        documento: "",
        email_usu: "",
        telefono_usu: "",
        genero: "",
        localidad: "",
        fecha_nacimiento: "",
        contraseña: "",
        id_seguridad: "",
        rol_idRol: "",
        foto_perfil: null,
    });
    const [editando, setEditando] = useState(null);

    const cargarPersonas = async () => {
    const response = await getPersonas();
    
    setPersonas(response);
};


    useEffect(() => {
        cargarPersonas();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editando) {
            const { foto_perfil, ...sinFoto } = formData;
            await updatePersona(editando, sinFoto);
        } else {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            await addPersona(data);
        }

        setFormData({
            nombre_usu: "",
            apellido_usu: "",
            tipo_documento: "",
            documento: "",
            email_usu: "",
            telefono_usu: "",
            genero: "",
            localidad: "",
            fecha_nacimiento: "",
            contraseña: "",
            id_seguridad: "",
            rol_idRol: "",
            foto_perfil: null,
        });
        setEditando(null);
        cargarPersonas();
    };

    const handleEditar = (persona) => {
        setEditando(persona.id_persona);
        setFormData({
            nombre_usu: persona.nombre_usu,
            apellido_usu: persona.apellido_usu,
            tipo_documento: persona.tipo_documento,
            documento: persona.documento,
            email_usu: persona.email_usu,
            telefono_usu: persona.telefono_usu,
            genero: persona.genero,
            localidad: persona.localidad,
            fecha_nacimiento: persona.fecha_nacimiento,
            contraseña: "",
            id_seguridad: persona.id_seguridad,
            rol_idRol: persona.rol_idRol,
            foto_perfil: null,
        });
    };

    const handleEliminar = async (id) => {
        await deletePersona(id);
        cargarPersonas();
    };

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Personas</h2>
            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input type="text" name="nombre_usu" placeholder="Nombre" value={formData.nombre_usu} onChange={handleChange} className={styles.input} required />
                <input type="text" name="apellido_usu" placeholder="Apellido" value={formData.apellido_usu} onChange={handleChange} className={styles.input} required />
                <input type="text" name="tipo_documento" placeholder="Tipo de Documento" value={formData.tipo_documento} onChange={handleChange} className={styles.input} required />
                <input type="text" name="documento" placeholder="Documento" value={formData.documento} onChange={handleChange} className={styles.input} required />
                <input type="email" name="email_usu" placeholder="Correo" value={formData.email_usu} onChange={handleChange} className={styles.input} required />
                <input type="text" name="telefono_usu" placeholder="Teléfono" value={formData.telefono_usu} onChange={handleChange} className={styles.input} required />
                <input type="text" name="genero" placeholder="Género" value={formData.genero} onChange={handleChange} className={styles.input} />
                <input type="text" name="localidad" placeholder="Localidad" value={formData.localidad} onChange={handleChange} className={styles.input} />
                <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className={styles.input} />
                <input type="password" name="contraseña" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} className={styles.input} />
                <input type="number" name="id_seguridad" placeholder="ID Seguridad" value={formData.id_seguridad} onChange={handleChange} className={styles.input} />
                <input type="number" name="rol_idRol" placeholder="ID Rol" value={formData.rol_idRol} onChange={handleChange} className={styles.input} />
                <input type="file" name="foto_perfil" accept="image/*" onChange={handleChange} className={styles.fileInput} />
                <button type="submit" className={styles.botonSubmit}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.cabecera}>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Documento</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Género</th>
                        <th>Localidad</th>
                        <th>Nacimiento</th>
                        <th>Rol</th>
                        <th>Foto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {personas.map((persona) => (
                        <tr key={persona.id_persona}>
                            <td>{persona.id_persona}</td>
                            <td>{persona.nombre_usu} {persona.apellido_usu}</td>
                            <td>{persona.documento}</td>
                            <td>{persona.email_usu}</td>
                            <td>{persona.telefono_usu}</td>
                            <td>{persona.genero}</td>
                            <td>{persona.localidad}</td>
                            <td>{persona.fecha_nacimiento}</td>
                            <td>{persona.rol_idRol}</td>
                            <td>
                                {persona.foto_perfil && (
                                    <img src={persona.foto_perfil} alt="perfil" className={styles.foto} />
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleEditar(persona)} className={styles.botonEditar}>Editar</button>
                                <button onClick={() => handleEliminar(persona.id_persona)} className={styles.botonEliminar}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Persona;
