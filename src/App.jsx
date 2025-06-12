// src/App.jsx
import React from "react";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import Slider from "./components/Slider";
import styles from"./styles/Dashboar.module.css";

const App = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.maincontent}>
                <Header />
                <Slider />
            </div>
        </div>
    );
};

export default App;
