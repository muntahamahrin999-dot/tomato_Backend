import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  email = '';

  isLoading = false;

  message = '';

  errorMessage = '';


  onSubmit(form: NgForm): void {

    this.message = '';
    this.errorMessage = '';

    if (form.invalid) {

      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });

      return;
    }


    this.isLoading = true;


    /*
     * Frontend prototype.
     *
     * Later this section will call:
     *
     * this.authService.forgotPassword(this.email)
     *
     * and connect with Spring Boot backend.
     */

    setTimeout(() => {

      this.isLoading = false;

      this.message =
        'If an account exists with this email, a password reset link has been sent.';

    }, 1000);

  }

}