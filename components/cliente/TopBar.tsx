// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useCartStore } from "@/hooks/useCartStore";

// export default function TopBar() {
//     const cartItems = useCartStore((state) => state.items);
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [clicks, setClicks] = useState(0);

//     // Función para activar el atajo secreto
//     const handleSecretClick = () => {
//         setClicks((prev) => prev + 1);
//         if (clicks >= 4) { // Si hacen 5 clics en el logo, redirigir al login
//             window.location.href = "/login";
//         }
//     };

//     return (
//         <header className="w-full p-4 bg-gray-900 text-white flex justify-between items-center">
//             {/* Logo con atajo secreto */}

//             <h1 className="text-xl font-bold cursor-pointer" onClick={handleSecretClick}>
//                 Menú Digital
//             </h1>


//             {/* Botón de carrito */}
//             <Link href="/carrito">
//                 <div className="relative cursor-pointer">
//                     🛒
//                     {cartItems.length > 0 && (
//                         <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2">
//                             {cartItems.length}
//                         </span>
//                     )}
//                 </div>
//             </Link>

//             {/* Menú para futuras opciones */}
//             <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
//                 ☰
//             </button>

//             {/* Menú desplegable */}
//             {menuOpen && (
//                 <div className="absolute top-12 right-4 bg-gray-800 p-4 rounded-lg shadow-lg md:hidden">
//                     <Link href="/menu" className="block py-2">Menú</Link>
//                     <Link href="/carrito" className="block py-2">Carrito</Link>
//                     <Link href="/admin" className="block py-2">Admin</Link>
//                 </div>
//             )}
//         </header>
//     );
// }
