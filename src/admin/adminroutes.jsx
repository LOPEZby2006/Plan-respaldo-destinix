// src/adminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Protectedroute";
import AdminLayout from "./Adminlayout";

import Calificacion from "./calificacion";
import Categoria from "./categoria";
import Comentarios from "./comentarios";
import Empresa from "./empresa";
import Estado from "./estado";
import Hoteles from "./Hoteles";
import Itinerario from "./itinerario";
import Persona from "./persona";
import Restaurantes from "./restaurantes";
import Rol from "./rol";
import Seguridad from "./seguridad";
import SitioTuristico from "./SitioTuristico";
import SoportePagos from "./soporte_pago";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute allowedRoles={[2]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="calificacion" element={<Calificacion />} />
                <Route path="categoria" element={<Categoria />} />
                <Route path="comentarios" element={<Comentarios />} />
                <Route path="empresa" element={<Empresa />} />
                <Route path="estado" element={<Estado />} />
                <Route path="hoteles" element={<Hoteles />} />
                <Route path="itinerario" element={<Itinerario />} />
                <Route path="persona" element={<Persona />} />
                <Route path="restaurantes" element={<Restaurantes />} />
                <Route path="rol" element={<Rol />} />
                <Route path="seguridad" element={<Seguridad />} />
                <Route path="sitio_turistico" element={<SitioTuristico />} />
                <Route path="soporte_pago" element={<SoportePagos />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
