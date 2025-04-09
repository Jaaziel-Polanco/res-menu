"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import ProductoModal from "./ProductoModal";
import Image from "next/image";

interface Producto {
    id?: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    description: string;
    active: boolean;
}

interface Categoria {
    id: string;
    name: string;
}

export default function AdminProductos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [nuevoProducto, setNuevoProducto] = useState({ name: "", price: "", imageUrl: "", category: "", description: "" });
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [filtroActivo, setFiltroActivo] = useState<'todos' | 'activos' | 'inactivos'>('todos');

    useEffect(() => {
        const fetchProductos = async () => {
            const querySnapshot = await getDocs(collection(db, "productos"));
            const productosData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                active: doc.data().active ?? true, // Valor por defecto true
                ...doc.data(),
            })) as Producto[];
            setProductos(productosData);
        };

        const fetchCategorias = async () => {
            const querySnapshot = await getDocs(collection(db, "categorias"));
            const categoriasData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Categoria[];
            setCategorias(categoriasData);
        };

        fetchProductos();
        fetchCategorias();
    }, []);

    const productosFiltrados = productos.filter(p => {
        if (filtroActivo === 'todos') return true;
        return filtroActivo === 'activos' ? p.active : !p.active;
    });

    const agregarProducto = async () => {
        if (!nuevoProducto.name.trim() || !nuevoProducto.price.trim() || isNaN(Number(nuevoProducto.price)) || !nuevoProducto.imageUrl.trim() || !nuevoProducto.category.trim() || !nuevoProducto.description.trim()) {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        const productoFinal: Producto = {
            ...nuevoProducto,
            price: parseFloat(nuevoProducto.price),
            active: true // Nuevos productos se crean como activos
        };

        const docRef = await addDoc(collection(db, "productos"), productoFinal);
        setProductos([...productos, { ...productoFinal, id: docRef.id }]);
        setNuevoProducto({ name: "", price: "", imageUrl: "", category: "", description: "" });
    };

    const actualizarProductoLista = (productoActualizado: Producto | null, eliminar = false) => {
        if (eliminar) {
            setProductos(productos.filter((p) => p.id !== productoSeleccionado?.id));
        } else if (productoActualizado) {
            setProductos(productos.map((p) => (p.id === productoActualizado.id ? productoActualizado : p)));
        }
    };

    // Función para validar si una URL es de imagen válida
    const isValidImageUrl = (url: string) => {
        if (!url) return false;

        try {
            // Verificar que sea una URL válida
            new URL(url);

            // Extensiones de imagen comunes
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
            const lowerUrl = url.toLowerCase();

            // Verificar que la URL termine con una extensión de imagen
            return imageExtensions.some(ext => lowerUrl.endsWith(ext));
        } catch {
            return false;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header con título y filtro */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestión de Menú</h1>
                <div className="flex gap-4 items-center">
                    <select
                        value={filtroActivo}
                        onChange={(e) => setFiltroActivo(e.target.value as "todos" | "activos" | "inactivos")}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todos">Todos los productos</option>
                        <option value="activos">Solo activos</option>
                        <option value="inactivos">Solo inactivos</option>
                    </select>
                </div>
            </div>

            {/* Formulario de nuevo producto */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Agregar nuevo producto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej: Pizza Margarita"
                            value={nuevoProducto.name}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Precio</label>
                        <input
                            type="text"
                            placeholder="Ej: 12.99"
                            value={nuevoProducto.price}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, price: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Imagen URL</label>
                        <input
                            type="text"
                            placeholder="Ej: https://imagen.com/pizza.jpg"
                            value={nuevoProducto.imageUrl}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, imageUrl: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Categoría</label>
                        <select
                            value={nuevoProducto.category}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, category: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.name}>
                                    {categoria.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Descripción</label>
                        <textarea
                            placeholder="Descripción del producto..."
                            value={nuevoProducto.description}
                            onChange={(e) => setNuevoProducto({ ...nuevoProducto, description: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            rows={3}
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={agregarProducto}
                            className="w-full h-fit px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Agregar Producto
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productosFiltrados.map((producto) => (
                    <div
                        key={producto.id}
                        className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer ${!producto.active ? 'opacity-70 grayscale-[30%]' : ''
                            }`}
                        onClick={() => setProductoSeleccionado(producto)}
                    >
                        {/* Estado con posición fija */}
                        <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-semibold ${producto.active ? 'bg-green-400 text-green-800' : 'bg-red-300 text-red-800'
                            }`}>
                            {producto.active ? 'Activo' : 'Inactivo'}
                        </div>

                        {/* Contenedor de imagen */}
                        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                            {isValidImageUrl(producto.imageUrl) ? (
                                <Image
                                    src={producto.imageUrl}
                                    alt={producto.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    unoptimized={!producto.imageUrl.startsWith('/')}
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-gray-400 dark:text-gray-500">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Detalles del producto */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    {producto.name}
                                </h3>
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    ${producto.price}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {producto.category}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {producto.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {productoSeleccionado && (
                <ProductoModal
                    producto={productoSeleccionado}
                    onClose={() => setProductoSeleccionado(null)}
                    actualizarProductoLista={actualizarProductoLista}
                />
            )}
        </div>
    );
}