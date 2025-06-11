import React, { useEffect, useState } from "react";
import {
    getCategoria,
    addCategoria,
    updateCategoria,
    deleteCategoria,
} from "../services/admin/api";
import styles from "../styles/admin/categoria.module.css";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombreCate, setNombreCate] = useState("");
    const [descCate, setDescCate] = useState("");
    const [editando, setEditando] = useState(null);        

    const cargarCategorias = async () => {
        const data = await getCategoria();
        setCategorias(data);    
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editando) {
            await updateCategoria(editando, nombreCate, descCate);
        } else {
            await addCategoria(nombreCate, descCate);
        }

        setNombreCate("");
        setDescCate("");
        setEditando(null);
        cargarCategorias();
    };

    const handleEditar = (categoria) => {
        setNombreCate(categoria.nombre_cate);
        setDescCate(categoria.desc_cate);
        setEditando(categoria.id_categoria);
    };

    const handleEliminar = async (id) => {
        await deleteCategoria(id);
        cargarCategorias();
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    return (
        <div className={styles.contenedor}>
            <h2 className={styles.titulo}>Gestión de Categorías</h2>

            <form onSubmit={handleSubmit} className={styles.formulario}>
                <input
                    type="text"
                    value={nombreCate}
                    onChange={(e) => setNombreCate(e.target.value)}
                    className={styles.inputNombre}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="text"
                    value={descCate}
                    onChange={(e) => setDescCate(e.target.value)}
                    className={styles.inputDescripcion}
                    placeholder="Descripción"
                    required
                />
                <button type="submit" className={styles.boton}>
                    {editando ? "Actualizar" : "Agregar"}
                </button>
            </form>

            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.filaEncabezado}>
                        <th className={styles.celda}>ID</th>
                        <th className={styles.celda}>Nombre</th>
                        <th className={styles.celda}>Descripción</th>
                        <th className={styles.celda}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((cat) => (
                        <tr key={cat.id_categoria}>
                            <td className={styles.celda}>{cat.id_categoria}</td>
                            <td className={styles.celda}>{cat.nombre_cate}</td>
                            <td className={styles.celda}>{cat.desc_cate}</td>
                            <td className={styles.celda}>
                                <button
                                    onClick={() => handleEditar(cat)}
                                    className={styles.botonEditar}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminar(cat.id_categoria)}
                                    className={styles.botonEliminar}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Categorias;
