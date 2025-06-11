import React, { useState, useEffect } from "react";
import {
    getHoteles,
    addHotel,
    updateHotel,
    deleteHotel,
} from "../services/admin/api";
import styles from "../styles/admin/hoteles.module.css";

const Hoteles = () => {
    const [hoteles, setHoteles] = useState([]);
    const [formData, setFormData] = useState({
        titulo_hotel: "",
        img: "",
        descripcion_hotel: "",
        estado_id_estado: "",
        empresa_id_empresa: "",
    });
    const [editando, setEditando] = useState(null);

    const cargarHoteles = async () => {
        const data = await getHoteles();
        setHoteles(data);
    };

    useEffect(() => {
        cargarHoteles();
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
            const { img, ...datosSinImagen } = formData;
            await updateHotel(editando, datosSinImagen);
        } else {
            const data = new FormData();
            data.append("titulo_hotel", formData.titulo_hotel);
            data.append("img", formData.img);
            data.append("descripcion_hotel", formData.descripcion_hotel);
            data.append("estado_id_estado", formData.estado_id_estado);
            data.append("empresa_id_empresa", formData.empresa_id_empresa);
            await addHotel(data);
        }

        setFormData({
            titulo_hotel: "",
            img: "",
            descripcion_hotel: "",
            estado_id_estado: "",
            empresa_id_empresa: "",
        });
        setEditando(null);
        cargarHoteles();
    };

    const handleEditar = (hotel) => {
        setEditando(hotel.id_hoteles);
        setFormData({
            titulo_hotel: hotel.titulo_hotel,
            img: hotel.img,
            descripcion_hotel: hotel.descripcion_hotel,
            estado_id_estado: hotel.estado_id_estado,
            empresa_id_empresa: hotel.empresa_id_empresa,
        });
    };

    const handleEliminar = async (id) => {
        await deleteHotel(id);
        cargarHoteles();
    };

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Hoteles</h2>
            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input 
                    name="titulo_hotel" 
                    type="text" 
                    placeholder="Título del Hotel" 
                    value={formData.titulo_hotel} 
                    onChange={handleChange} 
                    className={styles.input} 
                    required 
                />
                <input 
                    name="img" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange} 
                    className={styles.input} 
                    required={!editando} 
                />
                <textarea 
                    name="descripcion_hotel" 
                    placeholder="Descripción del Hotel" 
                    value={formData.descripcion_hotel} 
                    onChange={handleChange} 
                    className={`${styles.input} ${styles.textarea}`} 
                    rows="3"
                    required 
                />
                <input 
                    name="estado_id_estado" 
                    type="number" 
                    placeholder="ID Estado" 
                    value={formData.estado_id_estado} 
                    onChange={handleChange} 
                    className={styles.input} 
                    required 
                />
                <input 
                    name="empresa_id_empresa" 
                    type="number" 
                    placeholder="ID Empresa" 
                    value={formData.empresa_id_empresa} 
                    onChange={handleChange} 
                    className={styles.input} 
                    required 
                />
                <button type="submit" className={styles.botonEnviar}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.encabezado}>
                        <th className={styles.celda}>ID</th>
                        <th className={styles.celda}>Título</th>
                        <th className={styles.celda}>Imagen</th>
                        <th className={styles.celda}>Descripción</th>
                        <th className={styles.celda}>ID Estado</th>
                        <th className={styles.celda}>ID Empresa</th>
                        <th className={styles.celda}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {hoteles.map((hotel) => (
                        <tr key={hotel.id_hoteles}>
                            <td className={styles.celda}>{hotel.id_hoteles}</td>
                            <td className={styles.celda}>{hotel.titulo_hotel}</td>
                            <td className={styles.celda}>
                                <img 
                                    src={hotel.img} 
                                    alt={hotel.titulo_hotel} 
                                    className={styles.imagen} 
                                />
                            </td>
                            <td className={`${styles.celda} ${styles.descripcion}`}>{hotel.descripcion_hotel}</td>
                            <td className={styles.celda}>{hotel.estado_id_estado}</td>
                            <td className={styles.celda}>{hotel.empresa_id_empresa}</td>
                            <td className={styles.celda}>
                                <button 
                                    onClick={() => handleEditar(hotel)} 
                                    className={styles.botonEditar}
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleEliminar(hotel.id_hoteles)} 
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

export default Hoteles;
