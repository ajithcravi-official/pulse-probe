import { Injectable } from '@angular/core';

export interface ToastMessage {
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
  delay: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: ToastMessage[] = [];

  show(message: string, type: ToastMessage['type'] = 'info', delay = 5000) {
    this.toasts.push({ message, type, delay });
  }

  success(message: string, delay = 5000) {
    this.show(message, 'success', delay);
  }

  error(message: string, delay = 5000) {
    this.show(message, 'danger', delay);
  }

  remove(toast: ToastMessage) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
