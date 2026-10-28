import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

interface Review {
  id: number;
  restaurant: string;
  food: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {

  private toastService = inject(ToastService);

  reviews: Review[] = [
    {
      id: 1,
      restaurant: 'Tomato Kitchen',
      food: 'Classic Beef Burger',
      rating: 5,
      comment: 'The burger was fresh and delicious. Delivery was also quick.',
      date: '20 Sep 2026'
    },
    {
      id: 2,
      restaurant: 'Pizza House',
      food: 'Chicken Pizza',
      rating: 4,
      comment: 'Very tasty pizza with plenty of cheese and chicken.',
      date: '18 Sep 2026'
    }
  ];

  newRating = 5;
  newRestaurant = '';
  newFood = '';
  newComment = '';

  submitReview(): void {

    if (
      !this.newRestaurant.trim() ||
      !this.newFood.trim() ||
      !this.newComment.trim()
    ) {
      this.toastService.warning('Please fill in all review fields.');
      return;
    }

    const review: Review = {
      id: Date.now(),
      restaurant: this.newRestaurant,
      food: this.newFood,
      rating: this.newRating,
      comment: this.newComment,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    this.reviews.unshift(review);

    this.newRestaurant = '';
    this.newFood = '';
    this.newRating = 5;
    this.newComment = '';

    this.toastService.success('Review submitted successfully.');
  }

  deleteReview(id: number): void {
    this.reviews = this.reviews.filter(
      review => review.id !== id
    );
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}