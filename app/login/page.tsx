"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, user, role } = useAuth();
    const router = useRouter();

    // Nuevo useEffect para manejar redirección
    useEffect(() => {
        if (user && role) {
            if (role === "ADMINISTRADOR") {
                router.push("/admin");
            } else if (role === "MESERO") {
                router.push("/meseros");
            } else {
                setError("Usuario no tiene un rol asignado");
            }
        }
    }, [user, role, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
        } catch (error) {
            // Verificamos primero si es una instancia de Error
            const errorMessage = error instanceof Error
                ? error.message.includes("desactivada")
                    ? "Cuenta desactivada"
                    : "Credenciales incorrectas"
                : "Error desconocido al iniciar sesión";

            setError(errorMessage);
        }
    };

    if (user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
            <div className="bg-slate-400 p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4 text-black">
                    <div>
                        <label className="block text-gray-700 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            placeholder="ejemplo@restaurante.com"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Acceder al Sistema
                    </button>
                </form>
            </div>
        </div>
    );
}