"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Home, Package, Tag, Settings, Users2Icon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useRestaurantConfig } from "@/hooks/useRestaurantConfig";

export default function Sidebar() {
    const [showUserModal, setShowUserModal] = useState(false);
    const { user, logout } = useAuth();
    const { config: restaurantConfig } = useRestaurantConfig();


    return (
        <div className="flex">
            {/* Modal del usuario */}
            {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowUserModal(false)}>
                    <div className="absolute top-2 left-20 bg-[#1E1E27] p-6 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-center">
                                <h3 className="text-white font-semibold">{user?.email}</h3>
                                <p className="text-gray-400 text-sm">Administrador</p>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <LogOut size={18} />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className="sticky top-0 h-screen bg-[#13131A] w-20 p-4 flex flex-col items-center z-50">
                {/* Logo clickable */}
                <div className="mb-6 cursor-pointer relative" onClick={() => setShowUserModal(true)}>
                    <div className="bg-slate-400 w-16 h-16 flex items-center justify-center rounded-full shadow-lg relative overflow-hidden">
                        <Image
                            src={restaurantConfig?.logoUrl || "/noLogo.png"}
                            alt="Logo"
                            fill
                            className="object-cover"
                            unoptimized={true}
                        />
                    </div>
                </div>


                {/* Opciones del menú */}
                <nav className="space-y-6 flex flex-col items-center">
                    <Link href="/admin/dashboard">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer">
                            <Home className="text-white" size={24} />
                        </div>
                    </Link>
                    <Link href="/admin/products">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer">
                            <Package className="text-white" size={24} />
                        </div>
                    </Link>
                    <Link href="/admin/discounts">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer">
                            <Tag className="text-white" size={24} />
                        </div>
                    </Link>
                    <Link href={"/admin/register"}>
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer">
                            <Users2Icon className="text-white" size={24} />
                        </div>
                    </Link>
                    <Link href="/admin/configuraciones">
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer">
                            <Settings className="text-white" size={24} />
                        </div>
                    </Link>
                </nav>
            </div>
        </div>
    );
}