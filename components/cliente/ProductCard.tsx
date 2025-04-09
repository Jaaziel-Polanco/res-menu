import { ShoppingCart, Loader2, AlertCircle, MapPinOff, Ban } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Producto {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    description: string;
    active: boolean; // Añadimos el campo active
}

interface CartItem extends Producto {
    quantity: number;
}

interface ProductCardProps {
    producto: Producto;
    addToCart: (producto: CartItem) => void;
    isWithinRange: boolean;
    locationLoading: boolean;
    geolocationError: string | null;
}

export default function ProductCard({
    producto,
    addToCart,
    isWithinRange,
    locationLoading,
    geolocationError
}: ProductCardProps) {

    const getButtonState = () => {
        if (!producto.active) return "No disponible";
        if (locationLoading) return "Verificando ubicación...";
        if (geolocationError) return "Error de ubicación";
        if (!isWithinRange) return "Fuera de rango";
        return "Agregar al carrito";
    };

    const isDisabled = !producto.active || locationLoading || !!geolocationError || !isWithinRange;

    return (
        <div className="group bg-gray-800 p-4 rounded-xl flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1.5 relative overflow-hidden">
            {/* Overlay para productos inactivos */}
            {!producto.active && (
                <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-30">
                    <div className="text-center p-4">
                        <Ban className="w-8 h-8 text-red-400 mb-2 mx-auto" />
                        <span className="text-white font-bold block">Producto no disponible</span>
                    </div>
                </div>
            )}

            {/* Contenedor de imagen */}
            <div className={`w-full aspect-square relative bg-gray-900 rounded-xl overflow-hidden mb-4 ${!producto.active ? 'grayscale' : ''
                }`}>
                <Image
                    src={producto.imageUrl}
                    alt={producto.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                />

                {/* Overlay de estado de ubicación */}
                {(isDisabled && producto.active) && (
                    <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center">
                        <MapPinOff className="w-8 h-8 text-red-400" />
                    </div>
                )}
            </div>

            {/* Contenido textual */}
            <div className="w-full flex flex-col items-center px-2">
                <h4 className="text-lg font-bold text-center mb-1 line-clamp-1">
                    {producto.name}
                </h4>
                <p className="text-sm text-gray-400 text-center mb-3 line-clamp-2 min-h-[40px]">
                    {producto.description}
                </p>

                {/* Precio */}
                <div className="w-full flex justify-center items-baseline gap-2 mb-4">
                    <p className="text-2xl font-extrabold text-emerald-400">
                        ${producto.price.toFixed(2)}
                    </p>
                    <span className="text-sm text-gray-500">DOP</span>
                </div>

                {/* Botón */}
                <button
                    onClick={() => addToCart({ ...producto, quantity: 1 })}
                    disabled={isDisabled}
                    className={cn(
                        "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2",
                        "transition-all duration-200 active:scale-[0.98]",
                        !isDisabled
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed",
                        locationLoading && "bg-gray-700",
                        geolocationError && "bg-red-600/80 hover:bg-red-500/80"
                    )}
                >
                    {!producto.active ? (
                        <>
                            <Ban className="w-4 h-4" />
                            <span>No disponible</span>
                        </>
                    ) : locationLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verificando...</span>
                        </>
                    ) : geolocationError ? (
                        <>
                            <AlertCircle className="w-4 h-4" />
                            <span>Error de ubicación</span>
                        </>
                    ) : !isWithinRange ? (
                        <>
                            <MapPinOff className="w-4 h-4" />
                            <span>Fuera de rango</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Agregar al carrito</span>
                        </>
                    )}
                </button>
            </div>

            {/* Tooltip móvil */}
            {isDisabled && (
                <div className="md:hidden absolute bottom-20 bg-gray-700 px-3 py-1.5 rounded-lg text-xs z-40">
                    {getButtonState()}
                </div>
            )}
        </div>
    );
}