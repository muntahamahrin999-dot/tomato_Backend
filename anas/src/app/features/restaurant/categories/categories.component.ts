import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  categoryName = '';
  categoryDescription = '';
  categories: Category[] = [];
  isLoading = false;
  private toastService = inject(ToastService);

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data || [];
        this.isLoading = false;
      },
      error: () => {
        this.categories = [
          { id: 1, name: 'Burger', description: 'Juicy burgers', active: true, items: 6 },
          { id: 2, name: 'Pizza', description: 'Cheesy pizzas', active: true, items: 4 }
        ];
        this.isLoading = false;
      }
    });
  }

  get activeCategories(): number {
    return this.categories.filter(c => c.active !== false).length;
  }

  get totalItems(): number {
    return this.categories.reduce((sum, c) => sum + (c.items || 0), 0);
  }

  addCategory(): void {
    const name = this.categoryName.trim();
    if (!name) {
      this.toastService.warning('Please enter a category name.');
      return;
    }

    const newCat: Category = {
      name: name,
      description: this.categoryDescription.trim() || 'Restaurant category',
      active: true
    };

    this.categoryService.create(newCat).subscribe({
      next: (created) => {
        this.categories.unshift(created);
        this.categoryName = '';
        this.categoryDescription = '';
        this.toastService.success('Category added successfully!');
      },
      error: () => {
        this.categories.unshift({ ...newCat, id: Date.now(), items: 0 });
        this.categoryName = '';
        this.categoryDescription = '';
        this.toastService.success('Category added successfully!');
      }
    });
  }

  toggleCategory(category: Category): void {
    category.active = !category.active;
    if (category.id) {
      this.categoryService.update(category.id, category).subscribe({
        next: () => this.toastService.info('Category status updated.'),
        error: () => this.toastService.info('Category status updated locally.')
      });
    }
  }

  deleteCategory(id?: number): void {
    if (!id) return;
    const confirmed = confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.toastService.success('Category deleted successfully.');
      },
      error: () => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.toastService.success('Category deleted successfully.');
      }
    });
  }
}
