export interface OrderItem {
  id?: number;
  foodId?: number;
  foodName: string;
  foodImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id?: number;
  orderNumber?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  restaurantName?: string;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string; // PENDING, CONFIRMED, PREPARING, READY_FOR_PICKUP, ON_THE_WAY, DELIVERED, CANCELLED
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  finalAmount: number;
  itemsCount?: number;
  deliveryNote?: string;
  orderItems?: OrderItem[];
  createdAt?: string;
}
