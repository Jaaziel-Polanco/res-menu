"use client";

import { useState } from "react";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface Producto {
    id?: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    description: string;
    active: boolean;
}

export default function ProductoModal({
    producto,
    onClose,
    actualizarProductoLista
}: {
    producto: Producto,
    onClose: () => void,
    actualizarProductoLista: (productoActualizado: Producto | null, eliminar?: boolean) => void
}) {
    const [nombre, setNombre] = useState(producto.name);
    const [precio, setPrecio] = useState(producto.price);
    const [imagen, setImagen] = useState(producto.imageUrl);
    const [descripcion, setDescripcion] = useState(producto.description);
    const [activo, setActivo] = useState(producto.active);

    const actualizarProducto = async () => {
        if (!producto.id) return;

        const productoActualizado: Partial<Producto> = {
            name: nombre,
            price: precio,
            imageUrl: imagen,
            description: descripcion,
            active: activo
        };

        await updateDoc(doc(db, "productos", producto.id), productoActualizado);
        actualizarProductoLista({ ...producto, ...productoActualizado });
        onClose();
    };

    const eliminarProducto = async () => {
        if (confirm("¿Estás seguro de eliminar este producto permanentemente?")) {
            if (!producto.id) return;
            await deleteDoc(doc(db, "productos", producto.id));
            actualizarProductoLista(null, true);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[800]">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Editar Producto</h2>

                    {/* Estado Activo/Inactivo */}
                    <div className="flex items-center justify-between mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Estado del producto</span>
                        <button
                            onClick={() => setActivo(!activo)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${activo ? 'bg-green-500' : 'bg-red-500'
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${activo ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>

                    {/* Campos del formulario */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Nombre del producto"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Precio
                            </label>
                            <input
                                type="number"
                                value={precio}
                                onChange={(e) => setPrecio(parseFloat(e.target.value))}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Precio"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                URL de la imagen
                            </label>
                            <input
                                type="text"
                                value={imagen}
                                onChange={(e) => setImagen(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="URL de la imagen"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descripción
                            </label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Descripción del producto"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-between items-center gap-3">
                    <button
                        onClick={eliminarProducto}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-gray-600"
                    >
                        Eliminar
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={actualizarProducto}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}