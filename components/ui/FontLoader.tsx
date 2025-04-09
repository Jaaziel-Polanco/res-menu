// components/FontLoader.tsx
'use client';
import { useEffect } from 'react';
import { useRestaurantConfig } from '@/hooks/useRestaurantConfig';

export default function FontLoader() {
    const { config } = useRestaurantConfig();

    useEffect(() => {
        if (config?.fontFamily) {
            document.documentElement.style.setProperty('--main-font', config.fontFamily);
        }
    }, [config?.fontFamily]);

    return null;
}