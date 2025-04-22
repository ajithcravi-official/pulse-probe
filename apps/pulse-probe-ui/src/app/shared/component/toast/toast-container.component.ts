import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ToastService } from '../../../service/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './toast-container.component.html',
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
