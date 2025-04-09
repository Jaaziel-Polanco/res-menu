
// File: hooks/useNotificationsStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface NotificationsState {
  count: number;         // Número de órdenes activas (pendiente o preparacion)
  showArrow: boolean;    // Para mostrar la flecha animada
  subscribed: boolean;   // Para evitar suscribirse más de una vez

  initOrdersListener: () => void;  // Inicia la suscripción a las órdenes del cliente
  refreshOrdersListener: () => void; // Fuerza reiniciar la suscripción
  setShowArrow: (show: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      count: 0,
      showArrow: false,
      subscribed: false,

      initOrdersListener: () => {
        // Si ya se suscribió, salimos
        if (get().subscribed) return;
        set({ subscribed: true });

        // Obtener las órdenes del cliente desde localStorage
        const clientOrdersStr = localStorage.getItem("client-orders");
        let clientOrderNumbers: number[] = [];
        try {
          if (clientOrdersStr) {
            const clientOrders = JSON.parse(clientOrdersStr);
            clientOrderNumbers = clientOrders.map((order: any) => order.numeroOrden);
          }
        } catch (err) {
          console.error("Error al parsear client-orders:", err);
        }
        // Si no hay órdenes, no hacemos la consulta
        if (clientOrderNumbers.length === 0) return;

        // 'in' admite máximo 10 elementos. Si hay más, habría que realizar queries separadas.
        const q = query(
          collection(db, "pedidos"),
          where("numeroOrden", "in", clientOrderNumbers.slice(0, 10))
        );

        onSnapshot(
          q,
          (snapshot) => {
            try {
              // Filtrar solo las órdenes activas (pendiente o preparacion)
              const activeOrders = snapshot.docs
                .map((doc) => doc.data())
                .filter(
                  (data: any) =>
                    data.status === "pendiente" || data.status === "preparacion"
                );
              set({ count: activeOrders.length });
            } catch (err) {
              console.error("Error en onSnapshot:", err);
            }
          },
          (err) => {
            console.error("Error en onSnapshot:", err);
          }
        );
      },

      refreshOrdersListener: () => {
        // Forzar reinicialización de la suscripción
        set({ subscribed: false });
        get().initOrdersListener();
      },

      setShowArrow: (show) => {
        if (show) {
          set({ showArrow: true });
          setTimeout(() => set({ showArrow: false }), 10000);
        } else {
          set({ showArrow: false });
        }
      },
    }),
    {
      name: "notifications-storage",
      // Persistimos solo 'count'
      partialize: (state) => ({ count: state.count }),
    }
  )
);
