import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private productService: ProductService) {
    this.initCart();
  }

  private getCartKey(): string {
    const user = localStorage.getItem('user');
    if (!user) return 'cart_guest';
    const parsed = JSON.parse(user);
    return `cart_${parsed.id}`;
  }

  private initCart() {
    const key = this.getCartKey();
    const existing = localStorage.getItem(key);
    if (!existing) localStorage.setItem(key, JSON.stringify([]));
    this.updateCartCount();
  }

  private updateCartCount(): void {
    const cart = this.getLocalCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(total);
  }

  refreshCartCount(): void {
    this.updateCartCount();
  }

  private getLocalCart(): CartItem[] {
    const data = localStorage.getItem(this.getCartKey());
    return data ? JSON.parse(data) : [];
  }

  /**
   * Devuelve un Observable<CartItem[]> con productos activos actualizados
   */
  getCart(): Observable<CartItem[]> {
    const cart = this.getLocalCart();
    if (!cart.length) return of([]);

    const ids = cart.map(i => i.product.id);

    return this.productService.getProductsByIds(ids).pipe(
      map((updatedProducts: Product[]) => {
        const removed: CartItem[] = [];
        const updatedCart: CartItem[] = [];

        cart.forEach(item => {
          const updated = updatedProducts.find(p => p.id === item.product.id);
          if (!updated || updated.active === false) {
            removed.push(item);
          } else {
            updatedCart.push({ product: updated, quantity: item.quantity });
          }
        });

        // Guardar items removidos para mostrar alerta en CartComponent
        (this as any)._removedItems = removed;

        // Actualizar localStorage si hubo cambios
        if (removed.length > 0) {
          localStorage.setItem(this.getCartKey(), JSON.stringify(updatedCart));
          this.updateCartCount();
        }

        return updatedCart;
      })
    );
  }

  addProduct(product: Product): void {
    const cart = this.getLocalCart();
    const existing = cart.find(i => i.product.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ product, quantity: 1 });
    localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
    this.updateCartCount();
  }

  removeProduct(productId: number): void {
    let cart = this.getLocalCart();
    cart = cart.filter(i => i.product.id !== productId);
    localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
    this.updateCartCount();
  }

  clearCart(): void {
    localStorage.setItem(this.getCartKey(), JSON.stringify([]));
    this.updateCartCount();
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getLocalCart();
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      this.removeProduct(productId);
    } else {
      item.quantity = quantity;
      localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
      this.updateCartCount();
    }
  }

  getTotal(): number {
    const cart = this.getLocalCart();
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
}
