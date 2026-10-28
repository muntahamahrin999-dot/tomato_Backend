import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: 'Good' | 'Low' | 'Out of Stock';
}

@Component({
  selector: 'app-restaurant-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {

  private toastService = inject(ToastService);
  searchText = '';
  inventory: InventoryItem[] = [];

  // Modal states
  showAddModal = false;
  showRestockModal = false;
  showEditModal = false;

  newItem: { name: string; category: string; quantity: number; unit: string } = {
    name: '',
    category: 'Vegetables',
    quantity: 10,
    unit: 'kg'
  };

  selectedItemForRestock: InventoryItem | null = null;
  restockAmount = 10;
  editingItem: InventoryItem | null = null;

  categories: string[] = ['Meat', 'Dairy', 'Vegetables', 'Bakery', 'Grains', 'Beverages', 'Spices', 'Sauces'];
  units = ['kg', 'pcs', 'liters', 'packets', 'grams'];

  ngOnInit(): void {
    this.loadInventory();
    this.loadCategories();
  }

  loadCategories(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('tomato_restaurant_inventory_categories');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.categories = parsed;
          }
        } catch (e) {}
      }
    }
  }

  saveNewCategoryIfNeeded(cat: string): void {
    const trimmed = cat.trim();
    if (trimmed && !this.categories.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      this.categories.push(trimmed);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('tomato_restaurant_inventory_categories', JSON.stringify(this.categories));
      }
    }
  }

  loadInventory(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('tomato_restaurant_inventory');
      if (stored) {
        try {
          this.inventory = JSON.parse(stored);
          this.saveInventory();
          return;
        } catch (e) {}
      }
    }
    this.inventory = [
      { id: 1, name: 'Chicken', category: 'Meat', quantity: 25, unit: 'kg', status: 'Good' },
      { id: 2, name: 'Beef', category: 'Meat', quantity: 8, unit: 'kg', status: 'Low' },
      { id: 3, name: 'Cheese', category: 'Dairy', quantity: 15, unit: 'kg', status: 'Good' },
      { id: 4, name: 'Tomato', category: 'Vegetables', quantity: 4, unit: 'kg', status: 'Low' },
      { id: 5, name: 'Burger Buns', category: 'Bakery', quantity: 0, unit: 'pcs', status: 'Out of Stock' },
      { id: 6, name: 'Rice', category: 'Grains', quantity: 35, unit: 'kg', status: 'Good' }
    ];
    this.saveInventory();
  }

  saveInventory(): void {
    this.inventory.forEach(item => {
      if (item.quantity === 0) item.status = 'Out of Stock';
      else if (item.quantity < 5) item.status = 'Low';
      else item.status = 'Good';
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('tomato_restaurant_inventory', JSON.stringify(this.inventory));
    }
  }

  get filteredInventory(): InventoryItem[] {
    const search = this.searchText.toLowerCase().trim();
    if (!search) return this.inventory;
    return this.inventory.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
  }

  get lowStockCount(): number {
    return this.inventory.filter(item => item.status === 'Low').length;
  }

  get outOfStockCount(): number {
    return this.inventory.filter(item => item.status === 'Out of Stock').length;
  }

  openAddModal(): void {
    this.newItem = { name: '', category: 'Vegetables', quantity: 10, unit: 'kg' };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveNewStock(): void {
    if (!this.newItem.name || !this.newItem.name.trim()) {
      this.toastService.warning('Please enter ingredient name.');
      return;
    }
    if (this.newItem.quantity < 0) {
      this.toastService.warning('Quantity cannot be negative.');
      return;
    }

    const cat = this.newItem.category.trim() || 'General';
    this.saveNewCategoryIfNeeded(cat);

    const item: InventoryItem = {
      id: Date.now(),
      name: this.newItem.name.trim(),
      category: cat,
      quantity: Number(this.newItem.quantity),
      unit: this.newItem.unit,
      status: this.newItem.quantity === 0 ? 'Out of Stock' : this.newItem.quantity < 5 ? 'Low' : 'Good'
    };

    this.inventory.unshift(item);
    this.saveInventory();
    this.toastService.success(`Stock item "${item.name}" added successfully!`);
    this.closeAddModal();
  }

  openRestockModal(item: InventoryItem): void {
    this.selectedItemForRestock = item;
    this.restockAmount = 10;
    this.showRestockModal = true;
  }

  closeRestockModal(): void {
    this.showRestockModal = false;
    this.selectedItemForRestock = null;
  }

  confirmRestock(): void {
    if (!this.selectedItemForRestock) return;
    if (this.restockAmount <= 0) {
      this.toastService.warning('Please enter a valid restock amount.');
      return;
    }

    this.selectedItemForRestock.quantity += Number(this.restockAmount);
    this.saveInventory();
    this.toastService.success(`Successfully restocked ${this.restockAmount} ${this.selectedItemForRestock.unit} of ${this.selectedItemForRestock.name}!`);
    this.closeRestockModal();
  }

  openEditModal(item: InventoryItem): void {
    this.editingItem = { ...item };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingItem = null;
  }

  saveEditedStock(): void {
    if (!this.editingItem || !this.editingItem.name.trim()) {
      this.toastService.warning('Please enter ingredient name.');
      return;
    }
    const cat = this.editingItem.category.trim() || 'General';
    this.saveNewCategoryIfNeeded(cat);

    const idx = this.inventory.findIndex(i => i.id === this.editingItem?.id);
    if (idx > -1) {
      this.inventory[idx] = { ...this.editingItem, name: this.editingItem.name.trim(), category: cat };
      this.saveInventory();
      this.toastService.success('Stock item updated successfully!');
    }
    this.closeEditModal();
  }

  deleteStock(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this inventory item?');
    if (!confirmed) return;

    this.inventory = this.inventory.filter(i => i.id !== id);
    this.saveInventory();
    this.toastService.success('Inventory item deleted successfully.');
  }
}
