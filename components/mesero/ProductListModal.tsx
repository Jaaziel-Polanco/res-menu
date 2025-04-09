// components/mesero/ProductListModal.tsx
"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Producto } from "@/types";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProduct: (product: Producto) => void;
}

export default function ProductListModal({ isOpen, onClose, onSelectProduct }: ProductListModalProps) {
    const [products, setProducts] = useState<Producto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "productos"));
                const productosData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    active: doc.data().active ?? true, // Valor por defecto true
                    ...doc.data()
                })) as Producto[];

                // Filtrar productos activos y los que no tienen campo active
                setProducts(productosData.filter(p => p.active));
            } finally {
                setLoading(false);
            }
        };
        if (isOpen) fetchProducts();
    }, [isOpen]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-gray-800 text-gray-100 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold">Agregar Productos</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-200 rounded-full p-1 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4 border-b border-gray-700">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    className="pl-10 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {loading ? (
                                <div className="col-span-full text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <motion.div
                                        key={product.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                                        onClick={() => {
                                            onSelectProduct(product);
                                            onClose();
                                        }}
                                    >
                                        <h3 className="font-semibold text-gray-100">{product.name}</h3>
                                        <p className="text-emerald-400 text-sm mt-1">
                                            ${product.price.toFixed(2)}
                                        </p>
                                        {product.description && (
                                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-400 py-8">
                                    No se encontraron productos
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}