export interface Rider {
  id?: number;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  zone: string;
  orders?: number;
  ordersCount?: number;
  rating?: number;
  status: 'Active' | 'On Delivery' | 'Pending' | 'Suspended';
}
