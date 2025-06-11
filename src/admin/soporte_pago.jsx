import React, { useState, useEffect } from "react";

const SoportesPago = () => {
    const [soportes, setSoportes] = useState([]);
    const [imagen, setImagen] = useState(null);
    const [restaurante, setRestaurante] = useState("");
    const [hotel, setHotel] = useState("");
    const [sitio, setSitio] = useState("");

    const obtenerSoportes = async () => {
        try {
            const response = await fetch("http://localhost/destinix/soportes_pago.php");
            const data = await response.json();
            setSoportes(data);
        } catch (error) {
            console.error("Error al obtener los soportes:", error);
        }
    };

    useEffect(() => {
        obtenerSoportes();
    }, []);

    const handleInsertar = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del form

        if (!imagen) {
            alert("Selecciona una imagen.");
            return;
        }

        const formData = new FormData();
        formData.append("imagen_soporte", imagen);
        formData.append("restaurante_id", restaurante || "");
        formData.append("hotel_id", hotel || "");
        formData.append("sitio_id", sitio || "");
        formData.append("accion", "insertar");

        try {
            const res = await fetch("http://localhost/destinix/soportes_pago.php", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (result.success) {
                alert("Soporte registrado.");
                obtenerSoportes();
                setImagen(null);
                setHotel("");
                setRestaurante("");
                setSitio("");
            } else {
                alert("Error al registrar el soporte.");
            }
        } catch (error) {
            console.error("Error al insertar:", error);
        }
    };

    const handleEliminar = async (id_soporte) => {
        if (!window.confirm("¿Seguro que deseas eliminar este soporte?")) return;

        try {
            const res = await fetch("http://localhost/destinix/soportes_pago.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "eliminar", id_soporte }),
            });
            const result = await res.json();
            if (result.success) {
                alert("Eliminado.");
                obtenerSoportes();
            } else {
                alert("Error al eliminar.");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <div className="container">
            <h2>Soportes de Pago</h2>
            <form onSubmit={handleInsertar}>
                <input type="file" onChange={(e) => setImagen(e.target.files[0])} />
                <input
                    type="number"
                    placeholder="ID Restaurante"
                    value={restaurante}
                    onChange={(e) => setRestaurante(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="ID Hotel"
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="ID Sitio Turístico"
                    value={sitio}
                    onChange={(e) => setSitio(e.target.value)}
                />
                <button type="submit">Guardar</button>
            </form>

            <table border="1" style={{ marginTop: "20px", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Empresa</th>
                        <th>Persona</th>
                        <th>Restaurante</th>
                        <th>Hotel</th>
                        <th>Sitio</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {soportes.map((s) => (
                        <tr key={s.id_soporte}>
                            <td>{s.id_soporte}</td>
                            <td>
                                <img
                                    src={`http://localhost/destinix/imagenes/${s.imagen_soporte}`}
                                    alt="soporte"
                                    width="100"
                                />
                            </td>
                            <td>{s.id_empresa}</td>
                            <td>{s.id_persona}</td>
                            <td>{s.restaurante_id}</td>
                            <td>{s.hotel_id}</td>
                            <td>{s.sitio_id}</td>
                            <td>{s.estado_id}</td>
                            <td>
                                <button onClick={() => handleEliminar(s.id_soporte)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SoportesPago;
