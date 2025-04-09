"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useCartStore } from "@/hooks/useCartStore";
import CategoryTabs from "./CategoryTabs";
import ProductCard from "./ProductCard";
import { Search } from "lucide-react";
import Loading from "../ui/Loading";
import { useRestaurantConfig } from "@/hooks/useRestaurantConfig";


// Función para calcular distancia usando fórmula de Haversine
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

interface Producto {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    description: string;
    active: boolean;
}

interface MenuProps {
    carritoAbierto: boolean;
}

export default function Menu({ carritoAbierto }: MenuProps) {
    const { config: restaurantConfig } = useRestaurantConfig();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("Todos");
    const [busqueda, setBusqueda] = useState<string>("");

    const [isWithinRange, setIsWithinRange] = useState(false);
    const [geolocationError, setGeolocationError] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(true);

    const addToCart = useCartStore((state) => state.addToCart);

    const RESTAURANT_COORDS = useMemo(() => {
        return restaurantConfig?.coordinates || { lat: 0, lng: 0 };
    }, [restaurantConfig?.coordinates]); // Dependencia correcta

    const restaurantName = restaurantConfig?.name || "Nombre del Restaurante";

    // Función para solicitar la ubicación
    const requestLocationAccess = useCallback(() => {
        if (!navigator.geolocation) {
            setGeolocationError("Geolocalización no soportada en tu navegador");
            setLocationLoading(false);
            return;
        }

        setLocationLoading(true);
        setGeolocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const distance = calculateDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    RESTAURANT_COORDS.lat,
                    RESTAURANT_COORDS.lng
                );
                setIsWithinRange(distance <= 20000000);
                setLocationLoading(false);
            },
            (error) => {
                setGeolocationError(error.message);
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }, [RESTAURANT_COORDS]); // Dependencias de useCallback

    useEffect(() => {
        let isMounted = true; // Variable de control de montado

        const fetchProductos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "productos"));
                const productosData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    active: doc.data().active ?? true,
                    ...doc.data(),
                })) as Producto[];

                if (isMounted) { // Solo actualizar si está montado
                    setProductos(productosData);
                    const categoriasUnicas = ["Todos", ...new Set(productosData.map((prod) => prod.category))];
                    setCategorias(categoriasUnicas);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error cargando productos:", error);
                    setLoading(false);
                }
            }
        };

        fetchProductos();

        const handleGeolocation = () => {
            const THRESHOLD = 1 * 60 * 60 * 1000;
            const lastAsked = localStorage.getItem("lastLocationAccessTimestamp");
            const now = Date.now();
            const hasAskedRecently = lastAsked && now - parseInt(lastAsked, 10) < THRESHOLD;

            if (navigator.permissions) {
                navigator.permissions.query({ name: "geolocation" }).then((result) => {
                    if (!isMounted) return; // Chequeo temprano

                    if (result.state === "granted") {
                        requestLocationAccess();
                    } else if (result.state === "prompt") {
                        if (!hasAskedRecently) {
                            const userConfirmed = window.confirm(
                                "Para realizar pedidos, necesitamos acceder a tu ubicación para verificar que estás en el local. ¿Permites el acceso?"
                            );
                            if (userConfirmed) {
                                localStorage.setItem("lastLocationAccessTimestamp", now.toString());
                                requestLocationAccess();
                            } else if (isMounted) {
                                setGeolocationError("Debes permitir acceso a ubicación para ordenar");
                                setLocationLoading(false);
                            }
                        } else {
                            requestLocationAccess();
                        }
                    } else if (isMounted) {
                        setGeolocationError("Debes permitir acceso a ubicación para ordenar");
                        setLocationLoading(false);
                    }
                }).catch((error) => {
                    if (isMounted) {
                        console.error("Error en permisos:", error);
                        setGeolocationError("Error al verificar permisos");
                    }
                });
            } else {
                if (!hasAskedRecently) {
                    const userConfirmed = window.confirm(
                        "Para realizar pedidos, necesitamos acceder a tu ubicación para verificar que estás en el local. ¿Permites el acceso?"
                    );
                    if (userConfirmed) {
                        localStorage.setItem("lastLocationAccessTimestamp", now.toString());
                        requestLocationAccess();
                    } else if (isMounted) {
                        setGeolocationError("Debes permitir acceso a ubicación para ordenar");
                        setLocationLoading(false);
                    }
                } else {
                    requestLocationAccess();
                }
            }
        };

        handleGeolocation();

        // Cleanup: Se ejecuta al desmontar el componente
        return () => {
            isMounted = false;
        };
    }, [requestLocationAccess]); // Dependencias de useEffect

    // Filtrar productos por categoría y búsqueda
    const productosFiltrados = productos.filter((producto) => {
        const matchesCategory = categoriaSeleccionada === "Todos" || producto.category === categoriaSeleccionada;
        const matchesSearch = producto.name.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.description.toLowerCase().includes(busqueda.toLowerCase());

        // Mostrar activos siempre, e inactivos solo si hay búsqueda
        return matchesCategory && (producto.active || busqueda) && matchesSearch;
    });


    // Obtener fecha actual
    const fechaActual = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={`flex-1 text-white ${carritoAbierto ? "hidden md:block" : ""}`}>
            {/* Alertas de geolocalización */}
            {geolocationError && (
                <div className=" bg-red-500 md:ml-10 rounded-xl text-white p-4 text-center">
                    {geolocationError}
                    {/* Botón para reintentar geolocalización */}
                    <button
                        onClick={requestLocationAccess}
                        className="block mt-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 mx-auto"
                    >
                        Permitir acceso a ubicación
                    </button>
                </div>
            )}

            {!locationLoading && !geolocationError && !isWithinRange && (
                <div className="bg-yellow-500 md:ml-10 rounded-xl text-black p-4 text-center">
                    Debes estar en el local para realizar pedidos
                </div>
            )}

            {/* Encabezado + Categorías + "Elige tu Platillo" (fijo/sticky) */}
            <div className="sticky top-0 bg-black rounded-xl z-10 p-6">
                {/* Título y Búsqueda */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">{restaurantName}</h1>
                        <p className="text-gray-400">{fechaActual}</p>
                    </div>
                    {/* Barra de búsqueda */}
                    <div className="relative w-full md:w-96 mt-4 md:mt-0">
                        <Search className="absolute left-3 top-2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar platillo..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categorías */}
                <CategoryTabs
                    categorias={categorias}
                    categoriaSeleccionada={categoriaSeleccionada}
                    setCategoriaSeleccionada={setCategoriaSeleccionada}
                />

                {/* Título "Elige tu Platillo" */}
                <h2 className="text-2xl font-semibold mt-6">Elige tu Platillo</h2>
            </div>

            {/* Sección de Platillos */}
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto) => (
                            <ProductCard
                                key={producto.id}
                                producto={producto}
                                addToCart={addToCart}
                                isWithinRange={isWithinRange}
                                locationLoading={locationLoading}
                                geolocationError={geolocationError}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 col-span-full text-center mt-6">
                            No se encontraron platillos con ese criterio.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
