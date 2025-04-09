'use client';

import { useOrders } from '@/hooks/useOrders';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OrderCard } from '@/components/kitchen/OrderCard';
import { WithAuth } from '@/components/administrativos/WithAuth';

function KitchenPage() {
    const { orders, loading, error, updateStatus } = useOrders();

    const statusGroups = ['pendiente', 'preparacion', 'completado'] as const;

    if (loading) return <div className="text-white text-center p-8">Cargando pedidos...</div>;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Panel de Cocina</h1>

            <Tabs defaultValue="pendiente" className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-800">
                    {statusGroups.map((status) => (
                        <TabsTrigger
                            key={status}
                            value={status}
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            {status.toUpperCase()}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {statusGroups.map((status) => (
                    <TabsContent key={status} value={status} className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {orders
                                .filter(order => order.status === status)
                                .map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        onStatusChange={(newStatus) => updateStatus(order.id, newStatus)}
                                    />
                                ))}
                            {orders.filter(order => order.status === status).length === 0 && (
                                <div className="text-gray-400 col-span-full text-center py-8">
                                    No hay pedidos {status}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

export default WithAuth(["MESERO", "ADMINISTRADOR"])(KitchenPage);