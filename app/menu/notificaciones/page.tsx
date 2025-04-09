"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
    getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Bell } from "lucide-react";
import Loading from "@/components/ui/Loading";

interface OrderData {
    id: string;
    numeroOrden: number;
    status: "pendiente" | "preparacion" | "completado";
    pedidoTipo: "Dine In" | "To Go";
    mesa: string;
    metodoPago: "Credit Card" | "Paypal" | "Cash";
    fecha: Date;
    total: number;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        note: string;
    }[];
}

export default function NotificationPage() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

    // Obtén los números de orden del cliente desde localStorage
    useEffect(() => {
        const clientOrdersStr = localStorage.getItem("client-orders");
        let clientOrderNumbers: number[] = [];
        if (clientOrdersStr) {
            try {
                const clientOrders = JSON.parse(clientOrdersStr) as OrderData[];
                clientOrderNumbers = clientOrders.map(order => order.numeroOrden);
            } catch (err) {
                console.error("Error parsing client-orders:", err);
            }
        }

        if (clientOrderNumbers.length === 0) {
            setLoading(false);
            return;
        }

        // Consulta: pedidos cuyo numeroOrden está en el array de órdenes del cliente
        // (Nota: "in" admite máximo 10 elementos)
        const q = query(
            collection(db, "pedidos"),
            where("numeroOrden", "in", clientOrderNumbers)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                try {
                    const ordersData = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        const fecha =
                            data.fecha && typeof data.fecha.toDate === "function"
                                ? data.fecha.toDate()
                                : new Date(data.fecha);
                        return {
                            id: doc.id,
                            ...data,
                            fecha,
                        } as OrderData;
                    });
                    // Ordenamos de más reciente a menos reciente
                    setOrders(ordersData.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()));
                    setLoading(false);
                } catch (err) {
                    console.error(err);
                    setLoading(false);
                }
            },
            (err) => {
                console.error("Error onSnapshot:", err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    async function cancelOrder(orderNumber: number) {
        try {
            const q = query(
                collection(db, "pedidos"),
                where("numeroOrden", "==", orderNumber)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (docSnap) => {
                const docRef = doc(db, "pedidos", docSnap.id);
                await updateDoc(docRef, { status: "cancelado" });
            });
            // También se puede actualizar localStorage si se desea, pero la UI se actualizará gracias al onSnapshot
        } catch (error) {
            console.error("Error al cancelar el pedido:", error);
            alert("Ocurrió un error al cancelar el pedido.");
        }
    }

    function handleConfirmCancellation() {
        if (orderToCancel !== null) {
            cancelOrder(orderToCancel);
            setOrderToCancel(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-white flex items-center">
                        <Bell className="mr-3" size={36} /> Mis Pedidos
                    </h1>
                    <p className="text-gray-300 mt-4">
                        Revisa el estado de tus órdenes y mantente al tanto de su progreso.
                    </p>
                </header>

                {orders.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-6 shadow">
                        <p className="text-center text-gray-400">
                            No tienes notificaciones.
                        </p>
                    </div>
                ) : (
                    // Grid responsivo:
                    // 1 columna en pantallas pequeñas,
                    // 2 columnas en pantallas medianas (md),
                    // 3 columnas en pantallas grandes (lg).
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order) => (
                            <div
                                key={order.numeroOrden}
                                className="bg-gray-800 rounded-lg p-6 shadow animate-fade-right animate-once animate-duration-[1500ms] animate-ease-in-out animate-normal"
                            >
                                {/* Encabezado con Orden y Estatus */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-2xl font-semibold text-white">
                                            Orden #{order.numeroOrden}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Fecha: {new Date(order.fecha).toLocaleString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "pendiente"
                                            ? "bg-yellow-600 text-black"
                                            : order.status === "preparacion"
                                                ? "bg-blue-600 text-white"
                                                : order.status === "completado"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-600 text-white"
                                            }`}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>

                                {/* Información del pedido */}
                                <div className="mt-4 text-gray-300 space-y-2">
                                    <p>
                                        <strong>Total:</strong> ${order.total.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Tipo:</strong> {order.pedidoTipo}
                                    </p>
                                    {order.pedidoTipo === "Dine In" && (
                                        <p>
                                            <strong>Mesa:</strong> {order.mesa}
                                        </p>
                                    )}
                                </div>

                                {/* Botón Cancelar (solo si está pendiente) */}
                                {order.status === "pendiente" && (
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            onClick={() => setOrderToCancel(order.numeroOrden)}
                                            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de confirmación de cancelación */}
            {orderToCancel !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                        onClick={() => setOrderToCancel(null)}
                    ></div>
                    <div className="relative bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Confirmar Cancelación</h2>
                        <p className="mb-6">
                            ¿Estás seguro que deseas cancelar la orden #{orderToCancel}? Esta
                            acción no se puede revertir.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setOrderToCancel(null)}
                                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleConfirmCancellation}
                                className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
                            >
                                Confirmar Cancelación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}