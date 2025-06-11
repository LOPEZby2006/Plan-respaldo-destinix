import React, { useState, useEffect } from "react";
import {
    gethoteles,
    addHoteles,
    updatehoteles,
    deletehoteles,
} from "../services/admin/api";

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
        const data = await gethoteles();
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
            const { img, ...rest } = formData;
            await updatehoteles(editando, rest);
        } else {
            const data = new FormData();
            data.append("titulo_hotel", formData.titulo_hotel);
            data.append("img", formData.img);
            data.append("descripcion_hotel", formData.descripcion_hotel);
            data.append("estado_id_estado", formData.estado_id_estado);
            data.append("empresa_id_empresa", formData.empresa_id_empresa);
            await addHoteles(data);
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
        await deletehoteles(id);
        cargarHoteles();
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Hoteles</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
                <input name="titulo_hotel" type="text" placeholder="Título" value={formData.titulo_hotel} onChange={handleChange} className="border p-2 rounded" required />
                <input name="img" type="file" accept="image/*" onChange={handleChange} className="border p-2 rounded" required={!editando} />
                <input name="descripcion_hotel" type="text" placeholder="Descripción" value={formData.descripcion_hotel} onChange={handleChange} className="border p-2 rounded" required />
                <input name="estado_id_estado" type="number" placeholder="ID Estado" value={formData.estado_id_estado} onChange={handleChange} className="border p-2 rounded" required />
                <input name="empresa_id_empresa" type="number" placeholder="ID Empresa" value={formData.empresa_id_empresa} onChange={handleChange} className="border p-2 rounded" required />
                <button type="submit" className="col-span-2 bg-blue-500 text-white py-2 rounded">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Título</th>
                        <th className="p-2 border">Imagen</th>
                        <th className="p-2 border">Descripción</th>
                        <th className="p-2 border">ID Estado</th>
                        <th className="p-2 border">ID Empresa</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {hoteles.map((hotel) => (
                        <tr key={hotel.id_hoteles}>
                            <td className="p-2 border">{hotel.id_hoteles}</td>
                            <td className="p-2 border">{hotel.titulo_hotel}</td>
                            <td className="p-2 border">
                                <img src={hotel.img} alt={hotel.titulo_hotel} className="w-20 h-14 object-cover" />
                            </td>
                            <td className="p-2 border">{hotel.descripcion_hotel}</td>
                            <td className="p-2 border">{hotel.estado_id_estado}</td>
                            <td className="p-2 border">{hotel.empresa_id_empresa}</td>
                            <td className="p-2 border">
                                <button onClick={() => handleEditar(hotel)} className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded">Editar</button>
                                <button onClick={() => handleEliminar(hotel.id_hoteles)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Hoteles;
