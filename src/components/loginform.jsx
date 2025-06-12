import React from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom"; // ✅ IMPORTANTE: Agrega Link
import { useAuth } from "../Authcontext";
import styles from "../styles/login.module.css"

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        const email = event.target.email.value.trim();
        const password = event.target.password.value.trim();

        if (!email || !password) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor ingrese el correo y la contraseña.",
            });
            return;
        }

        try {
            const result = await login(email, password);

            if (!result.success) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: result.message || "Credenciales incorrectas.",
                });
                return;
            }

            Swal.fire({
                title: "¡Éxito!",
                text: "Inicio de sesión exitoso.",
                icon: "success",
                showConfirmButton: false,
                timer: 800,
                timerProgressBar: true,
            }).then(() => {
                switch (result.rol_idRol) {
                    case 1:
                        navigate("/dashboard"); // Usuario normal
                        break;
                    case 2:
                        navigate("/admin/calificacion"); // Administrador
                        break;
                    default:
                        Swal.fire({
                            icon: "error",
                            title: "Acceso denegado",
                            text: "Rol de usuario no autorizado.",
                        });
                }
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo conectar al servidor.",
            });
            console.error("Error:", error);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleLoginSubmit}>
            <h2>INICIAR SESIÓN</h2>
            <span>Use su correo y contraseña</span>

            <div className={styles.containerinput}>
                <input type="email" name="email" placeholder="Gmail" required />
            </div>

            <div className={styles.containerinput}>
                <input type="password" name="password" placeholder="Contraseña" required />
            </div>

            {/* ✅ Reemplazamos <a> por <Link> */}
            <Link to="/resetpassword">¿Olvidaste tu contraseña?</Link>
            <Link to="/loginempresa">Soy una empresa</Link>

            <button className={styles.button}>Iniciar Sesión</button>
        </form>
    );
};

export default LoginForm;
