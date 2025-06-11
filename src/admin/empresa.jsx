import React, { useEffect, useState } from "react";
import {
    getEmpresas,
    addEmpresa,
    updateEmpresa,
    deleteEmpresa,
} from "../services/admin/api";
import styles from "../styles/admin/empresa.module.css";

const Empresa = () => {
    const [empresas, setEmpresas] = useState([]);
    const [form, setForm] = useState({
        nombre_emp: "",
        direccion_emp: "",
        correo_empresa: "",
        telefono_empresa: "",
        persona_id_persona: "",
        id_categoria: "",
    });
    const [editando, setEditando] = useState(null);

    const cargarEmpresas = async () => {
        const data = await getEmpresas();
        setEmpresas(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editando) {
            await updateEmpresa({ ...form, id_empresa: editando });
        } else {
            await addEmpresa(form);
        }
        setForm({
            nombre_emp: "",
            direccion_emp: "",
            correo_empresa: "",
            telefono_empresa: "",
            persona_id_persona: "",
            id_categoria: "",
        });
        setEditando(null);
        cargarEmpresas();
    };

    const handleEditar = (empresa) => {
        setForm({ ...empresa });
        setEditando(empresa.id_empresa);
    };

    const handleEliminar = async (id) => {
        await deleteEmpresa(id);
        cargarEmpresas();
    };

    useEffect(() => {
        cargarEmpresas();
    }, []);

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Empresas</h2>

            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input type="text" name="nombre_emp" value={form.nombre_emp} onChange={handleChange} placeholder="Nombre" className={styles.input} />
                <input type="text" name="direccion_emp" value={form.direccion_emp} onChange={handleChange} placeholder="Dirección" className={styles.input} />
                <input type="email" name="correo_empresa" value={form.correo_empresa} onChange={handleChange} placeholder="Correo" className={styles.input} />
                <input type="text" name="telefono_empresa" value={form.telefono_empresa} onChange={handleChange} placeholder="Teléfono" className={styles.input} />
                <input type="number" name="persona_id_persona" value={form.persona_id_persona} onChange={handleChange} placeholder="ID Persona" className={styles.input} />
                <input type="number" name="id_categoria" value={form.id_categoria} onChange={handleChange} placeholder="ID Categoría" className={styles.input} />
                <button type="submit" className={styles.boton}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.encabezado}>
                        <th className={styles.celda}>ID</th>
                        <th className={styles.celda}>Nombre</th>
                        <th className={styles.celda}>Dirección</th>
                        <th className={styles.celda}>Correo</th>
                        <th className={styles.celda}>Teléfono</th>
                        <th className={styles.celda}>ID Persona</th>
                        <th className={styles.celda}>ID Categoría</th>
                        <th className={styles.celda}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((emp) => (
                        <tr key={emp.id_empresa}>
                            <td className={styles.celda}>{emp.id_empresa}</td>
                            <td className={styles.celda}>{emp.nombre_emp}</td>
                            <td className={styles.celda}>{emp.direccion_emp}</td>
                            <td className={styles.celda}>{emp.correo_empresa}</td>
                            <td className={styles.celda}>{emp.telefono_empresa}</td>
                            <td className={styles.celda}>{emp.persona_id_persona}</td>
                            <td className={styles.celda}>{emp.id_categoria}</td>
                            <td className={styles.celda}>
                                <button onClick={() => handleEditar(emp)} className={styles.botonEditar}>Editar</button>
                                <button onClick={() => handleEliminar(emp.id_empresa)} className={styles.botonEliminar}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Empresa;
