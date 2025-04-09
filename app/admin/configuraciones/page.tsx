// app/configuracion/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { RestaurantConfig } from '@/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle } from 'lucide-react';

// Fuentes divididas en principales y secundarias
const PRIMARY_FONTS = [
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Raleway', value: 'Raleway' }
];

const SECONDARY_FONTS = [
    { name: 'Nunito', value: 'Nunito' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Source Sans 3', value: 'Source Sans 3' },
    { name: 'Ubuntu', value: 'Ubuntu' },
    { name: 'Work Sans', value: 'Work Sans' },
    { name: 'Fira Sans', value: 'Fira Sans' },
    { name: 'Quicksand', value: 'Quicksand' },
    { name: 'Josefin Sans', value: 'Josefin Sans' },
    { name: 'Space Grotesk', value: 'Space Grotesk' },
    { name: 'Josefin Slab', value: 'Josefin Slab' },
    { name: 'Archivo', value: 'Archivo' },
    { name: 'Lexend Deca', value: 'Lexend Deca' },
    { name: 'DM Sans', value: 'DM Sans' },
    { name: 'Noto Sans', value: 'Noto Sans' },
    { name: 'Sora', value: 'Sora' },
    { name: 'Rubik', value: 'Rubik' },
    { name: 'Barlow', value: 'Barlow' }
];

export default function ConfigPage() {
    const [config, setConfig] = useState<RestaurantConfig>({
        name: '',
        logoUrl: '',
        coordinates: { lat: 0, lng: 0 },
        deliveryRange: 2000,
        fontFamily: 'Inter'
    });

    const [logoError, setLogoError] = useState(false);
    const [showMoreFonts, setShowMoreFonts] = useState(false);
    const [showSaveNotification, setShowSaveNotification] = useState(false); // Cambiado el nombre del estado

    useEffect(() => {
        const loadConfig = async () => {
            const docRef = doc(db, "restaurantConfig", "currentConfig");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setConfig(docSnap.data() as RestaurantConfig);
            }
        };
        loadConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, "restaurantConfig", "currentConfig"), config);

            // Mostrar notificación de cambios guardados
            setShowSaveNotification(true);
            setTimeout(() => {
                setShowSaveNotification(false);
            }, 3000);

            // Disparar eventos de actualización
            window.dispatchEvent(new Event('visibilitychange'));
            window.dispatchEvent(new CustomEvent('notify', {
                detail: { message: 'Cambios guardados!', type: 'success' }
            }));
        } catch (error) {
            console.error('Error saving config:', error);
        }
    };

    const handleImageError = () => setLogoError(true);

    const updateFontFamily = (font: string) => {
        setConfig(prev => ({ ...prev, fontFamily: font }));
        document.documentElement.style.setProperty('--main-font', font);
        // Eliminada la notificación de aquí
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700"
                >
                    <h1 className="text-3xl font-bold text-gray-100 mb-8">Configuración del Restaurante</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sección de Previsualización */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-dashed border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-300 mb-4">Vista Previa</h2>
                            <div className="space-y-6">
                                <div className="flex flex-col items-center">
                                    <div className="relative w-32 h-32 rounded-full bg-gray-700 shadow-lg overflow-hidden group">
                                        <Image
                                            src={logoError ? '/noLogo.png' : config.logoUrl || '/noLogo.png'}
                                            alt="Logo Preview"
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={handleImageError}
                                            unoptimized
                                        />
                                    </div>
                                    <h3 className="mt-4 text-xl font-medium text-gray-100" style={{ fontFamily: config.fontFamily }}>
                                        {config.name || 'Nombre del Restaurante'}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: config.fontFamily }}>
                                        Texto de ejemplo con la fuente seleccionada
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-4 bg-gray-800 rounded-lg shadow-sm">
                                        <p className="text-sm text-gray-400">Ubicación actual:</p>
                                        <p className="font-mono text-sm text-gray-300">
                                            {config.coordinates.lat.toFixed(6)}, {config.coordinates.lng.toFixed(6)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Formulario de Configuración */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre del Restaurante
                                </label>
                                <input
                                    type="text"
                                    value={config.name}
                                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    placeholder="Ej: La Casa del Sabor"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    URL del Logo
                                </label>
                                <input
                                    type="url"
                                    value={config.logoUrl}
                                    onChange={(e) => {
                                        setLogoError(false);
                                        setConfig({ ...config, logoUrl: e.target.value });
                                    }}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    placeholder="https://ejemplo.com/logo.png"
                                />
                                {logoError && (
                                    <p className="mt-2 text-sm text-red-400">Error cargando la imagen. Verifica la URL.</p>
                                )}
                            </div>

                            {/* Selector de Fuente Mejorado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Tipografía Principal
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {/* Fuentes principales */}
                                    {PRIMARY_FONTS.map((font) => (
                                        <button
                                            key={font.value}
                                            type="button"
                                            onClick={() => updateFontFamily(font.value)}
                                            className={`flex-1 min-w-[120px] p-3 rounded-lg border ${config.fontFamily === font.value
                                                ? 'border-blue-400 bg-blue-900/20'
                                                : 'border-gray-600 hover:border-gray-500'
                                                } transition-all`}
                                            style={{ fontFamily: font.value }}
                                        >
                                            {font.name}
                                        </button>
                                    ))}

                                    {/* Botón para mostrar más fuentes */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowMoreFonts(!showMoreFonts)}
                                            className="flex items-center justify-center min-w-[120px] p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
                                        >
                                            Más <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showMoreFonts ? 'rotate-90' : ''}`} />
                                        </button>

                                        {/* Menú desplegable de fuentes secundarias */}
                                        {showMoreFonts && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-lg bg-gray-800 shadow-lg border border-gray-700 p-2"
                                            >
                                                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scroll">
                                                    {SECONDARY_FONTS.map((font) => (
                                                        <button
                                                            key={font.value}
                                                            type="button"
                                                            onClick={() => {
                                                                updateFontFamily(font.value);
                                                                setShowMoreFonts(false);
                                                            }}
                                                            className={`p-2 rounded-md text-sm ${config.fontFamily === font.value
                                                                ? 'bg-blue-900/30 border-blue-400'
                                                                : 'hover:bg-gray-700 border-gray-600'
                                                                } border transition-all`}
                                                            style={{ fontFamily: font.value }}
                                                        >
                                                            {font.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Latitud
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={config.coordinates.lat}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            coordinates: {
                                                ...config.coordinates,
                                                lat: parseFloat(e.target.value)
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Longitud
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={config.coordinates.lng}
                                        onChange={(e) => setConfig({
                                            ...config,
                                            coordinates: {
                                                ...config.coordinates,
                                                lng: parseFloat(e.target.value)
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Notificación de cambio de fuente */}
            <AnimatePresence>
                {showSaveNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>Cambios guardados exitosamente</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}