import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartItem } from './cart.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createOrder(cartItems: CartItem[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const items = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price_at_purchase: item.product.price,
    }));

    const totalAmount = items.reduce(
      (total, item) => total + item.quantity * item.price_at_purchase,
      0
    );

    const body = { items, totalAmount };

    return this.http.post(`${this.apiUrl}/orders`, body, { headers });
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
  
    
    return this.http.put(`${this.apiUrl}/order-products/${orderId}/${productId}`, { quantity }, { headers });
  }
  
  removeProductFromOrder(orderId: number, productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    
    return this.http.delete(`${this.apiUrl}/order-products/${orderId}/${productId}`, { headers });
  }
  
  
}
