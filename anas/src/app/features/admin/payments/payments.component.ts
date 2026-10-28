import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Payment {
  id: string;
  orderId: string;
  customer: string;
  method: 'bKash' | 'Nagad' | 'Card' | 'Cash';
  amount: number;
  date: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {

  selectedFilter = 'All';

  payments: Payment[] = [
    {
      id: '#PAY-5001',
      orderId: '#ORD-1001',
      customer: 'Rahim Ahmed',
      method: 'bKash',
      amount: 850,
      date: '24 Sep 2026',
      time: '10:28 AM',
      status: 'Completed'
    },
    {
      id: '#PAY-5002',
      orderId: '#ORD-1002',
      customer: 'Nusrat Jahan',
      method: 'Card',
      amount: 620,
      date: '24 Sep 2026',
      time: '10:51 AM',
      status: 'Completed'
    },
    {
      id: '#PAY-5003',
      orderId: '#ORD-1003',
      customer: 'Sakib Hasan',
      method: 'Nagad',
      amount: 490,
      date: '24 Sep 2026',
      time: '11:07 AM',
      status: 'Completed'
    },
    {
      id: '#PAY-5004',
      orderId: '#ORD-1004',
      customer: 'Mim Akter',
      method: 'Card',
      amount: 1150,
      date: '24 Sep 2026',
      time: '11:34 AM',
      status: 'Completed'
    },
    {
      id: '#PAY-5005',
      orderId: '#ORD-1005',
      customer: 'Tanvir Hossain',
      method: 'bKash',
      amount: 780,
      date: '24 Sep 2026',
      time: '11:58 AM',
      status: 'Pending'
    },
    {
      id: '#PAY-5006',
      orderId: '#ORD-1006',
      customer: 'Jannatul Ferdous',
      method: 'Cash',
      amount: 540,
      date: '23 Sep 2026',
      time: '08:42 PM',
      status: 'Refunded'
    }
  ];

  filters = [
    'All',
    'Completed',
    'Pending',
    'Failed',
    'Refunded'
  ];

  get filteredPayments(): Payment[] {
    if (this.selectedFilter === 'All') {
      return this.payments;
    }

    return this.payments.filter(
      payment => payment.status === this.selectedFilter
    );
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  get totalRevenue(): number {
    return this.payments
      .filter(payment => payment.status === 'Completed')
      .reduce((total, payment) => total + payment.amount, 0);
  }

  get completedPayments(): number {
    return this.payments.filter(
      payment => payment.status === 'Completed'
    ).length;
  }

  get pendingPayments(): number {
    return this.payments.filter(
      payment => payment.status === 'Pending'
    ).length;
  }

  get refundedAmount(): number {
    return this.payments
      .filter(payment => payment.status === 'Refunded')
      .reduce((total, payment) => total + payment.amount, 0);
  }

  getMethodClass(method: string): string {
    return method.toLowerCase();
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}