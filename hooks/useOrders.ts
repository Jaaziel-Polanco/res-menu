// file: src/hooks/useOrders.ts
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Order } from '@/types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'pedidos'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const ordersData = snapshot.docs.map(doc => {
          const data = doc.data();
          const fecha = data.fecha?.toDate?.() || new Date(data.fecha);
          return {
            id: doc.id,
            ...data,
            fecha,
          } as Order;
        });
        
        setOrders(ordersData.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()));
        setLoading(false);
      } catch (err) {
        setError('Error cargando pedidos');
        console.error(err);
        setLoading(false);
      }
    }, (err) => {
      console.error(err);
      setError('Error cargando pedidos');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función específica para cocina (solo cambia estado)
  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'pedidos', orderId), { status: newStatus });
    } catch (err) {
      console.error('Error actualizando estado:', err);
      throw err;
    }
  };

  // Función extendida para meseros (actualización parcial)
  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      await updateDoc(doc(db, 'pedidos', orderId), updates);
    } catch (err) {
      console.error('Error actualizando orden:', err);
      throw err;
    }
  };

  return { orders, loading, error, updateStatus, updateOrder };
};