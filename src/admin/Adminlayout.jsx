// src/admin/AdminLayout.jsx
import React from "react";
import SidebarAdmin from "./sidebaradmin";
import { Outlet } from "react-router-dom";

import styles from '../styles/admin/adminlayout.module.css';

const AdminLayout = () => (
    <div className={styles.adminlayout}>
        <SidebarAdmin />
        <div className={styles.admincontent}>
            <Outlet />
        </div>
    </div>
);


export default AdminLayout;
