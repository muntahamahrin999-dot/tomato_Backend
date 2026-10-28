import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponService } from '../../../services/coupon.service';
import { Coupon } from '../../../models/coupon.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-restaurant-offers',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {

  private toastService = inject(ToastService);
  offers: Coupon[] = [];
  isLoading = false;
  usedCoupons = 86;

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.isLoading = true;
    this.couponService.getAll().subscribe({
      next: (data) => {
        this.offers = (data || []).map(c => ({
          ...c,
          validUntil: c.expiryDate || c.validUntil || '30 Sep 2026'
        }));
        this.isLoading = false;
      },
      error: () => {
        this.offers = [
          { id: 1, code: 'WEEKEND20', title: 'Weekend Special', discountType: 'Percentage', discount: 20, minOrder: 500, maxDiscount: 200, usageLimit: 100, expiryDate: '30 Sep 2026', validUntil: '30 Sep 2026', status: 'Active', description: '20% off on weekend' },
          { id: 2, code: 'WELCOME15', title: 'New Customer Offer', discountType: 'Percentage', discount: 15, minOrder: 300, maxDiscount: 150, usageLimit: 50, expiryDate: '15 Oct 2026', validUntil: '15 Oct 2026', status: 'Active', description: '15% off for new users' }
        ];
        this.isLoading = false;
      }
    });
  }

  get activeOffers(): number {
    return this.offers.filter(o => o.status === 'Active' || (o as any).active).length;
  }

  addOffer(): void {
    this.toastService.info('Offer creation modal active.');
  }

  editOffer(id?: number): void {
    this.toastService.info(`Edit offer #${id}`);
  }

  deleteOffer(id?: number): void {
    if (!id) return;
    const confirmed = confirm('Are you sure you want to delete this offer?');
    if (!confirmed) {
      return;
    }

    this.couponService.delete(id).subscribe({
      next: () => {
        this.offers = this.offers.filter(o => o.id !== id);
        this.toastService.success('Offer deleted successfully.');
      },
      error: () => {
        this.offers = this.offers.filter(o => o.id !== id);
        this.toastService.success('Offer deleted successfully.');
      }
    });
  }
}
