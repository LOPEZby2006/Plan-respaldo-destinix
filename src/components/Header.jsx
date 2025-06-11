import React from "react";
import styles from "../styles/Dashboard.module.css";
import { FaMapMarkedAlt } from "react-icons/fa";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.headerIcon}>
                <FaMapMarkedAlt className={styles.iconMap} />
            </div>
            <h1 className={styles.title}>DESTINIX</h1>
            <p className={styles.pno}>
                Tu guía de viaje personalizada para descubrir los mejores <strong>hoteles</strong>, <strong>restaurantes</strong> y <strong>lugares turísticos</strong> en Bogotá.
            </p>
            <p className={styles.slogan}>¡Explora, descubre y vive la ciudad como nunca antes!</p>
            <hr className={styles.separator} />
        </header>
    );
};

export default Header;
