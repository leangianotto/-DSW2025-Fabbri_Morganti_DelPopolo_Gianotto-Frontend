import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  message: string = '';
  type: 'success' | 'danger' | 'info' | 'warning' = 'success';
  visible: boolean = false;

  showToast(
    message: string,
    type: 'success' | 'danger' | 'info' | 'warning' = 'success'
  ): void {
    this.message = message;
    this.type = type;
    this.visible = true;

    setTimeout(() => this.clear(), 2500);
  }

  clear(): void {
    this.visible = false;
    this.message = '';
  }
}
