import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../service/toast/toast.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group<LoginForm>({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', { validators: [Validators.required] }),
    });
  }

  login() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.auth.login({ email, password }).subscribe({
        next: (res) => {
          this.auth.storeToken(res.access_token);
          this.router.navigate(['app/dashboard']);
        },
        error: (err) => {
          this.toast.error(err?.error?.message || 'Login failed');
        },
      });
    }
  }
}
