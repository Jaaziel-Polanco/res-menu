"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso no autorizado</h1>
                <p className="text-gray-600 mb-6">
                    No tienes permisos para acceder a esta sección
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    );
}