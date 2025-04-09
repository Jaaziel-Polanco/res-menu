// file: types/index.ts
export interface Order {
  id: string;
  numeroOrden: number;
  status: "pendiente" | "preparacion" | "completado" | "cancelado";
  pedidoTipo: "Dine In" | "To Go" | "Delivery";
  customer: string;
  mesa: string;
  metodoPago: "Credit Card" | "Paypal" | "Cash";
  fecha: Date;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    note?: string;
  }>;
  completedAt?: string; 
}

export interface Producto {
  id: string;
  name: string;
  price: number;
  active: boolean;
  category: string;
  description?: string;  // Opcional para meseros
  imageUrl?: string;     // Opcional para meseros
}

// interfaces/restaurantConfig.ts
export interface RestaurantConfig {
  id?: string;
  name: string;
  logoUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  deliveryRange: number; // En metros
  fontFamily: string; // Nueva propiedad para la fuente
}