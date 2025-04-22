import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts.asObservable();

  show(toast: Toast) {
    const toasts = [...this._toasts.value, toast];
    this._toasts.next(toasts);

    setTimeout(() => this.dismiss(toast), toast.timeout || 4000);
  }

  dismiss(toast: Toast) {
    const filtered = this._toasts.value.filter((t) => t !== toast);
    this._toasts.next(filtered);
  }

  success(message: string, timeout?: number) {
    this.show({ message, type: 'success', timeout });
  }

  error(message: string, timeout?: number) {
    this.show({ message, type: 'error', timeout });
  }
}
