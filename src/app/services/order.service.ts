import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

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

  getAllOrders(filtros?: any): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    let params = new HttpParams();
  
    if (filtros) {
      if (filtros.id)        params = params.set('id', filtros.id);
      if (filtros.user)      params = params.set('user', filtros.user);
      if (filtros.product)   params = params.set('product', filtros.product);
      if (filtros.dateFrom)  params = params.set('dateFrom', filtros.dateFrom);
      if (filtros.dateTo)    params = params.set('dateTo', filtros.dateTo);
      if (filtros.minTotal)  params = params.set('minTotal', filtros.minTotal);
      if (filtros.maxTotal)  params = params.set('maxTotal', filtros.maxTotal);
      if (filtros.status)    params = params.set('status', filtros.status);
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/orders`, { headers, params });
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

  getOrderById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<any>(`${this.apiUrl}/orders/${id}`, { headers });
  }
  
  getTopSellingProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/productos-mas-vendidos`);
  }
}
