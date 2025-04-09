"use client";

import { useState, useEffect } from "react";

interface CategoryTabsProps {
    categorias: string[];
    categoriaSeleccionada: string;
    setCategoriaSeleccionada: (categoria: string) => void;
}

export default function CategoryTabs({
    categorias,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
}: CategoryTabsProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
        }
        // Evaluación inicial
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) {
        return (
            <div className="mb-4">
                <select
                    className="w-full h-12 bg-gray-800 text-white p-2 rounded-lg border border-gray-600 focus:outline-none"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                >
                    {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                            {categoria}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className="md:w-[600px] lg:w-full overflow-x-auto custom-scroll animate-fade-right animate-ease-in animate-normal animate-fill-forwards">
            <div className="inline-flex whitespace-nowrap space-x-4 border-b border-gray-600 pb-2"
                style={{ minWidth: "100%" }}>
                {categorias.map((categoria) => (
                    <button
                        key={categoria}
                        onClick={() => setCategoriaSeleccionada(categoria)}
                        className={`flex-shrink-0 px-4 py-2 text-sm font-semibold ${categoriaSeleccionada === categoria
                            ? "border-b-2 border-white text-white"
                            : "text-gray-400"
                            }`}
                    >
                        {categoria}
                    </button>
                ))}
            </div>
        </div>
    );
}
