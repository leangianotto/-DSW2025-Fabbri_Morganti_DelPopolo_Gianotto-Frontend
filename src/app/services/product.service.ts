import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, ProductForm } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  /** Obtener solo productos activos (ruta pública) */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /** Obtener producto por ID */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /** Obtener productos por un array de IDs */
getProductsByIds(ids: number[]): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/by-ids?ids=${ids.join(',')}`);
}

  /** Obtener productos por categoría */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  /** Obtener TODOS los productos (admin: activos + inactivos) */
  getAllProductsAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/admin/all`);
  }

  /** Crear producto */
  createProduct(product: ProductForm): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /** Actualizar producto */
  updateProduct(product: ProductForm): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  /** Desactivar producto */
  deactivateProduct(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/disable`, {});
  }

  /** Activar producto */
  activateProduct(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/enable`, {});
  }

  /** Top vendidos */
  getTopSellingProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-selling`);
  }
}
