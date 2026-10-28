export interface Restaurant {
  id?: number;
  name: string;
  owner?: string;
  category?: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  orders?: number;
  ordersCount?: number;
  rating?: number;
  status: 'Active' | 'Pending' | 'Inactive';
  active?: boolean;
  openingTime?: string;
  closingTime?: string;
  imageUrls?: string[];
}
