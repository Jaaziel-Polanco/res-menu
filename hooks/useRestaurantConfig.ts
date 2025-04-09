import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { RestaurantConfig } from '@/types';

export const useRestaurantConfig = () => {
    const [config, setConfig] = useState<RestaurantConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, "restaurantConfig", "currentConfig");

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as RestaurantConfig;
                setConfig(data);
                document.documentElement.style.setProperty('--main-font', data.fontFamily);
            } else {
                console.log("¡No existe la configuración!");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { config, loading };
};