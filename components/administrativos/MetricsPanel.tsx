"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Order } from "@/types"; // Ajusta la ruta según la estructura de tu proyecto

// Registro de componentes necesarios
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


interface ChartDataset {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
}

interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

// Opciones por defecto para el gráfico
const defaultLineOptions = {
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

interface MetricsPanelProps {
    orders: Order[];
    getLineChartData: (
        metric: "revenue" | "dishes" | "mesas" | "orders",
        orders: Order[]
    ) => ChartData;
}

export default function MetricsPanel({ orders, getLineChartData }: MetricsPanelProps) {
    // Definición de las métricas a mostrar
    const metrics = [
        { key: "revenue", label: "Revenue Trend" },
        { key: "dishes", label: "Dish Ordered Trend" },
        { key: "mesas", label: "Mesas Trend" },
        { key: "orders", label: "Orders Trend" },
    ] as const;

    // Función para calcular la tendencia
    function computeTrend(metricKey: "revenue" | "dishes" | "mesas" | "orders") {
        const chartData = getLineChartData(metricKey, orders);
        const data = chartData.datasets[0].data;

        if (!data || data.length === 0) return { trend: 0, color: "#FFC107" };

        const first = Number(data[0]);
        const last = Number(data[data.length - 1]);
        const trendValue = last - first;

        let color = "#FFC107"; // Amarillo por defecto (estable)
        if (trendValue > 0) {
            color = "#28C76F"; // Verde: ganó
        } else if (trendValue < 0) {
            color = "#EA5455"; // Rojo: perdió
        }

        return { trend: trendValue, color };
    }

    return (
        <div className="space-y-6">
            {metrics.map((m) => {
                const { trend, color } = computeTrend(m.key);
                const chartData = getLineChartData(m.key, orders);

                // Actualizamos los colores de la gráfica
                const updatedChartData = {
                    ...chartData,
                    datasets: chartData.datasets.map(dataset => ({
                        ...dataset,
                        borderColor: color,
                        backgroundColor: color,
                    }))
                };

                return (
                    <div key={m.key} className="bg-[#2A2A3C] p-4 rounded">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold">{m.label}</h2>
                            <span className="text-sm" style={{ color }}>
                                {trend > 0 ? "Gained" : trend < 0 ? "Lost" : "Stable"}
                            </span>
                        </div>
                        <div className="w-full h-64">
                            <Line data={updatedChartData} options={defaultLineOptions} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}