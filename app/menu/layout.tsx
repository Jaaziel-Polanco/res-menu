"use client";

import React, { useEffect } from "react";
import ClientSidebar from "@/components/cliente/ClientSidebar";
import { useNotificationsStore } from "@/hooks/useNotificationsStore";

export default function MenuLayout({ children }: { children: React.ReactNode }) {
    const { initOrdersListener } = useNotificationsStore();

    useEffect(() => {
        // Inicia la suscripción a las órdenes del cliente
        initOrdersListener();
    }, [initOrdersListener]);

    return (
        <div className="flex">
            <ClientSidebar />
            {children}
        </div>
    );
}
