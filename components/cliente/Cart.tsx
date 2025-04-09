"use client";

import { useEffect, useState } from "react";
import { X, Trash2, Minus, Plus, Utensils, ShoppingBag, CheckCircle } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import PaymentOverlay from "./PaymentOverlay";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface CartProps {
    carritoAbierto: boolean;
    setCarritoAbierto: (open: boolean) => void;
}

export default function Cart({ carritoAbierto, setCarritoAbierto }: CartProps) {
    const { items, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [pedidoTipo, setPedidoTipo] = useState<"Dine In" | "To Go">("Dine In");
    const [confirmarPago, setConfirmarPago] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState<{
        total: number;
        orderNumber: number | null;
    }>({ total: 0, orderNumber: null });

    useEffect(() => {
        function handleResize() {
            const newIsDesktop = window.innerWidth >= 1200;
            if (newIsDesktop !== isDesktop) {
                setIsDesktop(newIsDesktop);
                setCarritoAbierto(false);
                setConfirmarPago(false);
            }
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isDesktop, setCarritoAbierto]);

    function handleOrderConfirmed(orderNumber: number, finalTotal: number) {
        setConfirmarPago(false);
        setCarritoAbierto(false);
        setConfirmedOrder({ total: finalTotal, orderNumber });
        setShowSuccessModal(true);
    }

    return (
        <>
            {confirmarPago && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
            )}

            <div
                className={cn(
                    "fixed top-0 right-0 w-96 bg-gray-900 text-white h-screen flex flex-col shadow-2xl transition-transform duration-300",
                    carritoAbierto ? "translate-x-0" : "translate-x-full",
                    "md:translate-x-0"
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingBag size={20} />
                            Mi Pedido
                        </h2>
                        <button
                            className={cn(
                                "p-1 hover:bg-gray-800 rounded-full",
                                isDesktop && "hidden"
                            )}
                            onClick={() => setCarritoAbierto(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {["Dine In", "To Go"].map((tipo) => (
                            <button
                                key={tipo}
                                onClick={() => setPedidoTipo(tipo as "Dine In" | "To Go")}
                                className={cn(
                                    "flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm",
                                    pedidoTipo === tipo
                                        ? "bg-orange-600 text-white"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                )}
                            >
                                {tipo === "Dine In" ? <Utensils size={16} /> : <ShoppingBag size={16} />}
                                {tipo}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto p-4 custom-scroll">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <ShoppingBag size={40} className="mb-3" />
                            <p>Tu carrito está vacío</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.li
                                        key={item.id}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{
                                            opacity: 0,
                                            x: -50,
                                            transition: { duration: 0.2 }
                                        }}
                                        className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    ${item.price.toFixed(2)} c/u
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-400 hover:text-red-500"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-1">
                                                <button
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    className="hover:bg-gray-600 p-1 rounded-full"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => increaseQuantity(item.id)}
                                                    className="hover:bg-gray-600 p-1 rounded-full"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <p className="font-medium">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 bg-gray-900 sticky bottom-0">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">Total:</span>
                        <span className="text-xl font-bold text-emerald-400">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={() => setConfirmarPago(true)}
                        disabled={total === 0}
                        className={cn(
                            "w-full py-3 rounded-lg font-medium transition-all",
                            "hover:scale-[1.02] active:scale-95",
                            total === 0
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500"
                        )}
                    >
                        Proceder al Pago
                    </button>
                </div>
            </div>

            {confirmarPago && (
                <PaymentOverlay
                    total={total}
                    pedidoTipo={pedidoTipo}
                    setConfirmarPago={setConfirmarPago}
                    onOrderConfirmed={handleOrderConfirmed}
                />
            )}

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative bg-gray-900 text-white p-6 rounded-xl shadow-2xl max-w-md w-full">
                        <div className="text-center mb-5">
                            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h2>
                            <p className="text-gray-300">
                                Tu pedido #{confirmedOrder.orderNumber} está en proceso
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Tipo:</span>
                                <span className="font-medium">{pedidoTipo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total:</span>
                                <span className="text-emerald-400 font-bold">${confirmedOrder.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}