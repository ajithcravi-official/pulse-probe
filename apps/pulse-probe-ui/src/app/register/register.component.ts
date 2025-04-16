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

interface RegisterForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: NonNullableFormBuilder) {
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
      console.log('Registering:', { name, email, password });
      // TODO: call backend API
    }
  }
}
