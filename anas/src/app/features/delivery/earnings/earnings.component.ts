import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

interface EarningRecord {
  date: string;
  deliveries: number;
  deliveryFee: string;
  bonus: string;
  total: string;
}

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './earnings.component.html',
  styleUrl: './earnings.component.scss'
})
export class EarningsComponent implements OnInit {

  selectedPeriod = 'Today';
  earnings: EarningRecord[] = [];
  isLoading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadEarnings();
  }

  setPeriod(period: string): void {
    this.selectedPeriod = period;
  }

  loadEarnings(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        const delivered = (orders || []).filter(o => (o.status || '').toUpperCase() === 'DELIVERED');
        const count = delivered.length;
        const totalFee = delivered.reduce((sum, o) => sum + (o.deliveryFee || 60), 0);
        const bonus = count * 15;

        this.earnings = [
          {
            date: 'Today / Total',
            deliveries: count,
            deliveryFee: `৳ ${totalFee}`,
            bonus: `৳ ${bonus}`,
            total: `৳ ${totalFee + bonus}`
          }
        ];
        this.isLoading = false;
      },
      error: () => {
        this.earnings = [];
        this.isLoading = false;
      }
    });
  }
}
