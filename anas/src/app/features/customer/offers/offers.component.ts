import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { CouponService } from '../../../services/coupon.service';
import { Coupon } from '../../../models/coupon.model';
import { ToastService } from '../../../core/services/toast.service';

interface Offer {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  discount: string;
  code: string;
  restaurant: string;
  food: string;
  price: number | null;
  oldPrice: number | null;
  image: string;
  badge: string;
}

const DEFAULT_OFFER_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900';

const MOCK_OFFERS: Offer[] = [
  {
    id: 101,
    title: 'Burger Special',
    subtitle: 'A delicious deal for burger lovers',
    description: 'Enjoy a juicy classic beef burger at a special price.',
    discount: '20% OFF',
    code: 'BURGER20',
    restaurant: 'Tomato Kitchen',
    food: 'Classic Beef Burger',
    price: 280,
    oldPrice: 350,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900',
    badge: 'POPULAR'
  },
  {
    id: 102,
    title: 'Pizza Deal',
    subtitle: 'More cheese, more happiness',
    description: 'Get your favorite chicken pizza at an exclusive offer price.',
    discount: '15% OFF',
    code: 'PIZZA15',
    restaurant: 'Pizza House',
    food: 'Chicken Pizza',
    price: 578,
    oldPrice: 680,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900',
    badge: 'HOT DEAL'
  },
  {
    id: 103,
    title: 'Biryani Feast',
    subtitle: 'Aromatic and flavorful',
    description: 'Enjoy delicious chicken biryani with a special discount.',
    discount: '10% OFF',
    code: 'BIRYANI10',
    restaurant: 'Biryani Express',
    food: 'Chicken Biryani',
    price: 252,
    oldPrice: 280,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900',
    badge: 'LIMITED'
  }
];

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {

  private couponService = inject(CouponService);
  private toastService = inject(ToastService);

  offers: Offer[] = MOCK_OFFERS;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  private loadOffers(): void {
    this.couponService.getAll().subscribe({
      next: (coupons: Coupon[]) => {
        const mapped = (coupons || [])
          .filter(coupon => (coupon.status || 'Active') === 'Active')
          .map((coupon, index) => this.mapCoupon(coupon, index));

        this.offers = mapped.length > 0 ? mapped : MOCK_OFFERS;
      },
      error: () => {
        this.offers = MOCK_OFFERS;
      }
    });
  }

  private mapCoupon(coupon: Coupon, index: number): Offer {
    const discount = Number(coupon.discount) || 0;
    const minOrder = Number(coupon.minOrder) || 0;
    const expiry = this.formatDate(coupon.expiryDate);

    return {
      id: coupon.id ?? index + 1,
      title: coupon.title || coupon.code,
      subtitle: expiry
        ? `Valid until ${expiry}`
        : (minOrder > 0 ? `Min. order ৳${minOrder}` : ''),
      description: coupon.description || '',
      discount: coupon.discountType === 'Fixed' ? `৳${discount} OFF` : `${discount}% OFF`,
      code: coupon.code,
      restaurant: '',
      food: '',
      price: null,
      oldPrice: null,
      image: DEFAULT_OFFER_IMAGE,
      badge: coupon.status || 'Active'
    };
  }

  private formatDate(value?: string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  applyOffer(offer: Offer): void {
    if (offer.price !== null && offer.oldPrice !== null) {
      this.addToCart(offer);
      return;
    }

    this.copyCode(offer.code);
  }

  private addToCart(offer: Offer): void {
    this.cartService.addToCart({
      id: offer.id,
      name: offer.food,
      price: offer.price as number,
      image: offer.image,
      restaurant: offer.restaurant
    });

    this.toastService.success(`${offer.food} added to cart.`);
    this.router.navigate(['/cart']);
  }

  private copyCode(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(
        () => this.toastService.success(`Code ${code} copied.`),
        () => this.toastService.info(`Use code: ${code}`)
      );
      return;
    }

    this.toastService.info(`Use code: ${code}`);
  }
}
