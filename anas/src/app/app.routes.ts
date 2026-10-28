import { Routes } from "@angular/router";

// ======================================================
// LAYOUTS
// ======================================================
import { PublicLayoutComponent } from "./layouts/public-layout/public-layout.component";
import { CustomerLayoutComponent } from "./layouts/customer-layout/customer-layout.component";
import { RestaurantLayoutComponent } from "./layouts/restaurant-layout/restaurant-layout.component";
import { DeliveryLayoutComponent } from "./layouts/delivery-layout/delivery-layout.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";

// ======================================================
// GUARDS
// ======================================================
import { authGuard } from "./core/auth/guards/auth.guard";
import { roleGuard } from "./core/auth/guards/role.guard";

// ======================================================
// AUTH
// ======================================================
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { ForgotPasswordComponent } from "./features/auth/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./features/auth/reset-password/reset-password.component";

// ======================================================
// HOME
// ======================================================
import { HomeComponent } from "./features/home/home.component";

// ======================================================
// CUSTOMER
// ======================================================
import { FoodComponent } from "./features/customer/food/food.component";
import { RestaurantsComponent } from "./features/customer/restaurants/restaurants.component";
import { OffersComponent } from "./features/customer/offers/offers.component";
import { CartComponent } from "./features/customer/cart/cart.component";
import { CheckoutComponent } from "./features/customer/checkout/checkout.component";
import { OrderTrackingComponent } from "./features/customer/order-tracking/order-tracking.component";

import { OrdersComponent as CustomerOrdersComponent } from "./features/customer/orders/orders.component";

import { DashboardComponent as CustomerDashboardComponent } from "./features/customer/dashboard/dashboard.component";

import { ProfileComponent as CustomerProfileComponent } from "./features/customer/profile/profile.component";

import { FavoritesComponent } from "./features/customer/favorites/favorites.component";

import { ReviewsComponent as CustomerReviewsComponent } from "./features/customer/reviews/reviews.component";

// ======================================================
// RESTAURANT
// ======================================================
import { DashboardComponent as RestaurantDashboardComponent } from "./features/restaurant/dashboard/dashboard.component";

import { OrdersComponent as RestaurantOrdersComponent } from "./features/restaurant/orders/orders.component";

import { FoodManagementComponent } from "./features/restaurant/food-management/food-management.component";

import { CategoriesComponent } from "./features/restaurant/categories/categories.component";

import { InventoryComponent } from "./features/restaurant/inventory/inventory.component";

import { OffersComponent as RestaurantOffersComponent } from "./features/restaurant/offers/offers.component";

import { ReportsComponent } from "./features/restaurant/reports/reports.component";

import { ProfileComponent as RestaurantProfileComponent } from "./features/restaurant/profile/profile.component";

// ======================================================
// DELIVERY / RIDER
// ======================================================
import { DashboardComponent as DeliveryDashboardComponent } from "./features/delivery/dashboard/dashboard.component";

import { AssignedOrdersComponent } from "./features/delivery/assigned-orders/assigned-orders.component";

import { ActiveDeliveryComponent } from "./features/delivery/active-delivery/active-delivery.component";

import { DeliveryHistoryComponent } from "./features/delivery/delivery-history/delivery-history.component";

import { EarningsComponent } from "./features/delivery/earnings/earnings.component";

import { ProfileComponent as DeliveryProfileComponent } from "./features/delivery/profile/profile.component";

// ======================================================
// ADMIN
// ======================================================
import { DashboardComponent as AdminDashboardComponent } from "./features/admin/dashboard/dashboard.component";

import { OrdersComponent as AdminOrdersComponent } from "./features/admin/orders/orders.component";

import { PaymentsComponent as AdminPaymentsComponent } from "./features/admin/payments/payments.component";

import { ReportsComponent as AdminReportsComponent } from "./features/admin/reports/reports.component";

import { RestaurantsComponent as AdminRestaurantsComponent } from "./features/admin/restaurants/restaurants.component";

import { ReviewsComponent as AdminReviewsComponent } from "./features/admin/reviews/reviews.component";

import { RidersComponent as AdminRidersComponent } from "./features/admin/riders/riders.component";

import { UsersComponent as AdminUsersComponent } from "./features/admin/users/users.component";

import { CouponsComponent as AdminCouponsComponent } from "./features/admin/coupons/coupons.component";

import { SettingsComponent as AdminSettingsComponent } from "./features/admin/settings/settings.component";
import { guestGuard } from "./core/auth/guards/guest.guard";

// ======================================================
// ROUTES
// ======================================================

export const routes: Routes = [
  // ====================================================
  // ROOT REDIRECT
  // ====================================================
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },

  // ====================================================
  // PUBLIC ROUTES
  // ====================================================
  {
    path: "",
    component: PublicLayoutComponent,

    children: [
      // Home
      {
        path: "home",
        component: HomeComponent,
      },

      // Food
      {
        path: "food",
        component: FoodComponent,
      },

      // Restaurants
      {
        path: "restaurants",
        component: RestaurantsComponent,
      },

      // Offers
      {
        path: "offers",
        component: OffersComponent,
      },

      // Cart
      {
        path: "cart",
        component: CartComponent,
        canActivate: [authGuard],
      },

      // ==================================================
      // AUTHENTICATION
      // ==================================================

      {
        path: "login",
        component: LoginComponent,
        canActivate: [guestGuard],
      },

      {
        path: "register",
        component: RegisterComponent,
      },

      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
      },

      {
        path: "reset-password",
        component: ResetPasswordComponent,
      },
    ],
  },

  // ====================================================
  // CUSTOMER PANEL
  // ====================================================
  {
    path: "customer",

    component: CustomerLayoutComponent,

    canActivate: [authGuard, roleGuard(["customer"])],

    children: [
      // /customer
      // -> /customer/dashboard
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },

      // Dashboard
      {
        path: "dashboard",
        component: CustomerDashboardComponent,
      },

      // Browse Foods
      {
        path: "food",
        component: FoodComponent,
      },

      // Restaurants
      {
        path: "restaurants",
        component: RestaurantsComponent,
      },

      // Offers
      {
        path: "offers",
        component: OffersComponent,
      },

      // Favorites
      {
        path: "favorites",
        component: FavoritesComponent,
      },

      // Cart
      {
        path: "cart",
        component: CartComponent,
      },

      // Checkout
      {
        path: "checkout",
        component: CheckoutComponent,
      },

      // My Orders
      {
        path: "orders",
        component: CustomerOrdersComponent,
      },

      // Track Order
      {
        path: "order-tracking",
        component: OrderTrackingComponent,
      },

      // My Reviews
      {
        path: "reviews",
        component: CustomerReviewsComponent,
      },

      // Profile
      {
        path: "profile",
        component: CustomerProfileComponent,
      },
    ],
  },

  // ====================================================
  // CUSTOMER SHORTCUT ROUTES
  // ====================================================

  {
    path: "account",
    redirectTo: "customer/dashboard",
    pathMatch: "full",
  },

  {
    path: "profile",
    redirectTo: "customer/profile",
    pathMatch: "full",
  },

  {
    path: "orders",
    redirectTo: "customer/orders",
    pathMatch: "full",
  },

  {
    path: "checkout",
    redirectTo: "customer/checkout",
    pathMatch: "full",
  },

  {
    path: "order-tracking",
    redirectTo: "customer/order-tracking",
    pathMatch: "full",
  },

  {
    path: "favorites",
    redirectTo: "customer/favorites",
    pathMatch: "full",
  },

  {
    path: "reviews",
    redirectTo: "customer/reviews",
    pathMatch: "full",
  },

  // ====================================================
  // RESTAURANT PANEL
  // ====================================================
  {
    path: "restaurant",

    component: RestaurantLayoutComponent,

    canActivate: [authGuard, roleGuard(["restaurant"])],

    children: [
      // /restaurant
      // -> /restaurant/dashboard
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },

      // Dashboard
      {
        path: "dashboard",
        component: RestaurantDashboardComponent,
      },

      // Orders
      {
        path: "orders",
        component: RestaurantOrdersComponent,
      },

      // Food Management
      {
        path: "food-management",
        component: FoodManagementComponent,
      },

      // Categories
      {
        path: "categories",
        component: CategoriesComponent,
      },

      // Inventory
      {
        path: "inventory",
        component: InventoryComponent,
      },

      // Offers
      {
        path: "offers",
        component: RestaurantOffersComponent,
      },

      // Reports
      {
        path: "reports",
        component: ReportsComponent,
      },

      // Profile
      {
        path: "profile",
        component: RestaurantProfileComponent,
      },
    ],
  },

  // ====================================================
  // DELIVERY / RIDER PANEL
  // ====================================================
  {
    path: "delivery",

    component: DeliveryLayoutComponent,

    canActivate: [authGuard, roleGuard(["rider"])],

    children: [
      // /delivery
      // -> /delivery/dashboard
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },

      // Dashboard
      {
        path: "dashboard",
        component: DeliveryDashboardComponent,
      },

      // Assigned Orders
      {
        path: "assigned-orders",
        component: AssignedOrdersComponent,
      },

      // Active Delivery
      {
        path: "active-delivery",
        component: ActiveDeliveryComponent,
      },

      // Delivery History
      {
        path: "delivery-history",
        component: DeliveryHistoryComponent,
      },

      // Earnings
      {
        path: "earnings",
        component: EarningsComponent,
      },

      // Profile
      {
        path: "profile",
        component: DeliveryProfileComponent,
      },
    ],
  },

  // ====================================================
  // ADMIN PANEL
  // ====================================================
  {
    path: "admin",

    component: AdminLayoutComponent,

    canActivate: [authGuard, roleGuard(["admin"])],

    children: [
      // /admin
      // -> /admin/dashboard
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },

      // Dashboard
      {
        path: "dashboard",
        component: AdminDashboardComponent,
      },

      // Orders
      {
        path: "orders",
        component: AdminOrdersComponent,
      },

      // Payments
      {
        path: "payments",
        component: AdminPaymentsComponent,
      },

      // Reports
      {
        path: "reports",
        component: AdminReportsComponent,
      },

      // Restaurants
      {
        path: "restaurants",
        component: AdminRestaurantsComponent,
      },

      // Reviews
      {
        path: "reviews",
        component: AdminReviewsComponent,
      },

      // Riders
      {
        path: "riders",
        component: AdminRidersComponent,
      },

      // Users
      {
        path: "users",
        component: AdminUsersComponent,
      },

      // Coupons
      {
        path: "coupons",
        component: AdminCouponsComponent,
      },

      // Settings
      {
        path: "settings",
        component: AdminSettingsComponent,
      },
    ],
  },

  // ====================================================
  // WILDCARD / UNKNOWN ROUTE
  // ====================================================
  {
    path: "**",
    redirectTo: "",
  },
];
