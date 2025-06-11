import React, { useEffect, useState } from "react";
import {
    getCalificaciones,
    addCalificacion,
    updateCalificacion,
    deleteCalificacion,
} from "../services/api";

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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Gestión de Calificaciones</h2>

            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={puntuacion}
                    onChange={(e) => setPuntuacion(e.target.value)}
                    className="border p-2 rounded w-40"
                    placeholder="Puntuación"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Puntuación</th>
                        <th className="p-2 border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {calificaciones.map((cal) => (
                        <tr key={cal.id_calificacion}>
                            <td className="p-2 border">{cal.id_calificacion}</td>
                            <td className="p-2 border">{cal.puntuacion}</td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleEditar(cal)}
                                    className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(cal.id_calificacion)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
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
