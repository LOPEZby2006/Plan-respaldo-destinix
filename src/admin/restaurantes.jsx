import React, { useState, useEffect } from "react";
import {
    getRestaurantes,
    addRestaurante,
    updateRestaurante,
    deleteRestaurante,
} from "../services/admin/api";
import "../services/style/restaurante.css";

const Restaurantes = () => {
    const [restaurantes, setRestaurantes] = useState([]);
    const [formData, setFormData] = useState({
        titulo_restaurante: "",
        img: "",
        desc_restaurantes: "",
        estado_id_estado: "",
        empresa_id_empresa: "",
    });
    const [editando, setEditando] = useState(null);

    const cargarRestaurantes = async () => {
        const data = await getRestaurantes();
        setRestaurantes(data);
    };

    useEffect(() => {
        cargarRestaurantes();
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
            await updateRestaurante(editando, datosSinImagen);
        } else {
            const data = new FormData();
            data.append("titulo_restaurante", formData.titulo_restaurante);
            data.append("img", formData.img);
            data.append("desc_restaurantes", formData.desc_restaurantes);
            data.append("estado_id_estado", formData.estado_id_estado);
            data.append("empresa_id_empresa", formData.empresa_id_empresa);
            await addRestaurante(data);
        }

        setFormData({
            titulo_restaurante: "",
            img: "",
            desc_restaurantes: "",
            estado_id_estado: "",
            empresa_id_empresa: "",
        });
        setEditando(null);
        cargarRestaurantes();
    };

    const handleEditar = (restaurante) => {
        setEditando(restaurante.id_restaurante);
        setFormData({
            titulo_restaurante: restaurante.titulo_restaurante,
            img: restaurante.img,
            desc_restaurantes: restaurante.desc_restaurantes,
            estado_id_estado: restaurante.estado_id_estado,
            empresa_id_empresa: restaurante.empresa_id_empresa,
        });
    };

    const handleEliminar = async (id) => {
        await deleteRestaurante(id);
        cargarRestaurantes();
    };

    return (
        <div className="restaurantes-container">
            <h2 className="restaurantes-title">Gestión de Restaurantes</h2>
            <form onSubmit={handleSubmit} className="restaurantes-form">
                <input 
                    name="titulo_restaurante" 
                    type="text" 
                    placeholder="Título del Restaurante" 
                    value={formData.titulo_restaurante} 
                    onChange={handleChange} 
                    className="form-input" 
                    required 
                />
                <input 
                    name="img" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange} 
                    className="form-input-file" 
                    required={!editando} 
                />
                <textarea 
                    name="desc_restaurantes" 
                    placeholder="Descripción del Restaurante" 
                    value={formData.desc_restaurantes} 
                    onChange={handleChange} 
                    className="form-textarea" 
                    rows="3"
                    required 
                />
                <input 
                    name="estado_id_estado" 
                    type="number" 
                    placeholder="ID Estado" 
                    value={formData.estado_id_estado} 
                    onChange={handleChange} 
                    className="form-input" 
                    required 
                />
                <input 
                    name="empresa_id_empresa" 
                    type="number" 
                    placeholder="ID Empresa" 
                    value={formData.empresa_id_empresa} 
                    onChange={handleChange} 
                    className="form-input" 
                    required 
                />
                <button type="submit" className="form-button">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="restaurantes-table">
                <thead>
                    <tr className="table-header">
                        <th className="table-cell">ID</th>
                        <th className="table-cell">Título</th>
                        <th className="table-cell">Imagen</th>
                        <th className="table-cell">Descripción</th>
                        <th className="table-cell">ID Estado</th>
                        <th className="table-cell">ID Empresa</th>
                        <th className="table-cell">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurantes.map((restaurante) => (
                        <tr key={restaurante.id_restaurante}>
                            <td className="table-cell">{restaurante.id_restaurante}</td>
                            <td className="table-cell">{restaurante.titulo_restaurante}</td>
                            <td className="table-cell">
                                <img 
                                    src={restaurante.img} 
                                    alt={restaurante.titulo_restaurante} 
                                    className="table-image" 
                                    onLoad={() => console.log('Imagen cargada:', restaurante.img)}
                                    onError={(e) => {
                                        console.error('Error cargando imagen:', restaurante.img);
                                        console.log('URL completa:', e.target.src);
                                    }}
                                />
                            </td>
                            <td className="table-cell table-description">{restaurante.desc_restaurantes}</td>
                            <td className="table-cell">{restaurante.estado_id_estado}</td>
                            <td className="table-cell">{restaurante.empresa_id_empresa}</td>
                            <td className="table-cell">
                                <button 
                                    onClick={() => handleEditar(restaurante)} 
                                    className="btn-editar"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleEliminar(restaurante.id_restaurante)} 
                                    className="btn-eliminar"
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

export default Restaurantes;