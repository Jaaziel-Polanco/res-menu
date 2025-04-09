"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, setDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import { WithAuth } from "@/components/administrativos/WithAuth";
import { UserPlus, ToggleLeft, ToggleRight, UserPlus2Icon } from "lucide-react";
import Loading from "@/components/ui/Loading";

interface UserData {
    uid: string;
    email: string | null;
    role: string;
    active: boolean;
}

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("MESERO");
    const [users, setUsers] = useState<UserData[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData: UserData[] = [];
            querySnapshot.forEach((doc) => {
                usersData.push({
                    uid: doc.id,
                    email: doc.data().email,
                    role: doc.data().role,
                    active: doc.data().active ?? true
                });
            });
            setUsers(usersData);
        } catch (error) {
            setError("Error al cargar usuarios" + error);
        }
    };

    useEffect(() => {
        if (user) fetchUsers();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!email || !password || !role) {
                throw new Error("Todos los campos son requeridos");
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            try {
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    email: userCredential.user.email,
                    role: role,
                    active: true,
                    createdAt: new Date()
                });
            } catch (firestoreError) {
                await deleteUser(userCredential.user);
                throw new Error(`Error al guardar los datos del usuario: ${firestoreError instanceof Error ? firestoreError.message : 'Error desconocido'
                    }`);
            }

            await fetchUsers();
            setEmail("");
            setPassword("");
            setRole("MESERO");
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message.includes("Firestore")
                    ? "Error en el sistema. Contacte al administrador"
                    : error.message
                : "Ocurrió un error desconocido";

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
        const action = currentStatus ? "desactivar" : "activar";
        if (window.confirm(`¿Estás seguro de ${action} este usuario?`)) {
            try {
                await updateDoc(doc(db, "users", userId), {
                    active: !currentStatus
                });
                await fetchUsers();
            } catch (error) {
                setError(`Error al ${action} el usuario` + error);
            }
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto w-full min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Gestión de Usuarios
            </h1>

            {/* Formulario de Registro */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                <div className="flex items-center gap-2 mb-6">
                    <UserPlus2Icon className="w-10 h-10 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Crear Nuevo Usuario
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                       dark:bg-gray-700 dark:text-gray-100 transition-all"
                            placeholder="usuario@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                       dark:bg-gray-700 dark:text-gray-100 transition-all"
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                            Rol
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 
                                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                       dark:bg-gray-700 dark:text-gray-100 appearance-none bg-select-arrow"
                        >
                            <option value="MESERO">Mesero</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                               rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loading />
                            <span>Creando...</span>
                        </>
                    ) : (
                        <>
                            <UserPlus className="w-5 h-5" />
                            <span>Crear Usuario</span>
                        </>
                    )}
                </button>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 
                                rounded-lg text-sm border border-red-100 dark:border-red-800/50">
                        {error}
                    </div>
                )}
            </form>

            {/* Lista de Usuarios */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
                    Usuarios Registrados ({users.length})
                </h2>

                {/* Versión Mobile */}
                <div className="md:hidden space-y-3">
                    {users.map((user) => (
                        <div key={user.uid} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[200px]">
                                        {user.email}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === "ADMINISTRADOR"
                                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                            : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleUserStatus(user.uid, user.active)}
                                    className={`p-2 rounded-lg transition-colors ${user.active
                                        ? "bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-800/30 dark:hover:bg-red-800/50 dark:text-red-400"
                                        : "bg-green-100 hover:bg-green-200 text-green-600 dark:bg-green-800/30 dark:hover:bg-green-800/50 dark:text-green-400"
                                        }`}
                                >
                                    {user.active ? (
                                        <ToggleLeft className="w-5 h-5" />
                                    ) : (
                                        <ToggleRight className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className={`${user.active
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                    }`}>
                                    {user.active ? "Activo" : "Inactivo"}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                    Últ. actualización: Ahora
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Versión Desktop */}
                <div className="hidden md:block">
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Rol
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 max-w-[250px] truncate">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "ADMINISTRADOR"
                                                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                                : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`flex items-center gap-2 ${user.active
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${user.active ? "bg-green-500" : "bg-red-500"
                                                    }`}></span>
                                                {user.active ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleToggleUserStatus(user.uid, user.active)}
                                                className={`p-2 rounded-lg transition-colors ${user.active
                                                    ? "hover:bg-red-50 text-red-600 dark:hover:bg-red-800/30"
                                                    : "hover:bg-green-50 text-green-600 dark:hover:bg-green-800/30"
                                                    }`}
                                            >
                                                {user.active ? (
                                                    <ToggleLeft className="w-5 h-5" />
                                                ) : (
                                                    <ToggleRight className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithAuth(["ADMINISTRADOR"])(RegisterPage);