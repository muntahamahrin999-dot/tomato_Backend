export * from './rider.model';

export interface Delivery {
  id?: number;
  orderId?: number;
  deliveryPersonId?: string;
  status: string;
  pickupTime?: string;
  deliveredTime?: string;
}
