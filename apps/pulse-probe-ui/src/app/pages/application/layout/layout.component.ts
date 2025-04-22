import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoaderService } from '../../../service/loader/loader.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  constructor(private router: Router, private loaderService: LoaderService) {}

  logout() {
    this.loaderService.startLoading();

    // Clear token or session
    localStorage.clear(); // Or specific item: localStorage.removeItem('token');

    // Redirect to login
    this.router.navigate(['/login']);

    this.loaderService.stopLoading();
  }
}
