export interface Food {
  id?: number;
  name: string;
  description?: string;
  price: number;
  categoryName?: string;
  category?: string;
  restaurantName?: string;
  restaurantId?: number;
  image?: string;
  icon?: string;
  available: boolean;
  preparationTime?: number;
  rating?: number;
}
