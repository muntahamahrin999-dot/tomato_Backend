import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coupon } from '../../../../models/coupon.model';
import { CouponService } from '../../../../services/coupon.service';

@Component({
  selector: 'app-add-coupon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-coupon.component.html',
  styleUrl: './add-coupon.component.scss'
})
export class AddCouponComponent implements OnInit {

  @Input() couponToEdit?: Coupon | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Coupon>();

  formData: Coupon = {
    code: '',
    title: '',
    discountType: 'Percentage',
    discount: 15,
    minOrder: 400,
    maxDiscount: 150,
    usageLimit: 200,
    usedCount: 0,
    startDate: '',
    expiryDate: '',
    status: 'Active',
    description: ''
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    if (this.couponToEdit) {
      this.formData = { ...this.couponToEdit };
    }
  }

  onSubmit(): void {
    if (!this.formData.code || !this.formData.code.trim()) {
      this.errorMessage = 'Coupon code is required.';
      return;
    }
    if (!this.formData.discount || this.formData.discount <= 0) {
      this.errorMessage = 'Please enter a valid discount amount.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.formData.code = this.formData.code.toUpperCase().trim();

    if (this.formData.id) {
      this.couponService.update(this.formData.id, this.formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.saved.emit(res);
          this.close.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Failed to update coupon.';
        }
      });
    } else {
      this.couponService.create(this.formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.saved.emit(res);
          this.close.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.error?.message || 'Failed to create coupon.';
        }
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
