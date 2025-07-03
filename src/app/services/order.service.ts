import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  createOrder(order: { userId: any; totalAmount: number; items: { productId: number; quantity: number }[] }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/orders`, order, { headers });
  }

  getAllOrders(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/orders`, { headers });
  }

  deleteOrder(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/orders/${id}`, { headers });
  }

  updateOrder(id: number, body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`${this.apiUrl}/orders/${id}`, body, { headers });
  }

  updateOrderProductQuantity(orderId: number, productId: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    
    return this.http.put(`${this.apiUrl}/orderProducts/${orderId}/${productId}`, { quantity }, { headers });
  }

  removeProductFromOrder(orderId: number, productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    
    return this.http.delete(`${this.apiUrl}/orderProducts/${orderId}/${productId}`, { headers });
  }

  crearPreferencia(items: { title: string; unit_price: number; quantity: number }[]) {
    return this.http.post<{ init_point: string }>(`${this.apiUrl}/checkout`, { items });
  }

  getUserOrders(): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    return this.http.get<any[]>(`${this.apiUrl}/orders/my-orders`, { headers });
  }
}
