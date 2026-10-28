import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

interface Review {
  id: number;
  customer: string;
  email: string;
  restaurant: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Published' | 'Pending' | 'Hidden';
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {

  private toastService = inject(ToastService);

  searchText = '';
  selectedRating = 'All';
  selectedStatus = 'All';

  reviews: Review[] = [
    {
      id: 1,
      customer: 'Nusrat Jahan',
      email: 'nusrat@gmail.com',
      restaurant: 'Food Palace',
      rating: 5,
      comment: 'Amazing food and very fast delivery. Highly recommended!',
      date: 'Sep 25, 2026',
      status: 'Published'
    },
    {
      id: 2,
      customer: 'Tanvir Ahmed',
      email: 'tanvir@gmail.com',
      restaurant: 'Burger House',
      rating: 4,
      comment: 'The burger was delicious and fresh. Delivery was good.',
      date: 'Sep 24, 2026',
      status: 'Published'
    },
    {
      id: 3,
      customer: 'Sadia Rahman',
      email: 'sadia@gmail.com',
      restaurant: 'Pizza Corner',
      rating: 5,
      comment: 'Really loved the pizza. Perfect taste and great packaging.',
      date: 'Sep 23, 2026',
      status: 'Published'
    },
    {
      id: 4,
      customer: 'Rakib Hasan',
      email: 'rakib@gmail.com',
      restaurant: 'Spice Garden',
      rating: 3,
      comment: 'Food was okay but delivery took longer than expected.',
      date: 'Sep 22, 2026',
      status: 'Pending'
    },
    {
      id: 5,
      customer: 'Mim Akter',
      email: 'mim@gmail.com',
      restaurant: 'Kacchi Express',
      rating: 5,
      comment: 'The kacchi was excellent. Everything tasted fresh.',
      date: 'Sep 21, 2026',
      status: 'Published'
    },
    {
      id: 6,
      customer: 'Fahim Chowdhury',
      email: 'fahim@gmail.com',
      restaurant: 'Chicken World',
      rating: 2,
      comment: 'Food quality was not as expected this time.',
      date: 'Sep 20, 2026',
      status: 'Hidden'
    },
    {
      id: 7,
      customer: 'Jannatul Ferdous',
      email: 'jannatul@gmail.com',
      restaurant: 'Food Palace',
      rating: 4,
      comment: 'Good food and reasonable price. Will order again.',
      date: 'Sep 19, 2026',
      status: 'Published'
    },
    {
      id: 8,
      customer: 'Imran Hossain',
      email: 'imran@gmail.com',
      restaurant: 'Pizza Corner',
      rating: 5,
      comment: 'One of the best pizzas I have had recently.',
      date: 'Sep 18, 2026',
      status: 'Pending'
    },
    {
      id: 9,
      customer: 'Rafi Ahmed',
      email: 'rafi@gmail.com',
      restaurant: 'Burger House',
      rating: 4,
      comment: 'Nice burger and good service.',
      date: 'Sep 17, 2026',
      status: 'Published'
    },
    {
      id: 10,
      customer: 'Sharmeen Akter',
      email: 'sharmeen@gmail.com',
      restaurant: 'Spice Garden',
      rating: 5,
      comment: 'Excellent experience from ordering to delivery.',
      date: 'Sep 16, 2026',
      status: 'Published'
    }
  ];


  // =====================================================
  // TRACK BY
  // =====================================================

  trackByReview(index: number, review: Review): number {
    return review.id;
  }


  // =====================================================
  // FILTERED REVIEWS
  // =====================================================

  get filteredReviews(): Review[] {

    const search = this.searchText.toLowerCase().trim();

    return this.reviews.filter(review => {

      const matchesSearch =
        !search ||
        review.customer.toLowerCase().includes(search) ||
        review.email.toLowerCase().includes(search) ||
        review.restaurant.toLowerCase().includes(search) ||
        review.comment.toLowerCase().includes(search);

      const matchesRating =
        this.selectedRating === 'All' ||
        review.rating === Number(this.selectedRating);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        review.status === this.selectedStatus;

      return matchesSearch && matchesRating && matchesStatus;
    });
  }


  // =====================================================
  // STATISTICS
  // =====================================================

  get totalReviews(): number {
    return this.reviews.length;
  }

  get averageRating(): number {

    if (this.reviews.length === 0) {
      return 0;
    }

    const total = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return total / this.reviews.length;
  }

  // IMPORTANT:
  // HTML-এ Math.round() ব্যবহার করা হয়নি।
  get roundedRating(): number {
    return Math.round(this.averageRating);
  }

  get fiveStarReviews(): number {
    return this.reviews.filter(
      review => review.rating === 5
    ).length;
  }

  get pendingReviews(): number {
    return this.reviews.filter(
      review => review.status === 'Pending'
    ).length;
  }

  get publishedReviews(): number {
    return this.reviews.filter(
      review => review.status === 'Published'
    ).length;
  }


  // =====================================================
  // RATING
  // =====================================================

  getRatingCount(rating: number): number {

    return this.reviews.filter(
      review => review.rating === rating
    ).length;
  }

  getRatingPercentage(rating: number): number {

    if (this.totalReviews === 0) {
      return 0;
    }

    return (
      this.getRatingCount(rating) /
      this.totalReviews
    ) * 100;
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }


  // =====================================================
  // INITIALS
  // =====================================================

  getInitials(name: string): string {

    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }


  // =====================================================
  // ACTIONS
  // =====================================================

  viewReview(review: Review): void {

    this.toastService.info(
      `Review from ${review.customer} · ${review.rating}/5 · ${review.status}`
    );
  }

  approveReview(review: Review): void {
    review.status = 'Published';
  }

  hideReview(review: Review): void {
    review.status = 'Hidden';
  }

  deleteReview(review: Review): void {

    const confirmed = confirm(
      `Are you sure you want to delete the review from ${review.customer}?`
    );

    if (confirmed) {

      this.reviews = this.reviews.filter(
        item => item.id !== review.id
      );

      this.toastService.success('Review deleted successfully.');
    }
  }


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  clearFilters(): void {

    this.searchText = '';
    this.selectedRating = 'All';
    this.selectedStatus = 'All';
  }
}