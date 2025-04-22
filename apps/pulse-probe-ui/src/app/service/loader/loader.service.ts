import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();

  startLoading() {
    this._loading.next(true);
  }

  stopLoading() {
    this._loading.next(false);
  }
}
