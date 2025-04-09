"use client";
import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getLineChartData, useFilteredOrders } from "@/hooks/useFilteredOrders";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import MetricsPanel from "./MetricsPanel"; // nuevo componente

// Registro de componentes de Chart.js
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Opciones para el gráfico donut
const doughnutOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom" as const,
            labels: {
                color: "#fff",
            },
        },
    },
};

// Opciones para el gráfico line (se reutilizan en MetricsPanel por defecto)
export const lineOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom" as const,
            labels: {
                color: "#fff",
            },
        },
        title: {
            display: true,
            text: "Metric Trend",
            color: "#fff",
        },
    },
};

export default function AdminDashboard() {
    // Filtros de fecha y estado
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    });
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    });
    const [statusFilter, setStatusFilter] = useState("all");

    // Hook con pedidos filtrados
    const {
        orders,
        loading,
        dailyRevenue,
        totalDishes,
        mostOrderedDishes,
        orderTypeCounts,
        totalMesas,
    } = useFilteredOrders({ startDate, endDate, statusFilter });

    if (loading) {
        return <div className="text-white">Cargando Dashboard...</div>;
    }

    const totalOrders = orders.length;
    const todayString = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    // Datos para el gráfico donut (Most Type of Order)
    const donutData = {
        labels: ["Dine In", "To Go", "Delivery"],
        datasets: [
            {
                data: [
                    orderTypeCounts["Dine In"] || 0,
                    orderTypeCounts["To Go"] || 0,
                    orderTypeCounts["Delivery"] || 0,
                ],
                backgroundColor: ["#7367F0", "#28C76F", "#EA5455"],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Contenido principal del Dashboard */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Encabezado */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-gray-400">{todayString}</p>
                        </div>
                    </div>

                    {/* Tarjetas principales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Revenue */}
                        <div className="bg-[#2A2A3C] p-4 rounded">
                            <p className="text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold">${dailyRevenue.toFixed(2)}</p>
                        </div>

                        {/* Total Dish Ordered */}
                        <div className="bg-[#2A2A3C] p-4 rounded">
                            <p className="text-gray-400">Total Dish Ordered</p>
                            <p className="text-2xl font-bold">{totalDishes}</p>
                        </div>

                        {/* Total Mesas */}
                        <div className="bg-[#2A2A3C] p-4 rounded">
                            <p className="text-gray-400">Total Mesas</p>
                            <p className="text-2xl font-bold">{totalMesas}</p>
                        </div>

                        {/* Daily Orders */}
                        <div className="bg-[#2A2A3C] p-4 rounded">
                            <p className="text-gray-400">Daily Orders</p>
                            <p className="text-2xl font-bold">{totalOrders}</p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className=" w-fit p-6 rounded flex flex-col sm:flex-row items-center gap-4">
                        {/* Fecha inicio */}
                        <div>
                            <label className="text-gray-300 block mb-1">Start Date</label>
                            <input
                                type="date"
                                className="bg-gray-700 text-white p-2 rounded"
                                value={formatDateInput(startDate)}
                                onChange={(e) => {
                                    const newDate = e.target.value ? new Date(e.target.value) : startDate;
                                    setStartDate(newDate);
                                }}
                            />
                        </div>
                        {/* Fecha fin */}
                        <div>
                            <label className="text-gray-300 block mb-1">End Date</label>
                            <input
                                type="date"
                                className="bg-gray-700 text-white p-2 rounded"
                                value={formatDateInput(endDate)}
                                onChange={(e) => {
                                    const newDate = e.target.value ? new Date(e.target.value) : endDate;
                                    setEndDate(newDate);
                                }}
                            />
                        </div>
                        {/* Status */}
                        <div>
                            <label className="text-gray-300 block mb-1">Status</label>
                            <select
                                className="bg-gray-700 text-white p-2 rounded"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="preparacion">Preparación</option>
                                <option value="completado">Completado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    {/* Order Report */}
                    <div className="bg-[#2A2A3C] p-4 rounded">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Order Report</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="max-h-[510px] overflow-y-auto custom-scroll">
                                <table className="min-w-full text-sm">
                                    <thead className="text-gray-400">
                                        <tr>
                                            <th className="py-2 text-left">Mesa</th>
                                            <th className="py-2 text-left">Menu</th>
                                            <th className="py-2 text-left">Total Payment</th>
                                            <th className="py-2 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-4 text-center text-gray-500">
                                                    No orders found with the selected filter.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((o) => {
                                                let statusColor = "text-yellow-400";
                                                if (o.status === "preparacion") statusColor = "text-blue-400";
                                                if (o.status === "completado") statusColor = "text-green-400";
                                                if (o.status === "cancelado") statusColor = "text-red-400";

                                                const itemsNames = o.items.map((item) => item.name).join(", ");
                                                return (
                                                    <tr key={o.id} className="border-b border-[#3A3A4F] last:border-none">
                                                        <td className="py-2">{o.mesa || "N/A"}</td>
                                                        <td className="py-2">{itemsNames}</td>
                                                        <td className="py-2">${o.total.toFixed(2)}</td>
                                                        <td className={`py-2 ${statusColor}`}>
                                                            {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sección inferior: Most Ordered y Donut Chart */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Most Ordered */}
                        <div className="bg-[#2A2A3C] p-4 rounded">
                            <h2 className="text-lg font-semibold mb-4">Most Ordered</h2>
                            <div className="space-y-2">
                                {mostOrderedDishes.slice(0, 3).map(([dish, count]) => (
                                    <div key={dish} className="flex items-center justify-between">
                                        <p className="text-gray-200">{dish}</p>
                                        <span className="text-gray-400">{count} dishes ordered</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Most Type of Order (gráfico donut) */}
                        <div className="bg-[#2A2A3C] p-4 rounded">
                            <h2 className="text-lg font-semibold mb-4">Most Type of Order</h2>
                            <div className="w-full h-64 flex items-center justify-center">
                                <Doughnut data={donutData} options={doughnutOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha: MetricsPanel con los 4 gráficos */}
                <div className="xl:col-span-1">
                    <MetricsPanel orders={orders} getLineChartData={getLineChartData} />
                </div>
            </div>
        </div>
    );
}

function formatDateInput(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

