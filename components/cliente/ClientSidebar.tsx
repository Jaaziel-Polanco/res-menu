"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Tag, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNotificationsStore } from "@/hooks/useNotificationsStore";
import { useRestaurantConfig } from "@/hooks/useRestaurantConfig";

export default function ClientSidebar() {
    const { count, showArrow } = useNotificationsStore();
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const { config: restaurantConfig } = useRestaurantConfig();


    // Detecta el ancho de la ventana para determinar si es pantalla grande (lg)
    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Define el estilo de la flecha según el tamaño de pantalla
    const arrowStyle = {
        top: isLargeScreen ? "calc(50% - 100px)" : "calc(50% - 75px)",
        left: "70px",
    };

    return (
        <>
            <div className="flex animate-flip-down animate-once animate-duration-[1300ms] animate-ease-out animate-normal">
                {/* Sidebar fijo con sticky */}
                <div className="sticky top-0 h-screen w-20 p-4 flex flex-col items-center z-50">
                    {/* Logo del restaurante */}
                    <div className="mb-6">
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
                        <Link href="/menu">
                            <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer">
                                <Home className="text-white" size={35} />
                            </div>
                        </Link>

                        <Link href="/descuentos">
                            <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer">
                                <Tag className="text-white" size={35} />
                            </div>
                        </Link>

                        <Link href="/menu/notificaciones">
                            <div className="relative w-14 h-14 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer">
                                <Bell className="text-white" size={35} />

                                {/* Badge de notificaciones */}
                                {count > 0 && (
                                    <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs animate-bounce animate-infinite animate-duration-800 animate-ease-in-out">
                                        {count}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Flecha animada posicionada de forma fija para quedar siempre por encima */}
            {showArrow && (
                <div
                    className="fixed z-[9999] animate-jump animate-infinite animate-duration-700 animate-ease-in-out"
                    style={arrowStyle}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-orange-500 transform rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </div>
            )}
        </>
    );
}
