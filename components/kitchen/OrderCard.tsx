import { Order } from '@/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const OrderCard = ({ order, onStatusChange }: {
    order: Order;
    onStatusChange: (newStatus: Order['status']) => void;
}) => {
    const getActionButton = () => {
        switch (order.status) {
            case 'pendiente':
                return (
                    <div className="flex gap-2 ">
                        <button
                            onClick={() => onStatusChange('preparacion')}
                            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-white"
                        >
                            Iniciar Preparación
                        </button>
                        <button
                            onClick={() => onStatusChange('cancelado')}
                            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md text-white"
                        >
                            Cancelar Orden
                        </button>
                    </div>
                );
            case 'preparacion':
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onStatusChange('completado')}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white"
                        >
                            Marcar como Listo
                        </button>
                        <button
                            onClick={() => onStatusChange('cancelado')}
                            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md text-white"
                        >
                            Cancelar Orden
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4 border-l-4 border-blue-500 animate-fade-right animate-once animate-duration-[1500ms] animate-ease-in-out animate-normal">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-xl font-bold text-white">Orden #{order.numeroOrden}</h3>
                    <p className="text-gray-400 text-sm">
                        {formatDistanceToNow(order.fecha, { addSuffix: true, locale: es })}
                    </p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="mb-4">
                <div className="flex gap-2">
                    <span className="font-semibold text-white">Mesa:</span>
                    <span className="text-gray-300">{order.mesa || 'N/A'}</span>
                    <span className="font-semibold text-white ml-4">Tipo:</span>
                    <span className="text-gray-300">{order.pedidoTipo}</span>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
                <h4 className="text-lg font-semibold text-white mb-2">Items:</h4>
                <ul className="space-y-2">
                    {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between items-center">
                            <div>
                                <p className="text-white">{item.name}</p>
                                {item.note && <p className="text-gray-400 text-sm">Nota: {item.note}</p>}
                            </div>
                            <span className="text-gray-300">x{item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Se ocultan los botones si la orden ya está completada o cancelada */}
            {order.status !== 'completado' && order.status !== 'cancelado' && (
                <div className="mt-4 flex justify-end">
                    {getActionButton()}
                </div>
            )}
        </div>
    );
};
