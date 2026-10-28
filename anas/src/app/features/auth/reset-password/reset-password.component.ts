import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  password = '';

  confirmPassword = '';

  showPassword = false;

  showConfirmPassword = false;

  isLoading = false;

  message = '';

  errorMessage = '';


  constructor(
    private router: Router
  ) {}


  togglePassword(): void {
    this.showPassword =
      !this.showPassword;
  }


  toggleConfirmPassword(): void {
    this.showConfirmPassword =
      !this.showConfirmPassword;
  }


  onSubmit(form: NgForm): void {

    this.message = '';

    this.errorMessage = '';


    if (form.invalid) {

      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });

      return;
    }


    if (this.password !== this.confirmPassword) {

      this.errorMessage =
        'Passwords do not match. Please try again.';

      return;
    }


    this.isLoading = true;


    /*
     * Frontend prototype.
     *
     * Later connect this with:
     *
     * this.authService.resetPassword(
     *   token,
     *   this.password
     * )
     *
     * and your Spring Boot backend.
     */

    setTimeout(() => {

      this.isLoading = false;

      this.message =
        'Your password has been reset successfully.';


      /*
       * Give the user a moment to see
       * the success message.
       */

      setTimeout(() => {

        this.router.navigate(['/login']);

      }, 1200);

    }, 1000);

  }

}