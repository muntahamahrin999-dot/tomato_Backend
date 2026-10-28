import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

interface OrderStatus {
  name: string;
  count: number;
  percentage: number;
  className: string;
}

interface MenuItem {
  name: string;
  category: string;
  orders: number;
  revenue: number;
  rating: number;
}

interface LocationData {
  location: string;
  customers: number;
  percentage: number;
}

interface Review {
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

interface Rider {
  name: string;
  deliveries: number;
  status: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  private toastService = inject(ToastService);

  selectedPeriod = 'This Month';

  periods = [
    'Today',
    'This Week',
    'This Month',
    'This Year'
  ];

  salesData: SalesData[] = [
    { month: 'Jan', sales: 52000, orders: 420 },
    { month: 'Feb', sales: 61000, orders: 510 },
    { month: 'Mar', sales: 72000, orders: 580 },
    { month: 'Apr', sales: 81000, orders: 640 },
    { month: 'May', sales: 92000, orders: 720 },
    { month: 'Jun', sales: 127000, orders: 840 }
  ];

  orderStatuses: OrderStatus[] = [
    {
      name: 'Delivered',
      count: 2840,
      percentage: 74,
      className: 'delivered'
    },
    {
      name: 'Processing',
      count: 428,
      percentage: 11,
      className: 'processing'
    },
    {
      name: 'On the Way',
      count: 352,
      percentage: 9,
      className: 'ontheway'
    },
    {
      name: 'Cancelled',
      count: 222,
      percentage: 6,
      className: 'cancelled'
    }
  ];

  monthlyRevenue = [
    { month: 'Jan', revenue: 52000 },
    { month: 'Feb', revenue: 61000 },
    { month: 'Mar', revenue: 72000 },
    { month: 'Apr', revenue: 81000 },
    { month: 'May', revenue: 92000 },
    { month: 'Jun', revenue: 127000 }
  ];

  popularMenuItems: MenuItem[] = [
    {
      name: 'Chicken Burger',
      category: 'Burgers',
      orders: 842,
      revenue: 126300,
      rating: 4.8
    },
    {
      name: 'Margherita Pizza',
      category: 'Pizza',
      orders: 764,
      revenue: 114600,
      rating: 4.7
    },
    {
      name: 'Chicken Biryani',
      category: 'Biryani',
      orders: 698,
      revenue: 104700,
      rating: 4.9
    },
    {
      name: 'Beef Steak',
      category: 'Steak',
      orders: 532,
      revenue: 95800,
      rating: 4.6
    },
    {
      name: 'Pasta Alfredo',
      category: 'Pasta',
      orders: 486,
      revenue: 72900,
      rating: 4.5
    }
  ];

  locationData: LocationData[] = [
    {
      location: 'Dhaka',
      customers: 1248,
      percentage: 50
    },
    {
      location: 'Chattogram',
      customers: 486,
      percentage: 20
    },
    {
      location: 'Sylhet',
      customers: 312,
      percentage: 13
    },
    {
      location: 'Rajshahi',
      customers: 248,
      percentage: 10
    },
    {
      location: 'Khulna',
      customers: 192,
      percentage: 7
    }
  ];

  recentReviews: Review[] = [
    {
      customer: 'Nusrat Jahan',
      rating: 5,
      comment: 'Food was delicious and delivery was very fast!',
      date: '2 hours ago'
    },
    {
      customer: 'Rahim Ahmed',
      rating: 4,
      comment: 'Great taste. Packaging was also very good.',
      date: '5 hours ago'
    },
    {
      customer: 'Sadia Islam',
      rating: 5,
      comment: 'Loved the Chicken Biryani. Highly recommended.',
      date: 'Yesterday'
    },
    {
      customer: 'Tanvir Hasan',
      rating: 4,
      comment: 'Good food and friendly delivery service.',
      date: 'Yesterday'
    }
  ];

  trendingItems = [
    {
      name: 'Chicken Burger',
      orders: 842,
      growth: '+18.5%'
    },
    {
      name: 'Chicken Biryani',
      orders: 698,
      growth: '+15.2%'
    },
    {
      name: 'Margherita Pizza',
      orders: 764,
      growth: '+12.8%'
    },
    {
      name: 'Beef Steak',
      orders: 532,
      growth: '+9.6%'
    }
  ];

  availableRiders: Rider[] = [
    {
      name: 'Arif Hasan',
      deliveries: 18,
      status: 'Available'
    },
    {
      name: 'Sakib Khan',
      deliveries: 15,
      status: 'Available'
    },
    {
      name: 'Rafi Ahmed',
      deliveries: 12,
      status: 'Available'
    },
    {
      name: 'Imran Hossain',
      deliveries: 10,
      status: 'Available'
    }
  ];

  get maxSales(): number {
    return Math.max(...this.salesData.map(item => item.sales));
  }

  get maxRevenue(): number {
    return Math.max(...this.monthlyRevenue.map(item => item.revenue));
  }

  getSalesHeight(value: number): number {
    return (value / this.maxSales) * 100;
  }

  getRevenueHeight(value: number): number {
    return (value / this.maxRevenue) * 100;
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
  }

  exportReport(): void {
    this.toastService.success(`Report exported for ${this.selectedPeriod}`);
  }
}