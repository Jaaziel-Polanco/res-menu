// app/mesero/page.tsx
"use client";
import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Order, Producto } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, CheckCircle, ShoppingBag, X, Utensils, LogOut } from "lucide-react";
import ProductListModal from "@/components/mesero/ProductListModal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Loading from "@/components/ui/Loading";
import { WithAuth } from "@/components/administrativos/WithAuth";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";

function MeseroPage() {
    const { orders, loading, updateOrder } = useOrders();
    const { logout } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const activeOrders = orders.filter(order =>
        ['pendiente', 'preparacion'].includes(order.status)
    );

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (!selectedOrder) return;
        const newItems = selectedOrder.items
            .map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item)
            .filter(item => item.quantity > 0);

        const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setSelectedOrder({ ...selectedOrder, items: newItems, total: newTotal });
    };

    const handleAddProduct = (product: Producto) => {
        if (!selectedOrder) return;
        const existingItem = selectedOrder.items.find(item => item.id === product.id);

        const newItems = existingItem
            ? selectedOrder.items.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item)
            : [...selectedOrder.items, {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                note: ''
            }];

        const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setSelectedOrder({ ...selectedOrder, items: newItems, total: newTotal });
    };

    const handleSaveChanges = async () => {
        if (!selectedOrder) return;
        try {
            await updateOrder(selectedOrder.id, {
                items: selectedOrder.items,
                total: selectedOrder.total
            });
            // Opcional: Mostrar notificación de éxito
        } catch (error) {
            console.error("Error saving changes:", error);
            // Mostrar error al usuario
        }
    };

    const handleCompleteOrder = async () => {
        if (!selectedOrder) return;
        try {
            await updateOrder(selectedOrder.id, {
                status: 'completado',
                // Agregar timestamp de completado si es necesario
                completedAt: new Date().toISOString()
            });
            setSelectedOrder(null);
            // Opcional: Mostrar notificación de éxito
        } catch (error) {
            console.error("Error completing order:", error);
            // Mostrar error al usuario
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-100">
            {/* Mobile Menu Button */}
            <div className="fixed bottom-6 right-6 flex gap-2 z-50 md:hidden">
                <button
                    className="p-4 bg-blue-600 text-white rounded-full shadow-lg"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <ShoppingBag size={24} />
                </button>

                <Link href="/kitchen" className="p-4 bg-orange-600 text-white rounded-full shadow-lg">
                    <Utensils size={24} />
                </Link>
            </div>

            {/* Order List */}
            <div className={cn(
                "w-full md:w-96 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 fixed md:relative md:translate-x-0 z-40 h-screen",
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Órdenes Activas</h2>
                        <div className="flex gap-2">
                            <button
                                className="md:hidden p-2 hover:bg-gray-700 rounded-full"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                    {activeOrders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "p-4 mb-3 rounded-lg cursor-pointer transition-colors",
                                selectedOrder?.id === order.id
                                    ? "bg-blue-900/30 border border-blue-600"
                                    : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                            )}
                            onClick={() => {
                                setSelectedOrder(order);
                                setIsMenuOpen(false);
                            }}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">Orden #{order.numeroOrden}</h3>
                                    <div className="text-sm text-gray-300 mt-1">
                                        <span className="capitalize">{order.status}</span> •
                                        {order.pedidoTipo === 'Dine In' ? ` Mesa ${order.mesa}` : ' Para llevar'}
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-emerald-400">
                                    ${order.total.toFixed(2)}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Mesero - Panel de Control</h1>
                    <div className="flex gap-2">
                        <Link href="/kitchen" className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg flex items-center gap-2">
                            <Utensils size={20} />
                            <span className="hidden md:block">Cocina</span>
                        </Link>
                        <Button
                            onClick={logout}
                            variant="ghost"
                            className="text-red-400 hover:bg-red-900/30"
                        >
                            <LogOut size={20} className="mr-2" />
                            <span className="hidden md:block">Cerrar Sesión</span>
                        </Button>
                    </div>
                </div>

                {/* Order Details */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {selectedOrder ? (
                        <div className="max-w-3xl mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div className="mb-4 md:mb-0">
                                    <h1 className="text-2xl font-bold flex items-center gap-2">
                                        <ShoppingBag className="text-blue-400" size={24} />
                                        Orden #{selectedOrder.numeroOrden}
                                    </h1>
                                    <div className="text-sm text-gray-400 mt-1">
                                        {new Date(selectedOrder.fecha).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button
                                        onClick={handleSaveChanges}
                                        className="w-full md:w-auto bg-gray-700 hover:bg-gray-600"
                                    >
                                        Guardar Cambios
                                    </Button>
                                    <Button
                                        onClick={handleCompleteOrder}
                                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500"
                                    >
                                        <CheckCircle className="mr-2" size={18} />
                                        Completar Orden
                                    </Button>
                                </div>
                            </div>

                            <Button
                                onClick={() => setIsProductModalOpen(true)}
                                className="w-full mb-6 bg-gray-700 hover:bg-gray-600 border border-gray-600"
                            >
                                + Agregar Productos
                            </Button>

                            <div className="space-y-3">
                                <AnimatePresence>
                                    {selectedOrder.items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                                    <p className="text-emerald-400 text-sm">
                                                        ${item.price.toFixed(2)} c/u
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 ml-4">
                                                    <div className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-300 hover:bg-gray-600"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        >
                                                            <Minus size={16} />
                                                        </Button>
                                                        <span className="w-6 text-center text-gray-100">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-300 hover:bg-gray-600"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus size={16} />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:bg-red-900/30"
                                                        onClick={() => handleQuantityChange(item.id, 0)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <Input
                                                type="text"
                                                placeholder="Notas para la cocina..."
                                                className="mt-3 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                                                value={item.note || ''}
                                                onChange={(e) => {
                                                    const newItems = selectedOrder.items.map(i =>
                                                        i.id === item.id
                                                            ? { ...i, note: e.target.value }
                                                            : i
                                                    );
                                                    setSelectedOrder({ ...selectedOrder, items: newItems });
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <ShoppingBag size={40} className="mb-3" />
                            <p>Selecciona una orden para comenzar</p>
                        </div>
                    )}
                </div>
            </div>

            <ProductListModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSelectProduct={handleAddProduct}
            />
        </div>
    );
}

export default WithAuth(["MESERO"])(MeseroPage);