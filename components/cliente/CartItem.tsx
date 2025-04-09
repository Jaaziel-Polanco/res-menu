// "use client";

// import { Trash2 } from "lucide-react";
// import Image from "next/image";

// interface CartItemProps {
//     item: { id: string; name: string; price: number; imageUrl: string; quantity: number };
//     removeFromCart: (id: string) => void;
//     updateQuantity: (id: string, quantity: number) => void;
// }

// export default function CartItem({ item, removeFromCart, updateQuantity }: CartItemProps) {
//     return (
//         <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between mb-4">
//             <div className="flex items-center">
//                 <div className="relative w-12 h-12 rounded-lg">
//                     <Image
//                         src={item.imageUrl}
//                         alt={item.name}
//                         className="object-contain"
//                         fill
//                         sizes="48px" // Tamaño fijo equivalente a w-12 (48px)
//                         unoptimized={true} // Opcional: si tienes problemas con URLs externas
//                     />
//                 </div>
//                 <div className="ml-4">
//                     <h4 className="text-md font-semibold">{item.name}</h4>
//                     <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
//                 </div>
//             </div>

//             <div className="flex items-center">
//                 <input
//                     type="number"
//                     value={item.quantity}
//                     onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
//                     className="w-12 text-black text-center p-1 rounded-lg"
//                     min="1"
//                 />
//                 <button
//                     onClick={() => removeFromCart(item.id)}
//                     className="ml-2 text-red-400 hover:text-red-600"
//                     aria-label="Eliminar producto"
//                 >
//                     <Trash2 size={18} />
//                 </button>
//             </div>
//         </div>
//     );
// }