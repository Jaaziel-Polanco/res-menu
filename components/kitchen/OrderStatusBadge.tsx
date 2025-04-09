import { Order } from '@/types';

export const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
    const statusConfig = {
        pendiente: { color: 'bg-red-500', text: 'PENDIENTE' },
        preparacion: { color: 'bg-yellow-500', text: 'EN PREPARACIÓN' },
        completado: { color: 'bg-green-500', text: 'COMPLETADO' },
        cancelado: { color: 'bg-gray-500', text: 'CANCELADO' },
    };

    return (
        <span className={`${statusConfig[status].color} text-white px-3 py-1 rounded-full text-sm`}>
            {statusConfig[status].text}
        </span>
    );
};
