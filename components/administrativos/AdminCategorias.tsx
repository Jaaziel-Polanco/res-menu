"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import CategoriaModal from "./CategoriaModal";


interface Categoria {
    id?: string;
    name: string;
}

export default function AdminCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            const querySnapshot = await getDocs(collection(db, "categorias"));
            const categoriasData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Categoria[];
            setCategorias(categoriasData);
        };

        fetchCategorias();
    }, []);

    const agregarCategoria = async () => {
        if (nuevaCategoria.trim() === "") return;
        const docRef = await addDoc(collection(db, "categorias"), { name: nuevaCategoria });
        setCategorias([...categorias, { name: nuevaCategoria, id: docRef.id }]);
        setNuevaCategoria("");
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Gestión de Categorías</h3>

            {/* Formulario de agregar categoría */}
            <div className="flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Nombre de Categoría"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    className="border p-2 text-black w-full md:w-auto"
                />
                <button onClick={agregarCategoria} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                    Agregar Categoría
                </button>
            </div>

            {/* Lista de Categorías */}
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categorias.map((categoria) => (
                    <li
                        key={categoria.id}
                        className="bg-gray-800 p-4 rounded-lg flex items-center justify-between cursor-pointer"
                        onClick={() => setCategoriaSeleccionada(categoria)}
                    >
                        <span>{categoria.name}</span>
                    </li>
                ))}
            </ul>

            {/* Modal para editar/eliminar categoría */}
            {categoriaSeleccionada && (
                <CategoriaModal categoria={categoriaSeleccionada} onClose={() => setCategoriaSeleccionada(null)} />
            )}
        </div>
    );
}
