import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../../core/services/toast.service';
import { OrderService } from '../../../services/order.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { RiderService } from '../../../services/rider.service';
import { UserService } from '../../../services/user.service';
import { Order as BackendOrder } from '../../../models/order.model';
import { Restaurant as BackendRestaurant } from '../../../models/restaurant.model';
import { Rider as BackendRider } from '../../../models/rider.model';
import { User as BackendUser } from '../../../models/user.model';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  type: string;
}

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
}

interface Order {
  id: string;
  customer: string;
  restaurant: string;
  amount: number;
  status: string;
  time: string;
}

interface Restaurant {
  name: string;
  orders: number;
  revenue: number;
  rating: number;
}

interface FoodItem {
  name: string;
  orders: number;
  revenue: number;
}

interface Rider {
  name: string;
  deliveries: number;
  status: string;
}

interface Review {
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private toastService = inject(ToastService);
  private orderService = inject(OrderService);
  private restaurantService = inject(RestaurantService);
  private riderService = inject(RiderService);
  private userService = inject(UserService);

  isLoading = false;

  selectedPeriod = 'This Month';

  periods = [
    'Today',
    'This Week',
    'This Month',
    'This Year'
  ];

  stats: StatCard[] = [
    {
      title: 'Total Orders',
      value: '3,842',
      change: '+8.4%',
      icon: '🛍',
      type: 'red'
    },
    {
      title: 'Total Riders',
      value: '86',
      change: '+6.2%',
      icon: '🛵',
      type: 'green'
    },
    {
      title: "Today's Orders",
      value: '186',
      change: '+12.5%',
      icon: '📦',
      type: 'blue'
    },
    {
      title: 'Total Revenue',
      value: '৳ 485,600',
      change: '+12.8%',
      icon: '৳',
      type: 'orange'
    },
    {
      title: 'Total Customers',
      value: '2,486',
      change: '+15.2%',
      icon: '👥',
      type: 'purple'
    },
    {
      title: 'Average Rating',
      value: '4.7',
      change: '+0.3',
      icon: '⭐',
      type: 'yellow'
    },
    {
      title: 'Pending Requests',
      value: '24',
      change: '8 new',
      icon: '⏳',
      type: 'pending'
    },
    {
      title: 'Cancelled Orders',
      value: '86',
      change: '-4.2%',
      icon: '✕',
      type: 'cancelled'
    }
  ];

  salesData: SalesData[] = [
    {
      month: 'Jan',
      revenue: 52000,
      orders: 420
    },
    {
      month: 'Feb',
      revenue: 61000,
      orders: 510
    },
    {
      month: 'Mar',
      revenue: 72000,
      orders: 580
    },
    {
      month: 'Apr',
      revenue: 81000,
      orders: 640
    },
    {
      month: 'May',
      revenue: 92000,
      orders: 720
    },
    {
      month: 'Jun',
      revenue: 127000,
      orders: 840
    }
  ];

  orderStatuses = [
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

  recentOrders: Order[] = [
    {
      id: 'ORD-5021',
      customer: 'Rahim Ahmed',
      restaurant: 'Pizza Palace',
      amount: 1250,
      status: 'Delivered',
      time: '10 min ago'
    },
    {
      id: 'ORD-5022',
      customer: 'Nusrat Jahan',
      restaurant: 'Burger House',
      amount: 890,
      status: 'Processing',
      time: '18 min ago'
    },
    {
      id: 'ORD-5023',
      customer: 'Tanvir Hasan',
      restaurant: 'Spice Garden',
      amount: 2450,
      status: 'On the Way',
      time: '25 min ago'
    },
    {
      id: 'ORD-5024',
      customer: 'Sadia Islam',
      restaurant: 'Food Village',
      amount: 760,
      status: 'Delivered',
      time: '32 min ago'
    },
    {
      id: 'ORD-5025',
      customer: 'Imran Hossain',
      restaurant: 'Tasty Corner',
      amount: 1450,
      status: 'Cancelled',
      time: '45 min ago'
    }
  ];

  topRestaurants: Restaurant[] = [
    {
      name: 'Pizza Palace',
      orders: 842,
      revenue: 118500,
      rating: 4.8
    },
    {
      name: 'Burger House',
      orders: 724,
      revenue: 96500,
      rating: 4.7
    },
    {
      name: 'Spice Garden',
      orders: 618,
      revenue: 82400,
      rating: 4.9
    },
    {
      name: 'Food Village',
      orders: 532,
      revenue: 71800,
      rating: 4.6
    }
  ];

  popularFoods: FoodItem[] = [
    {
      name: 'Chicken Burger',
      orders: 842,
      revenue: 126300
    },
    {
      name: 'Chicken Biryani',
      orders: 698,
      revenue: 104700
    },
    {
      name: 'Margherita Pizza',
      orders: 764,
      revenue: 114600
    },
    {
      name: 'Beef Steak',
      orders: 532,
      revenue: 95800
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
    }
  ];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;

    forkJoin({
      orders: this.orderService.getAllOrders().pipe(catchError(() => of(null))),
      restaurants: this.restaurantService.getAll().pipe(catchError(() => of(null))),
      riders: this.riderService.getAll().pipe(catchError(() => of(null))),
      users: this.userService.getAll().pipe(catchError(() => of(null)))
    }).subscribe({
      next: (result) => {
        this.applyBackendData(
          result.orders,
          result.restaurants,
          result.riders,
          result.users
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
        this.isLoading = false;
      }
    });
  }

  private applyBackendData(
    orders: BackendOrder[] | null,
    restaurants: BackendRestaurant[] | null,
    riders: BackendRider[] | null,
    users: BackendUser[] | null
  ): void {
    if (orders) {
      this.applyOrders(orders);
    }

    if (restaurants) {
      this.applyRestaurants(restaurants, orders || []);
    }

    if (riders) {
      this.applyRiders(riders);
    }

    if (users) {
      this.stats = this.buildStats(orders || [], riders || [], users);
    }
  }

  private applyOrders(orders: BackendOrder[]): void {
    const statusOf = (order: BackendOrder) => (order.status || '').toUpperCase();

    const total = orders.length;
    const delivered = orders.filter(o => statusOf(o) === 'DELIVERED').length;
    const cancelled = orders.filter(o => statusOf(o) === 'CANCELLED').length;
    const processing = orders.filter(o =>
      ['PENDING', 'CONFIRMED', 'PREPARING'].includes(statusOf(o))
    ).length;
    const onTheWay = orders.filter(o =>
      ['READY_FOR_PICKUP', 'ON_THE_WAY'].includes(statusOf(o))
    ).length;

    this.orderStatuses = this.buildStatusBreakdown(
      total,
      delivered,
      processing,
      onTheWay,
      cancelled
    );

    this.recentOrders = orders
      .slice()
      .sort((a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5)
      .map(order => ({
        id: order.orderNumber || `ORD-${order.id}`,
        customer: order.customerName || 'Customer',
        restaurant: order.restaurantName || 'Tomato Kitchen',
        amount: order.finalAmount || order.totalAmount || 0,
        status: this.mapOrderStatusLabel(order.status),
        time: order.createdAt
          ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Recent'
      }));
  }

  private buildStatusBreakdown(
    total: number,
    delivered: number,
    processing: number,
    onTheWay: number,
    cancelled: number
  ) {
    const percent = (count: number) =>
      total ? Math.round((count / total) * 100) : 0;

    return [
      { name: 'Delivered', count: delivered, percentage: percent(delivered), className: 'delivered' },
      { name: 'Processing', count: processing, percentage: percent(processing), className: 'processing' },
      { name: 'On the Way', count: onTheWay, percentage: percent(onTheWay), className: 'ontheway' },
      { name: 'Cancelled', count: cancelled, percentage: percent(cancelled), className: 'cancelled' }
    ];
  }

  private mapOrderStatusLabel(status?: string): string {
    switch ((status || '').toUpperCase()) {
      case 'DELIVERED':
        return 'Delivered';
      case 'ON_THE_WAY':
      case 'READY_FOR_PICKUP':
        return 'On the Way';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return 'Processing';
    }
  }

  private applyRestaurants(
    restaurants: BackendRestaurant[],
    orders: BackendOrder[]
  ): void {
    const statsFor = (name: string) => {
      const matching = orders.filter(
        order => (order.restaurantName || '') === name
      );

      return {
        orders: matching.length,
        revenue: matching.reduce(
          (sum, order) => sum + (order.finalAmount || order.totalAmount || 0),
          0
        )
      };
    };

    this.topRestaurants = restaurants
      .map(restaurant => {
        const derived = statsFor(restaurant.name);
        return {
          name: restaurant.name,
          orders: restaurant.ordersCount || restaurant.orders || derived.orders,
          revenue: derived.revenue,
          rating: restaurant.rating || 0
        };
      })
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 4);
  }

  private applyRiders(riders: BackendRider[]): void {
    this.availableRiders = riders
      .filter(rider => rider.status === 'Active')
      .slice(0, 4)
      .map(rider => ({
        name: rider.name,
        deliveries: rider.ordersCount || rider.orders || 0,
        status: rider.status
      }));
  }

  private buildStats(
    orders: BackendOrder[],
    riders: BackendRider[],
    users: BackendUser[]
  ): StatCard[] {
    const statusOf = (order: BackendOrder) => (order.status || '').toUpperCase();
    const today = new Date().toDateString();

    const totalOrders = orders.length;
    const todayOrders = orders.filter(order =>
      order.createdAt ? new Date(order.createdAt).toDateString() === today : false
    ).length;
    const cancelledOrders = orders.filter(o => statusOf(o) === 'CANCELLED').length;
    const pendingRequests = orders.filter(o =>
      ['PENDING', 'CONFIRMED'].includes(statusOf(o))
    ).length;

    const totalRevenue = orders
      .filter(o => statusOf(o) === 'DELIVERED')
      .reduce((sum, order) => sum + (order.finalAmount || order.totalAmount || 0), 0);

    const activeRiders = riders.filter(rider => rider.status === 'Active').length;

    const averageRating = riders.length
      ? riders.reduce((sum, rider) => sum + (rider.rating || 0), 0) / riders.length
      : 0;

    return [
      {
        title: 'Total Orders',
        value: totalOrders.toLocaleString(),
        change: `${totalOrders} total`,
        icon: '🛍',
        type: 'red'
      },
      {
        title: 'Total Riders',
        value: activeRiders.toLocaleString(),
        change: `${activeRiders} active`,
        icon: '🛵',
        type: 'green'
      },
      {
        title: "Today's Orders",
        value: todayOrders.toLocaleString(),
        change: `${todayOrders} today`,
        icon: '📦',
        type: 'blue'
      },
      {
        title: 'Total Revenue',
        value: `৳ ${totalRevenue.toLocaleString()}`,
        change: 'From delivered orders',
        icon: '৳',
        type: 'orange'
      },
      {
        title: 'Total Customers',
        value: users.length.toLocaleString(),
        change: 'Registered users',
        icon: '👥',
        type: 'purple'
      },
      {
        title: 'Average Rating',
        value: averageRating.toFixed(1),
        change: 'Across riders',
        icon: '⭐',
        type: 'yellow'
      },
      {
        title: 'Pending Requests',
        value: pendingRequests.toLocaleString(),
        change: 'Awaiting action',
        icon: '⏳',
        type: 'pending'
      },
      {
        title: 'Cancelled Orders',
        value: cancelledOrders.toLocaleString(),
        change: 'All time',
        icon: '✕',
        type: 'cancelled'
      }
    ];
  }

  get maxRevenue(): number {
    return Math.max(
      ...this.salesData.map(item => item.revenue)
    );
  }

  getRevenueHeight(value: number): number {
    return (value / this.maxRevenue) * 100;
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
  }

  refreshDashboard(): void {
    this.loadDashboard();
    this.toastService.success('Dashboard refreshed successfully!');
  }

  viewAllOrders(): void {
    this.toastService.info('Opening all orders...');
  }

  viewAllRestaurants(): void {
    this.toastService.info('Opening all restaurants...');
  }

  viewAllReviews(): void {
    this.toastService.info('Opening all reviews...');
  }

  quickAction(action: string): void {
    this.toastService.info(`${action} selected`);
  }
}