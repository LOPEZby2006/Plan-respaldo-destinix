import React from "react";
import styles from "../styles/Dashboard.module.css";

const images = [
    "./imagenes/buscando.jpg",
    "./imagenes/img2.jpg",
    "./imagenes/playita.jpg",
    "./imagenes/nochebogota.png",
    "./imagenes/paisaje3.jpg",
    "./imagenes/paisaje1.jpg",
    "./imagenes/maloka.jpg",
];

const Slider = () => {
    const repeatedImages = [...images, ...images]; // loop infinito

    return (
        <div className={styles.sliderWrapper}>
            <div className={styles.sliderTrack}>
                {repeatedImages.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt={`Slide ${i + 1}`}
                        className={styles.sliderImage}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
