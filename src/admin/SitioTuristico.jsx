import React, { useState, useEffect } from "react";
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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Sitios Turísticos</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
                <input name="nombre_sitio" type="text" placeholder="Nombre" value={formData.nombre_sitio} onChange={handleChange} className="border p-2 rounded" required />
                <input name="img_sitio" type="file" accept="imagenes/*" onChange={handleChange} className="border p-2 rounded" required={!editando} />
                <input name="ubicacion_sitio" type="text" placeholder="Ubicación" value={formData.ubicacion_sitio} onChange={handleChange} className="border p-2 rounded" required />
                <input name="desc_sitio" type="text" placeholder="Descripción" value={formData.desc_sitio} onChange={handleChange} className="border p-2 rounded" required />
                <input name="persona_id_persona" type="number" placeholder="ID Persona" value={formData.persona_id_persona} onChange={handleChange} className="border p-2 rounded" required />
                <input name="estado_id_estado" type="number" placeholder="ID Estado" value={formData.estado_id_estado} onChange={handleChange} className="border p-2 rounded" required />
                <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Nombre</th>
                        <th className="p-2 border">Imagen</th>
                        <th className="p-2 border">Ubicación</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">ID Persona</th>
                        <th className="p-2 border">ID Estado</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sitios.map((sitio) => (
                        <tr key={sitio.id_sitio}>
                            <td className="p-2 border">{sitio.id_sitio}</td>
                            <td className="p-2 border">{sitio.nombre_sitio}</td>
                            <td className="p-2 border">
                                <img src={sitio.img_sitio} alt={sitio.img_sitio} className="w-20 h-14 object-cover" />
                            </td>
                            <td className="p-2 border">{sitio.ubicacion_sitio}</td>
                            <td className="p-2 border">{sitio.desc_sitio}</td>
                            <td className="p-2 border">{sitio.persona_id_persona}</td>
                            <td className="p-2 border">{sitio.estado_id_estado}</td>
                            <td className="p-2 border">
                                <button onClick={() => handleEditar(sitio)} className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded">Editar</button>
                                <button onClick={() => handleEliminar(sitio.id_sitio)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SitioTuristico;
