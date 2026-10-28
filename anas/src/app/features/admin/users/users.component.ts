import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { UserService } from '../../../services/user.service';
import { User as BackendUser } from '../../../models/user.model';

interface User {
  id: number;
  userName?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  orders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'Blocked';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  private toastService = inject(ToastService);
  private userService = inject(UserService);

  searchText = '';
  selectedStatus = 'All';

  isLoading = false;

  users: User[] = [
    {
      id: 1,
      name: 'Nusrat Jahan',
      email: 'nusrat@gmail.com',
      phone: '01711-223344',
      location: 'Dhanmondi, Dhaka',
      joinedDate: 'Sep 12, 2026',
      orders: 28,
      totalSpent: 8450,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Tanvir Ahmed',
      email: 'tanvir@gmail.com',
      phone: '01822-334455',
      location: 'Mirpur, Dhaka',
      joinedDate: 'Sep 10, 2026',
      orders: 21,
      totalSpent: 6320,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Sadia Rahman',
      email: 'sadia@gmail.com',
      phone: '01933-445566',
      location: 'Uttara, Dhaka',
      joinedDate: 'Sep 08, 2026',
      orders: 35,
      totalSpent: 11250,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Rakib Hasan',
      email: 'rakib@gmail.com',
      phone: '01644-556677',
      location: 'Mohammadpur, Dhaka',
      joinedDate: 'Sep 05, 2026',
      orders: 14,
      totalSpent: 4250,
      status: 'Inactive'
    },
    {
      id: 5,
      name: 'Mim Akter',
      email: 'mim@gmail.com',
      phone: '01555-667788',
      location: 'Banani, Dhaka',
      joinedDate: 'Sep 03, 2026',
      orders: 42,
      totalSpent: 13780,
      status: 'Active'
    },
    {
      id: 6,
      name: 'Fahim Chowdhury',
      email: 'fahim@gmail.com',
      phone: '01366-778899',
      location: 'Gulshan, Dhaka',
      joinedDate: 'Aug 28, 2026',
      orders: 19,
      totalSpent: 5680,
      status: 'Blocked'
    },
    {
      id: 7,
      name: 'Jannatul Ferdous',
      email: 'jannatul@gmail.com',
      phone: '01477-889900',
      location: 'Farmgate, Dhaka',
      joinedDate: 'Aug 25, 2026',
      orders: 31,
      totalSpent: 9240,
      status: 'Active'
    },
    {
      id: 8,
      name: 'Imran Hossain',
      email: 'imran@gmail.com',
      phone: '01788-990011',
      location: 'Motijheel, Dhaka',
      joinedDate: 'Aug 21, 2026',
      orders: 11,
      totalSpent: 3180,
      status: 'Inactive'
    },
    {
      id: 9,
      name: 'Rafi Ahmed',
      email: 'rafi@gmail.com',
      phone: '01899-112233',
      location: 'Wari, Dhaka',
      joinedDate: 'Aug 18, 2026',
      orders: 24,
      totalSpent: 7140,
      status: 'Active'
    },
    {
      id: 10,
      name: 'Sharmeen Akter',
      email: 'sharmeen@gmail.com',
      phone: '01911-223344',
      location: 'Bashundhara, Dhaka',
      joinedDate: 'Aug 15, 2026',
      orders: 38,
      totalSpent: 12650,
      status: 'Active'
    }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (data: BackendUser[]) => {
        this.users = (data || []).map((user, index) => this.mapBackendUser(user, index));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.isLoading = false;
      }
    });
  }

  private mapBackendUser(user: BackendUser, index: number): User {
    const name = [user.userFirstName, user.userLastName]
      .filter(part => !!part && part.trim() !== '')
      .join(' ')
      .trim() || user.userName;

    return {
      id: index + 1,
      userName: user.userName,
      name,
      email: user.email || 'N/A',
      phone: user.phoneNumber || 'N/A',
      location: '—',
      joinedDate: user.dateCreated
        ? new Date(user.dateCreated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—',
      orders: 0,
      totalSpent: 0,
      status: user.enabled === false ? 'Blocked' : 'Active'
    };
  }

  get filteredUsers(): User[] {
    const search = this.searchText.toLowerCase().trim();

    return this.users.filter(user => {

      const matchesSearch =
        !search ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phone.toLowerCase().includes(search) ||
        user.location.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        user.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter(
      user => user.status === 'Active'
    ).length;
  }

  get inactiveUsers(): number {
    return this.users.filter(
      user => user.status === 'Inactive'
    ).length;
  }

  get blockedUsers(): number {
    return this.users.filter(
      user => user.status === 'Blocked'
    ).length;
  }

  get totalOrders(): number {
    return this.users.reduce(
      (sum, user) => sum + user.orders,
      0
    );
  }

  get totalRevenue(): number {
    return this.users.reduce(
      (sum, user) => sum + user.totalSpent,
      0
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  trackByUser(index: number, user: User): number {
    return user.id;
  }

  viewUser(user: User): void {
    this.toastService.info(
      `${user.name} · ${user.location} · ${user.orders} orders · ${user.status}`
    );
  }

  editUser(user: User): void {
    this.toastService.info(`Edit user: ${user.name}`);
  }

  toggleStatus(user: User): void {
    if (user.status === 'Active') {
      user.status = 'Inactive';
    } else {
      user.status = 'Active';
    }
  }

  blockUser(user: User): void {
    if (user.status === 'Blocked') {
      user.status = 'Active';
    } else {
      user.status = 'Blocked';
    }
  }

  deleteUser(user: User): void {
    const confirmed = confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    if (!user.userName) {
      this.users = this.users.filter(
        item => item.id !== user.id
      );
      this.toastService.success('User deleted successfully.');
      return;
    }

    this.userService.delete(user.userName).subscribe({
      next: () => {
        this.users = this.users.filter(
          item => item.id !== user.id
        );
        this.toastService.success('User deleted successfully.');
      },
      error: (err) => {
        this.toastService.error('Failed to delete user: ' + (err?.error?.message || err.message));
      }
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = 'All';
  }
}