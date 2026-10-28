import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coupon } from '../../../models/coupon.model';
import { CouponService } from '../../../services/coupon.service';
import { AddCouponComponent } from './add-coupon/add-coupon.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddCouponComponent
  ],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent implements OnInit {

  private toastService = inject(ToastService);

  searchText = '';
  selectedStatus = 'All';

  coupons: Coupon[] = [];
  isLoading = false;
  errorMessage = '';

  // Form View State
  showForm = false;
  selectedCouponToEdit: Coupon | null = null;

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.couponService.getAll().subscribe({
      next: (data: Coupon[]) => {
        this.coupons = data || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load coupons from server.';
        console.error('Error loading coupons:', err);
      }
    });
  }

  get filteredCoupons(): Coupon[] {
    const search = this.searchText.toLowerCase().trim();

    return this.coupons.filter(coupon => {
      const matchesSearch =
        !search ||
        (coupon.code && coupon.code.toLowerCase().includes(search)) ||
        (coupon.title && coupon.title.toLowerCase().includes(search)) ||
        (coupon.discountType && coupon.discountType.toLowerCase().includes(search));

      const matchesStatus =
        this.selectedStatus === 'All' ||
        coupon.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get totalCoupons(): number {
    return this.coupons.length;
  }

  get activeCoupons(): number {
    return this.coupons.filter(c => c.status === 'Active').length;
  }

  get expiredCoupons(): number {
    return this.coupons.filter(c => c.status === 'Expired').length;
  }

  get inactiveCoupons(): number {
    return this.coupons.filter(c => c.status === 'Inactive').length;
  }

  get totalUsage(): number {
    return this.coupons.reduce(
      (sum, coupon) => sum + (coupon.usedCount || 0),
      0
    );
  }

  getUsagePercentage(coupon: Coupon): number {
    if (!coupon.usageLimit || coupon.usageLimit === 0) {
      return 0;
    }
    return Math.min(
      ((coupon.usedCount || 0) / coupon.usageLimit) * 100,
      100
    );
  }

  getDiscountText(coupon: Coupon): string {
    if (coupon.discountType === 'Percentage') {
      return `${coupon.discount}% OFF`;
    }
    return `৳${coupon.discount} OFF`;
  }

  trackByCoupon(index: number, coupon: Coupon): number {
    return coupon.id || index;
  }

  addCoupon(): void {
    this.selectedCouponToEdit = null;
    this.showForm = true;
  }

  editCoupon(coupon: Coupon): void {
    this.selectedCouponToEdit = { ...coupon };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedCouponToEdit = null;
  }

  onFormSaved(saved: Coupon): void {
    const idx = this.coupons.findIndex(c => c.id === saved.id);
    if (idx > -1) {
      this.coupons[idx] = saved;
    } else {
      this.coupons.unshift(saved);
    }
    this.showForm = false;
    this.selectedCouponToEdit = null;
  }

  viewCoupon(coupon: Coupon): void {
    this.toastService.info(
      `${coupon.code} · ${this.getDiscountText(coupon)} · ${coupon.status}`
    );
  }

  toggleStatus(coupon: Coupon): void {
    if (!coupon.id) return;
    this.couponService.toggleStatus(coupon.id).subscribe({
      next: (res: Coupon) => {
        coupon.status = res.status;
        coupon.active = res.active;
      },
      error: () => {
        coupon.status = coupon.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }

  deleteCoupon(coupon: Coupon): void {
    if (!coupon.id) return;
    const confirmed = confirm(`Are you sure you want to delete coupon "${coupon.code}"?`);
    if (confirmed) {
      this.couponService.delete(coupon.id).subscribe({
        next: () => {
          this.coupons = this.coupons.filter(item => item.id !== coupon.id);
          this.toastService.success('Coupon deleted successfully.');
        },
        error: (err: any) => {
          this.toastService.error('Failed to delete coupon: ' + (err?.error?.message || err.message));
        }
      });
    }
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = 'All';
  }
}