import React, { useState, useEffect } from "react";
import styles from "../styles/admin/sitioTuristico.module.css";
import {
    getSitiosTuristicos,
    addSitioTuristico,
    updateSitioTuristico,
    deleteSitioTuristico,
} from "../services/admin/api";

const SitioTuristico = () => {
    const [sitios, setSitios] = useState([]);
    const [formData, setFormData] = useState({
        nombre_sitio: "",
        img_sitio: "",
        ubicacion_sitio: "",
        desc_sitio: "",
        persona_id_persona: "",
        estado_id_estado: "",
    });
    const [editando, setEditando] = useState(null);

    const cargarSitios = async () => {
        const data = await getSitiosTuristicos();
        setSitios(data);
    };

    useEffect(() => {
        cargarSitios();
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
            const { img_sitio, ...datosSinImagen } = formData;
            await updateSitioTuristico(editando, datosSinImagen);
        } else {
            const data = new FormData();
            data.append("nombre_sitio", formData.nombre_sitio);
            data.append("img_sitio", formData.img_sitio);
            data.append("ubicacion_sitio", formData.ubicacion_sitio);
            data.append("desc_sitio", formData.desc_sitio);
            data.append("persona_id_persona", formData.persona_id_persona);
            data.append("estado_id_estado", formData.estado_id_estado);
            await addSitioTuristico(data);
        }

        setFormData({
            nombre_sitio: "",
            img_sitio: "",
            ubicacion_sitio: "",
            desc_sitio: "",
            persona_id_persona: "",
            estado_id_estado: "",
        });
        setEditando(null);
        cargarSitios();
    };

    const handleEditar = (sitio) => {
        setEditando(sitio.id_sitio);
        setFormData({
            nombre_sitio: sitio.nombre_sitio,
            img_sitio: sitio.img_sitio,
            ubicacion_sitio: sitio.ubicacion_sitio,
            desc_sitio: sitio.desc_sitio,
            persona_id_persona: sitio.persona_id_persona,
            estado_id_estado: sitio.estado_id_estado,
        });
    };

    const handleEliminar = async (id) => {
        await deleteSitioTuristico(id);
        cargarSitios();
    };

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Sitios Turísticos</h2>
            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input name="nombre_sitio" type="text" placeholder="Nombre" value={formData.nombre_sitio} onChange={handleChange} className={styles.input} required />
                <input name="img_sitio" type="file" accept="image/*" onChange={handleChange} className={styles.input} required={!editando} />
                <input name="ubicacion_sitio" type="text" placeholder="Ubicación" value={formData.ubicacion_sitio} onChange={handleChange} className={styles.input} required />
                <input name="desc_sitio" type="text" placeholder="Descripción" value={formData.desc_sitio} onChange={handleChange} className={styles.input} required />
                <input name="persona_id_persona" type="number" placeholder="ID Persona" value={formData.persona_id_persona} onChange={handleChange} className={styles.input} required />
                <input name="estado_id_estado" type="number" placeholder="ID Estado" value={formData.estado_id_estado} onChange={handleChange} className={styles.input} required />
                <button type="submit" className={styles.boton}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.filaEncabezado}>
                        <th className={styles.celda}>ID</th>
                        <th className={styles.celda}>Nombre</th>
                        <th className={styles.celda}>Imagen</th>
                        <th className={styles.celda}>Ubicación</th>
                        <th className={styles.celda}>Descripción</th>
                        <th className={styles.celda}>ID Persona</th>
                        <th className={styles.celda}>ID Estado</th>
                        <th className={styles.celda}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sitios.map((sitio) => (
                        <tr key={sitio.id_sitio}>
                            <td className={styles.celda}>{sitio.id_sitio}</td>
                            <td className={styles.celda}>{sitio.nombre_sitio}</td>
                            <td className={styles.celda}>
                                <img 
                                    src={sitio.img_sitio} 
                                    alt={sitio.nombre_sitio} 
                                    className={styles.imagen}
                                    onLoad={() => console.log('Imagen cargada:', sitio.img_sitio)}
                                    onError={(e) => {
                                        console.error('Error cargando imagen:', sitio.img_sitio);
                                        console.log('URL completa:', e.target.src);
                                    }}
                                />
                            </td>
                            <td className={styles.celda}>{sitio.ubicacion_sitio}</td>
                            <td className={styles.celda}>{sitio.desc_sitio}</td>
                            <td className={styles.celda}>{sitio.persona_id_persona}</td>
                            <td className={styles.celda}>{sitio.estado_id_estado}</td>
                            <td className={styles.celda}>
                                <button onClick={() => handleEditar(sitio)} className={styles.btnEditar}>Editar</button>
                                <button onClick={() => handleEliminar(sitio.id_sitio)} className={styles.btnEliminar}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SitioTuristico;
