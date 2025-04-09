"use client";
import { useState } from "react";
import Menu from "@/components/cliente/Menu";
import Cart from "@/components/cliente/Cart";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuPage() {
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const items = useCartStore((state) => state.items);
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="w-screen">
            {/* Sidebar del Cliente */}
            {/* Contenedor del Menú y Carrito */}
            <div className="flex flex-1">
                {/* Sección del Menú */}
                <Menu carritoAbierto={carritoAbierto} />

                {/* Sección del Carrito (visible en pantallas grandes) */}
                <div className="hidden min-[1200px]:block w-96">
                    <Cart
                        carritoAbierto={carritoAbierto}
                        setCarritoAbierto={setCarritoAbierto}
                    />
                </div>
            </div>

            {/* Sección del Carrito en móviles */}
            {carritoAbierto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <Cart
                        carritoAbierto={carritoAbierto}
                        setCarritoAbierto={setCarritoAbierto}
                    />
                </div>
            )}

            {/* Botón de Carrito para móviles */}
            <button
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full min-[1200px]:hidden shadow-lg"
                onClick={() => setCarritoAbierto(!carritoAbierto)}
            >
                <div className="relative">
                    <ShoppingCart size={35} />
                    <AnimatePresence mode="wait">
                        {cartCount > 0 && (
                            <motion.span
                                key={cartCount}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [20, 1], opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    type: "tween",
                                    duration: 0.3,
                                    ease: "circOut",
                                }}
                                className="absolute -top-6 -right-4 bg-red-500 text-white rounded-full w-7 h-8 flex items-center justify-center text-xs"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </button>
        </div>
    );
}
