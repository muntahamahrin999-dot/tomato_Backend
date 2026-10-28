import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  selectedPeriod = 'month';

  totalRevenue = 125800;

  totalOrders = 486;

  completedOrders = 421;

  pendingOrders = 18;

  preparingOrders = 29;

  cancelledOrders = 18;

  averageRating = 4.7;

  totalReviews = 184;


  salesData = [
    { label: 'Sat', value: 45 },
    { label: 'Sun', value: 65 },
    { label: 'Mon', value: 52 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 60 },
    { label: 'Thu', value: 88 },
    { label: 'Fri', value: 72 }
  ];


  topFoods = [
    {
      name: 'Chicken Burger',
      orders: 124,
      revenue: 37200
    },
    {
      name: 'Beef Pizza',
      orders: 96,
      revenue: 28800
    },
    {
      name: 'Chicken Biryani',
      orders: 87,
      revenue: 26100
    },
    {
      name: 'Pasta Alfredo',
      orders: 65,
      revenue: 19500
    }
  ];

}