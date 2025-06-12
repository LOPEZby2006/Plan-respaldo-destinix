import React from "react";
import styles from "../styles/Dashboard.module.css";
import { FaArrowRight } from "react-icons/fa";

const Card = ({ image, title, description, link }) => {
    return (
        <div className={styles.card}>
            {image && <img src={image} alt={title} className={styles.cardimg} />}
            <div className={styles.cardbody}>
                <h3 className={styles.cardtitle}>{title}</h3>
                <p className={styles.cardtext}>{description}</p>
                <a href={link} className={styles.btn}>
                    Ver Más <FaArrowRight style={{ marginLeft: "8px" }} />
                </a>
            </div>
        </div>
    );
};

export default Card;
