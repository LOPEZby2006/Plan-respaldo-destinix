// Consolidated and fixed JavaScript API functions for Destinix

const BASE_URL = "https://destinixweb-h7cxddbtb0duddbv.brazilsouth-01.azurewebsites.net/destinix";

const fetchJson = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error("Error al parsear JSON:", error);
            return { error: "Respuesta no válida del servidor" };
        }
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export const registerUser = async (data) => {
    const result = await fetchJson(${BASE_URL}/register.php, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!result.success) throw new Error(result.message);
    return result;
};

export const loginUser = async (email, password) => {
    const data = await fetchJson(${BASE_URL}/login.php, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    if (data.success) localStorage.setItem("rol", data.rol_idRol);
    return data;
};

export const Dashboard = async () => {
    return await fetchJson(${BASE_URL}/dashboard.php, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: Bearer ${localStorage.getItem("token")},
        },
        credentials: "include",
    });
};

export const getItinerario = async () => {
    return await fetchJson(${BASE_URL}/itinerario.php, { credentials: "include" });
};

export const addEvento = async (evento) => {
    return await fetchJson(${BASE_URL}/itinerario.php, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evento),
    });
};

export const deleteEvento = async (id) => {
    return await fetchJson(${BASE_URL}/itinerario.php?id=${id}, {
        method: "DELETE",
        credentials: "include",
    });
};

export const logoutUser = async () => {
    return await fetchJson(${BASE_URL}/logout.php, { credentials: "include" });
};

const createComentarioPayload = (data, typeKey) => ({
    persona_id_persona: data.persona_id_persona,
    contenido: data.contenido,
    id_calificacion: data.id_calificacion,
    id_sitio: typeKey === "id_sitio" ? data.id_sitio : null,
    id_hoteles: typeKey === "id_hoteles" ? data.id_hoteles : null,
    id_restaurante: typeKey === "id_restaurante" ? data.id_restaurante : null
});

export const addComentario = async (comentarioData) => {
    return await fetchJson(${BASE_URL}/comentarios.php, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(comentarioData),
    });
};

export const guardarComentarioSitio = async (data) => addComentario(createComentarioPayload(data, "id_sitio"));
export const guardarComentarioHotel = async (data) => addComentario(createComentarioPayload(data, "id_hoteles"));
export const guardarComentarioRestaurante = async (data) => addComentario(createComentarioPayload(data, "id_restaurante"));

export const getSitioTuristico = async () => {
    return await fetchJson(${BASE_URL}/sitios.php, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    });
};

export const getComentariosBySitio = async (id_sitio) => {
    return await fetchJson(${BASE_URL}/comentarios.php?id_sitio=${id_sitio}, {
        method: "GET",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
    });
};

export const checkSession = async () => {
    return await fetchJson(${BASE_URL}/session.php, {
        method: "GET",
        credentials: "include",
    });
};

export const getRestaurantes = async () => {
    return await fetchJson(${BASE_URL}/Restaurantes.php);
};

export const getHoteles = async () => {
    return await fetchJson(${BASE_URL}/hoteles.php, {
        method: "GET",
        credentials: "include",
    });
};

export const getSitiosPorTipo = async (tipo) => {
    return await fetchJson(${BASE_URL}/itinerario.php?tipo=${tipo});
};

export const editEvento = async (evento) => {
    return await fetchJson(${BASE_URL}/itinerario.php, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evento),
    });
};

export const editUser = async (formData) => {
    const result = await fetchJson(${BASE_URL}/usuario.php, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (result.error) throw new Error(result.error);
    return result;
};

export const fetchUsuario = async () => {
    return await fetchJson(${BASE_URL}/usuario.php, {
        method: "GET",
        credentials: "include",
    });
};

export const getPerfilAnunciante = async () => {
    return await fetchJson(${BASE_URL}/perfilanunciante.php, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
};

export const getRolUsuario = async () => {
    const data = await fetchUsuario();
    return data.rol_idRol;
};

export const editPerfilAnunciante = async (formData) => {
    const data = await fetchJson(${BASE_URL}/perfilanunciante.php, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (data.error) throw new Error(data.error);
    return data;
};

export const registrarHotel = async (formData) => {
    const data = await fetchJson(${BASE_URL}/registrarhotel.php, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (data.error) throw new Error(data.error);
    return data;
};

export const getComentariosByHotel = async (id_hoteles) => {
    return await fetchJson(${BASE_URL}/comentarios.php?id_hoteles=${id_hoteles}, {
        method: "GET",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
    });
};