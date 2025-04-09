"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useCartStore } from "@/hooks/useCartStore";
import { CreditCard, HandCoins, Loader2, Minus, Plus, Trash2, Wallet } from "lucide-react";
import { useNotificationsStore } from "@/hooks/useNotificationsStore";

interface PaymentOverlayProps {
    total: number;
    pedidoTipo: "Dine In" | "To Go";
    setConfirmarPago: (value: boolean) => void;
    onOrderConfirmed: (orderNumber: number, finalTotal: number) => void;
}

const paymentMethods: Array<"Credit Card" | "Paypal" | "Cash"> = [
    "Credit Card",
    "Paypal",
    "Cash",
];

export default function PaymentOverlay({
    total,
    pedidoTipo,
    setConfirmarPago,
    onOrderConfirmed,
}: PaymentOverlayProps) {
    const {
        items,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,

        clearCart,
        updateNote,
    } = useCartStore();

    const [metodoPago, setMetodoPago] = useState<"Credit Card" | "Paypal" | "Cash">("Credit Card");
    const [mesa, setMesa] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Estado para el número de orden real
    const [numeroOrden, setNumeroOrden] = useState<number | null>(null);

    // Extraer el número de mesa desde la URL o localStorage
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const mesaParam = params.get("mesa");
        if (mesaParam) {
            setMesa(mesaParam);
            localStorage.setItem("mesa", mesaParam);
        } else {
            // Si no está en la URL, intentamos obtenerlo de localStorage
            const storedMesa = localStorage.getItem("mesa");
            if (storedMesa) {
                setMesa(storedMesa);
            }
        }
    }, []);

    useEffect(() => {
        async function fetchNextOrderNumber() {
            try {
                const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
                const orders = pedidosSnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return typeof data.numeroOrden === "number" ? data.numeroOrden : 0;
                });
                const maxOrder = orders.length > 0 ? Math.max(...orders) : 0;
                setNumeroOrden(maxOrder + 1);
            } catch (error) {
                console.error("Error al obtener el número de orden:", error);
            }
        }
        fetchNextOrderNumber();
    }, []);

    async function handleConfirmOrder() {
        // Activar estado de carga
        setIsSubmitting(true);

        // Validaciones
        if (items.length === 0) {
            alert("No hay artículos en el carrito.");
            setIsSubmitting(false); // Desactivar carga si hay error
            return;
        }
        if (pedidoTipo === "Dine In" && mesa.trim() === "") {
            alert("El número de mesa es obligatorio para Dine In.");
            setIsSubmitting(false); // Desactivar carga si hay error
            return;
        }

        try {
            let finalTotal = total;
            if (metodoPago === "Paypal") {
                finalTotal = parseFloat((finalTotal * 1.02).toFixed(2));
            }

            const orderNumber = numeroOrden ?? 9999;

            const orderData = {
                numeroOrden: orderNumber,
                status: "pendiente",
                pedidoTipo,
                mesa: mesa || (pedidoTipo === "Dine In" ? "Sin asignar" : "N/A"),
                metodoPago,
                fecha: new Date().toISOString(),
                total: finalTotal,
                items: items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    note: item.note || "",
                })),
            };

            // Guardar en Firestore
            await addDoc(collection(db, "pedidos"), orderData);

            // Actualizar localStorage
            const clientOrdersStr = localStorage.getItem("client-orders") || "[]";
            const clientOrders = JSON.parse(clientOrdersStr);
            clientOrders.push(orderData);
            localStorage.setItem("client-orders", JSON.stringify(clientOrders));

            // Actualizar notificaciones
            const { refreshOrdersListener, setShowArrow } = useNotificationsStore.getState();
            refreshOrdersListener();
            setShowArrow(true);

            // Notificar éxito y limpiar
            onOrderConfirmed(orderNumber, finalTotal);
            clearCart();
            setConfirmarPago(false);

        } catch (error) {
            console.error("Error al guardar el pedido:", error);
            alert("Ocurrió un error al guardar el pedido. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false); // Siempre desactivar carga al final
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setConfirmarPago(false)}
            />

            <div className="relative w-full max-w-4xl bg-gray-900 text-white p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-6 overflow-hidden max-h-[95vh]">
                {/* Sección de Confirmación */}
                <div className="flex-1 md:pr-6 md:border-r border-gray-700 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span>✅</span>
                            Confirmar Pedido
                        </h2>
                        {numeroOrden && (
                            <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                                Orden #{numeroOrden}
                            </span>
                        )}
                    </div>

                    <ul className="space-y-3">
                        {items.map((item) => (
                            <li key={item.id} className="bg-gray-800 p-4 rounded-lg group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <p className="text-emerald-400 text-sm">
                                            ${item.price.toFixed(2)} c/u
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-1">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="hover:bg-gray-600 p-1 rounded-full transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQuantity(item.id)}
                                            className="hover:bg-gray-600 p-1 rounded-full transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <span className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>

                                <input
                                    type="text"
                                    placeholder="✏️ Añadir nota para cocina..."
                                    className="w-full p-2 mt-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={item.note || ""}
                                    onChange={(e) => updateNote(item.id, e.target.value)}
                                />
                            </li>
                        ))}
                    </ul>

                    <div className="sticky bottom-0 bg-gray-900 pt-4 mt-4">
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-gray-400">Total:</span>
                            <span className="font-bold text-emerald-400 text-xl">
                                ${total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sección de Pago */}
                <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span>💳</span>
                        Información de Pago
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Método de Pago
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {paymentMethods.map((tipo) => (
                                    <button
                                        key={tipo}
                                        onClick={() => setMetodoPago(tipo)}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${metodoPago === tipo
                                            ? "bg-orange-600/30 border-2 border-orange-500"
                                            : "bg-gray-800 hover:bg-gray-700"
                                            }`}
                                    >
                                        {tipo === "Credit Card" && <CreditCard size={20} />}
                                        {tipo === "Paypal" && <Wallet size={20} />}
                                        {tipo === "Cash" && <HandCoins size={20} />}
                                        <span>{tipo}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {metodoPago === "Paypal" && (
                            <div className="text-yellow-400 text-sm p-3 bg-yellow-900/20 rounded-lg">
                                ⚠️ Se aplicará 2% de comisión (+${(total * 0.02).toFixed(2)})
                            </div>
                        )}

                        {pedidoTipo === "Dine In" && (
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Número de Mesa
                                </label>
                                {mesa ? (
                                    <div className="p-3 bg-gray-800 rounded-lg">
                                        🪑 Mesa {mesa}
                                    </div>
                                ) : (
                                    <input
                                        type="number"
                                        placeholder="Ej: 12"
                                        className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        value={mesa}
                                        onChange={(e) => setMesa(e.target.value)}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto space-y-3">
                        {pedidoTipo === "To Go" && metodoPago !== "Paypal" && (
                            <div className="p-3 bg-blue-900/20 text-blue-400 rounded-lg flex gap-2">
                                💡 Se pagará al momento de la entrega
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setConfirmarPago(false)}
                                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <span>←</span>
                                Volver
                            </button>
                            <button
                                onClick={handleConfirmOrder}
                                disabled={isSubmitting}
                                className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-2 relative"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        <span>✅</span>
                                        Confirmar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
