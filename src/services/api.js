export async function registerUser(data) {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message);
    }

    return result;
}

export const loginUser = async (email, contraseña) => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password: contraseña }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("rol", data.rol_idRol);
        }

        return data;
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};

export const Dashboard = async () => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/dashboard.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en Dashboard:", error);
        throw error;
    }
};

const API_URL = "https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/itinerario.php";

export const getItinerario = async () => {
    const response = await fetch(API_URL, {
        credentials: "include"
    });
    return response.json();
};

export const addEvento = async (evento) => {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/itinerario.php", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evento),
    });

    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error("Error al parsear JSON:", error);
        return { error: "Respuesta no válida del servidor" };
    }
};

export const deleteEvento = async (id) => {
    const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    return response.json();
};

export const logoutUser = async () => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/logout.php", {
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
    }
};

export const addComentario = async (comentarioData) => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/comentarios.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(comentarioData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al enviar comentario:", error);
        throw error;
    }
};

export async function getSitioTuristico() {
    try {
        const response = await fetch('https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/sitios.php', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar sitios turísticos:', error);
        return [];
    }
}

export async function guardarComentario(data) {
    try {
        const datos = {
            persona_id_persona: data.persona_id_persona,
            contenido: data.contenido,
            id_calificacion: data.id_calificacion
        };

        const response = await fetch('https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/comentarios.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error en la petición:", error);
        return { success: false, message: "Error de conexión." };
    }
}

export const getComentariosBySitio = async (id_sitio) => {
    try {
        const response = await fetch(`https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/comentarios.php?id_sitio=${id_sitio}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return [];
    }
};

export const checkSession = async () => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/session.php", {
            method: "GET",
            credentials: "include",  // Muy importante para enviar la cookie de sesión
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al verificar la sesión:", error);
        return { loggedIn: false };
    }
};


export const guardarComentarioSitio = async (data) => {
    const comentarioData = {
        persona_id_persona: data.persona_id_persona,
        contenido: data.contenido,
        id_calificacion: data.id_calificacion,
        id_sitio: data.id_sitio || null,
        id_hoteles: null,
        id_restaurante: null
    };
    return addComentario(comentarioData);
};

export const guardarComentarioHotel = async (data) => {
    const comentarioData = {
        persona_id_persona: data.persona_id_persona,
        contenido: data.contenido,
        id_calificacion: data.id_calificacion,
        id_hoteles: data.id_hoteles || null,
        id_sitio: null,
        id_restaurante: null
    };
    return addComentario(comentarioData);
};

export const guardarComentarioRestaurante = async (data) => {
    const comentarioData = {
        persona_id_persona: data.persona_id_persona,
        contenido: data.contenido,
        id_calificacion: data.id_calificacion,
        id_restaurante: data.id_restaurante || null,
        id_sitio: null,
        id_hoteles: null
    };
    return addComentario(comentarioData);
};

export const getRestaurantes = async () => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/Restaurantes.php");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener restaurantes:", error);
        throw error;
    }
};

export const getHoteles = async () => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/hoteles.php", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener hoteles:", error);
        return [];
    }
};

export const getSitiosPorTipo = async (tipo) => {
    try {
        const response = await fetch(`https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/itinerario.php?tipo=${tipo}`);
        if (!response.ok) {
            throw new Error("Error al obtener sitios por tipo");
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getSitiosPorTipo:", error);
        return [];
    }
};

export const editEvento = async (evento) => {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/itinerario.php", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evento),
    });

    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error("Error al parsear JSON:", error);
        return { error: "Respuesta no válida del servidor" };
    }
};

export const editUser = async (formData) => {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/usuario.php", {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const result = await response.json();

    if (result.error) {
        throw new Error(result.error);
    }

    return result;
};


export const fetchUsuario = async () => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/usuario.php", {
            method: "GET",
            credentials: "include", // 🔥 Para enviar las cookies de sesión
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error obteniendo usuario:", error);
        throw error;
    }
};

export const getPerfilAnunciante = async () => {
    try {
        const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/perfilanunciante.php", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener perfil del anunciante:", error);
        throw error;
    }
};


export const getRolUsuario = async () => {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/usuario.php", {
        credentials: "include",
    });
    const data = await response.json();
    return data.rol_idRol; // o retorna todo si necesitas más datos
};

export const editPerfilAnunciante = async (formData) => {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/perfilanunciante.php", {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
};

export const registrarHotel = async (formData) => {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/registrarhotel.php", {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const text = await response.text(); // Obtiene la respuesta como texto
    try {
        const data = JSON.parse(text); // Intenta convertirla a JSON
        if (!response.ok || data.error) {
            throw new Error(data.error || "Error en la solicitud");
        }
        return data;
    } catch (error) {
        throw new Error("Error al registrar el hotel. Verifica los logs.");
    }
};

export const getComentariosByHotel = async (id_hoteles) => {
    try {
        const response = await fetch(`https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/comentarios.php?id_hoteles=${id_hoteles}`, {
            method: 'GET',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return { success: false, message: 'Error en la conexión.' };
    }
};

export const getComentariosByrestaurante = async (id_hoteles) => {
    try {
        const response = await fetch(`https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/comentarios.php?id_hoteles=${id_hoteles}`, {
            method: 'GET',
            credentials: 'include',
        });
        return await response.json();
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        return { success: false, message: 'Error en la conexión.' };
    }
};

const CALIFICACION_URL = "https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/calificacion.php";

export const getCalificaciones = async () => {
    const response = await fetch(CALIFICACION_URL);
    return await response.json();
};

export const addCalificacion = async (puntuacion) => {
    const formData = new FormData();
    formData.append("puntuacion", puntuacion);

    const response = await fetch(CALIFICACION_URL, {
        method: "POST",
        body: formData,
    });
    return await response.json();
};

export const updateCalificacion = async (id, puntuacion) => {
    const response = await fetch(CALIFICACION_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_calificacion: id, puntuacion }),
    });
    return await response.json();
};

export const deleteCalificacion = async (id) => {
    const response = await fetch(`${CALIFICACION_URL}?id=${id}`, {
        method: "DELETE",
    });
    return await response.json();
};

export const VerificarUsu = async (id) => {
    const response = await fetch(`https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/verificar.php`, {
        method: "PUT",
    });
    return await response.json();
};

export const sendResetEmail = async (email) => {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/SendMail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();
    return result;
};

export const resetPassword = async (token, newPassword) => {
    const response = await fetch("https://ambitious-forest-0ecbd371e.6.azurestaticapps.net/destinix/reset.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token,
            password: newPassword,
        }),
    });

    const result = await response.json();
    return result;
};
