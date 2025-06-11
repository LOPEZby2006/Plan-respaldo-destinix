// src/admin/AdminSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";
import { useAuth } from "../Authcontext";

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar sesión
        </button>
    );
};

const AdminSidebar = () => {
    const { user } = useAuth();

    if (!user || user.rol !== 2) return null;

    const adminMenuItems = [
        { path: "/admin/calificacion", label: "Calificaciones", icon: "star" }, 
        { path: "/admin/categoria", label: "Categoría", icon: "tags" }, 
        { path: "/admin/empresa", label: "Empresa", icon: "building" }, 
        { path: "/admin/comentarios", label: "Comentarios", icon: "comments" }, 
        { path: "/admin/estado", label: "Estados", icon: "toggle-on" }, 
        { path: "/admin/hoteles", label: "Hoteles", icon: "bed" },
        { path: "/admin/restaurantes", label: "Restaurantes", icon: "utensils" }, 
        { path: "/admin/rol", label: "Roles", icon: "user-tag" }, 
        { path: "/admin/seguridad", label: "Seguridad", icon: "shield-alt" }, 
        { path: "/admin/persona", label: "Persona", icon: "users" }, 
        { path: "/admin/sitio_turistico", label: "Sitio Turístico", icon: "map-marker-alt" }, 
    ];

    return (
        <nav className={styles.barralateral}>
            <div className={styles.sidebarContent}>
                <ul className={styles.menuList}>
                    <li className={styles.logo}>
                        <NavLink to="/">
                            <img
                                src="/imagenes/LOGODES.png"
                                alt="Logo Destinix"
                                className={styles.logoImg}
                            />
                            <span className={styles.navitem}>Destinix</span>
                        </NavLink>
                    </li>

                    {adminMenuItems.map(({ path, label, icon }, index) => (
                        <li key={index}>
                            <NavLink
                                to={path}
                                className={({ isActive }) => (isActive ? styles.active : "")}
                            >
                                <i className={`fas fa-${icon}`}></i>
                                <span className={styles.navitem}>{label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.logoutSection}>
                <LogoutButton />
            </div>
        </nav>
    );
};

export default AdminSidebar;
