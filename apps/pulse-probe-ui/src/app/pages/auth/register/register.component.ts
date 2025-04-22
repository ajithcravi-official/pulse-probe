import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../service/toast/toast.service';

interface RegisterForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group<RegisterForm>(
      {
        name: this.fb.control(null, { validators: [Validators.required] }),
        email: this.fb.control(null, {
          validators: [Validators.required, Validators.email],
        }),
        password: this.fb.control(null, {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: this.fb.control(null, {
          validators: [Validators.required],
        }),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  register() {
    if (this.form.valid) {
      const { name, email, password } = this.form.value;

      this.auth.register({ name, email, password }).subscribe({
        next: () => {
          console.log('Registered successfully');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Registration failed');
        },
      });
    }
  }
}
