import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../styles/resetpass.module.css";
import { sendResetEmail, resetPassword } from "../services/api"; // Asegúrate de que la ruta sea correcta

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Fase 1: Enviar correo
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await sendResetEmail(email);
            if (data.success) {
                Swal.fire("¡Enviado!", data.message, "success");
            } else {
                Swal.fire("Error", data.message, "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo conectar al servidor", "error");
        }
    };

    // Fase 2: Cambiar contraseña usando el token
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        try {
            const data = await resetPassword(token || "", newPassword);
            if (data.success) {
                Swal.fire("¡Contraseña actualizada!", data.message, "success").then(() =>
                    navigate("/login")
                );
            } else {
                Swal.fire("Error", data.message, "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo conectar al servidor", "error");
        }
    };

    return (
        <div className={styles.contenedor}>
            <div className={styles.form}>
                {!token ? (
                    <>
                        <h2 className={styles.formtitle}>Recuperar Contraseña</h2>
                        <form onSubmit={handleEmailSubmit}>
                            <input
                                className={styles.inputcont}
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button className={styles.button} type="submit">
                                Enviar correo de recuperación
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className={styles.formtitle}>Restablecer Contraseña</h2>
                        <form onSubmit={handlePasswordReset}>
                            <input
                                className={styles.inputcont}
                                type="password"
                                placeholder="Nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button className={styles.button} type="submit">
                                Actualizar contraseña
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
