// hooks/useCartStore.ts
"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Order } from "@/types";

export interface FilteredOrdersResult {
  orders: Order[];
  loading: boolean;
  dailyRevenue: number;
  totalDishes: number;
  mostOrderedDishes: Array<[string, number]>;
  orderTypeCounts: { [key: string]: number };
  totalMesas: number; // conteo de mesas únicas
}

interface UseFilteredOrdersProps {
  startDate: Date;
  endDate: Date;
  statusFilter: string; // "all" | "pendiente" | "preparacion" | "completado" | "cancelado"
}

/**
 * Hook que obtiene en tiempo real los pedidos filtrados por fecha y estado.
 * Reemplazamos 'customer' por 'mesa' según tu petición.
 */
export function useFilteredOrders({
  startDate,
  endDate,
  statusFilter,
}: UseFilteredOrdersProps): FilteredOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Métricas
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [totalDishes, setTotalDishes] = useState(0);
  const [mostOrderedDishes, setMostOrderedDishes] = useState<Array<[string, number]>>([]);
  const [orderTypeCounts, setOrderTypeCounts] = useState<{ [key: string]: number }>({});
  const [totalMesas, setTotalMesas] = useState(0);

  useEffect(() => {
    // Construimos las condiciones del query
    const isoStart = startDate.toISOString();
    const isoEnd = endDate.toISOString();

    const constraints: QueryConstraint[] = [
      where("fecha", ">=", isoStart),
      where("fecha", "<", isoEnd),
    ];

    // Si statusFilter != "all", agregamos where("status", "==", statusFilter)
    if (statusFilter !== "all") {
      constraints.push(where("status", "==", statusFilter));
    }

    const q = query(collection(db, "pedidos"), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docsData: Order[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Order, "id">;
          return { id: doc.id, ...data };
        });

        setOrders(docsData);

        // Cálculo de métricas
        let revenue = 0;
        let dishesCount = 0;
        const dishMap: { [key: string]: number } = {};
        const typeCounts: { [key: string]: number } = {};
        const mesasSet = new Set<string>();

        docsData.forEach((order) => {
          // Solo se cuenta el total si el pedido está completado
          if (order.status === "completado") {
            revenue += order.total;
          }

          // Conteo de platos (se puede dejar sin filtrar, según el negocio)
          order.items.forEach((item) => {
            dishesCount += item.quantity;
            dishMap[item.name] = (dishMap[item.name] || 0) + item.quantity;
          });

          // Conteo de tipos de pedido
          typeCounts[order.pedidoTipo] = (typeCounts[order.pedidoTipo] || 0) + 1;

          // Conteo de mesas únicas
          if (order.mesa) {
            mesasSet.add(order.mesa);
          }
        });

        // Ordenar platos (más pedidos → menos pedidos)
        const sortedDishes = Object.entries(dishMap).sort((a, b) => b[1] - a[1]);

        setDailyRevenue(revenue);
        setTotalDishes(dishesCount);
        setMostOrderedDishes(sortedDishes);
        setOrderTypeCounts(typeCounts);
        setTotalMesas(mesasSet.size);
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener pedidos:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [startDate, endDate, statusFilter]);

  return {
    orders,
    loading,
    dailyRevenue,
    totalDishes,
    mostOrderedDishes,
    orderTypeCounts,
    totalMesas,
  };
}

/**
 * Función para agrupar los pedidos por fecha y extraer datos de tendencia.
 * En revenue, solo se sumarán los pedidos completados.
 */
function groupOrdersByDate(orders: any[]) {
  const grouped: {
    [date: string]: { revenue: number; dishes: number; orders: number; mesas: number };
  } = {};
  orders.forEach((o) => {
    const dateStr = new Date(o.fecha).toISOString().split("T")[0];
    if (!grouped[dateStr]) {
      grouped[dateStr] = { revenue: 0, dishes: 0, orders: 0, mesas: 0 };
    }
    // Solo se suma el total si el pedido está completado
    if (o.status === "completado") {
      grouped[dateStr].revenue += o.total;
    }
    grouped[dateStr].orders += 1;
    o.items.forEach((item: any) => {
      grouped[dateStr].dishes += item.quantity;
    });
    grouped[dateStr].mesas += 1;
  });
  return grouped;
}

/**
 * Función para obtener chart data según la métrica seleccionada.
 */
export function getLineChartData(
  metric: "revenue" | "dishes" | "mesas" | "orders",
  orders: any[]
) {
  const grouped = groupOrdersByDate(orders);
  const labels = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const data = labels.map((date) => grouped[date][metric]);
  return {
    labels,
    datasets: [
      {
        label:
          metric === "revenue"
            ? "Revenue"
            : metric === "dishes"
            ? "Dish Ordered"
            : metric === "orders"
            ? "Orders"
            : "Mesas",
        data,
        backgroundColor: "rgba(55, 125, 255, 0.5)",
        borderColor: "rgba(55, 125, 255, 1)",
        fill: false,
      },
    ],
  };
}
