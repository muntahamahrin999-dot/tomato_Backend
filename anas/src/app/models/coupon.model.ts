export interface Coupon {
  id?: number;
  code: string;
  title: string;
  discountType: 'Percentage' | 'Fixed';
  discount: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount?: number;
  startDate?: string;
  expiryDate?: string;
  validUntil?: string;
  status: 'Active' | 'Expired' | 'Inactive';
  description?: string;
  active?: boolean;
}
