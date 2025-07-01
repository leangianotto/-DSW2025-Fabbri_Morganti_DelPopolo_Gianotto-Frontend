import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface OrderItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createOrder(order: { userId: number; totalAmount: number; items: OrderItem[] }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/orders`, order, { headers });
  }

      crearPreferencia(items: { name: string; price: number; quantity: number }[]) {
    return this.http.post<{ init_point: string }>(`${this.apiUrl}/checkout`, { items });
}

}