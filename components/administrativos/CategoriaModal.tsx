"use client";

import { useState } from "react";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface Categoria {
    id?: string;
    name: string;
}

export default function CategoriaModal({ categoria, onClose }: { categoria: Categoria, onClose: () => void }) {
    const [nombre, setNombre] = useState(categoria.name);

    const actualizarCategoria = async () => {
        if (!categoria.id) return;
        await updateDoc(doc(db, "categorias", categoria.id), { name: nombre });
        alert("Categoría actualizada");
        onClose();
    };

    const eliminarCategoria = async () => {
        if (!categoria.id) return;
        await deleteDoc(doc(db, "categorias", categoria.id));
        alert("Categoría eliminada");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Editar Categoría</h2>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border p-2 text-black w-full mb-2"
                />
                <button onClick={actualizarCategoria} className="bg-yellow-500 px-4 py-2 rounded w-full mb-2">
                    Guardar
                </button>
                <button onClick={eliminarCategoria} className="bg-red-500 px-4 py-2 rounded w-full">
                    Eliminar
                </button>
                <button onClick={onClose} className="bg-gray-500 px-4 py-2 rounded w-full mt-2">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
