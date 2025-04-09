"use client";

import AdminCategorias from '@/components/administrativos/AdminCategorias';
import AdminProductos from '@/components/administrativos/AdminProductos';
import { useState } from 'react';

const AdminProductsPage = () => {
    const [seccionActiva, setSeccionActiva] = useState<"productos" | "categorias">("productos");

    return (
        <div className="p-4 text-white max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Panel de Administración</h2>

            {/* Botones de navegación */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                <button
                    onClick={() => setSeccionActiva("productos")}
                    className={`px-4 py-2 rounded ${seccionActiva === "productos" ? "bg-blue-500" : "bg-gray-700"}`}
                >
                    Gestión de Productos
                </button>
                <button
                    onClick={() => setSeccionActiva("categorias")}
                    className={`px-4 py-2 rounded ${seccionActiva === "categorias" ? "bg-blue-500" : "bg-gray-700"}`}
                >
                    Gestión de Categorías
                </button>
            </div>

            {seccionActiva === "productos" ? <AdminProductos /> : <AdminCategorias />}
        </div>
    );
}

export default AdminProductsPage;