import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rider } from '../../../models/rider.model';
import { RiderService } from '../../../services/rider.service';
import { AddRiderComponent } from './add-rider/add-rider.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-riders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddRiderComponent
  ],
  templateUrl: './riders.component.html',
  styleUrl: './riders.component.scss'
})
export class RidersComponent implements OnInit {

  private toastService = inject(ToastService);

  searchText: string = '';
  selectedStatus: string = 'All';

  riders: Rider[] = [];
  isLoading = false;
  errorMessage = '';

  // Form View State
  showForm = false;
  selectedRiderToEdit: Rider | null = null;

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    this.loadRiders();
  }

  loadRiders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.riderService.getAll().subscribe({
      next: (data: Rider[]) => {
        this.riders = data || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load riders from server.';
        console.error('Error loading riders:', err);
      }
    });
  }

  get filteredRiders(): Rider[] {
    const search = this.searchText.toLowerCase().trim();

    return this.riders.filter(rider => {
      const matchesSearch =
        !search ||
        (rider.name && rider.name.toLowerCase().includes(search)) ||
        (rider.email && rider.email.toLowerCase().includes(search)) ||
        (rider.phone && rider.phone.toLowerCase().includes(search)) ||
        (rider.zone && rider.zone.toLowerCase().includes(search)) ||
        (rider.vehicle && rider.vehicle.toLowerCase().includes(search));

      const matchesStatus =
        this.selectedStatus === 'All' ||
        rider.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get activeRiders(): number {
    return this.riders.filter(rider => rider.status === 'Active').length;
  }

  get onDeliveryRiders(): number {
    return this.riders.filter(rider => rider.status === 'On Delivery').length;
  }

  get pendingRiders(): number {
    return this.riders.filter(rider => rider.status === 'Pending').length;
  }

  get suspendedRiders(): number {
    return this.riders.filter(rider => rider.status === 'Suspended').length;
  }

  get totalOrders(): number {
    return this.riders.reduce((sum, rider) => sum + (rider.ordersCount || rider.orders || 0), 0);
  }

  get averageRating(): string {
    if (!this.riders.length) {
      return '0.0';
    }
    const total = this.riders.reduce((sum, rider) => sum + (rider.rating || 0), 0);
    return (total / this.riders.length).toFixed(1);
  }

  get totalRiders(): number {
    return this.riders.length;
  }

  getInitials(name: string): string {
    if (!name) return 'R';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  trackByRider(index: number, rider: Rider): number {
    return rider.id || index;
  }

  formatRiderId(id?: number): string {
    if (!id) return '0000';
    return id.toString().padStart(4, '0');
  }

  addRider(): void {
    this.selectedRiderToEdit = null;
    this.showForm = true;
  }

  editRider(rider: Rider): void {
    this.selectedRiderToEdit = { ...rider };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedRiderToEdit = null;
  }

  onFormSaved(saved: Rider): void {
    const idx = this.riders.findIndex(r => r.id === saved.id);
    if (idx > -1) {
      this.riders[idx] = saved;
    } else {
      this.riders.unshift(saved);
    }
    this.showForm = false;
    this.selectedRiderToEdit = null;
  }

  viewRider(rider: Rider): void {
    this.toastService.info(
      `${rider.name} · ${rider.vehicle || 'N/A'} · ${rider.zone || 'N/A'} · ${rider.status}`
    );
  }

  deleteRider(rider: Rider): void {
    if (!rider.id) return;
    const confirmed = confirm(`Are you sure you want to delete rider ${rider.name}?`);
    if (confirmed) {
      this.riderService.delete(rider.id).subscribe({
        next: () => {
          this.riders = this.riders.filter(r => r.id !== rider.id);
          this.toastService.success('Rider deleted successfully.');
        },
        error: (err: any) => {
          this.toastService.error('Failed to delete rider: ' + (err?.error?.message || err.message));
        }
      });
    }
  }

  toggleStatus(rider: Rider): void {
    if (!rider.id) return;
    const nextStatus = rider.status === 'Active' ? 'Suspended' : 'Active';
    this.riderService.updateStatus(rider.id, nextStatus).subscribe({
      next: (res: Rider) => {
        rider.status = res.status;
      },
      error: () => {
        rider.status = nextStatus;
      }
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = 'All';
  }
}