import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

  // Para mostrar mensajes en CartComponent
  _removedItems: CartItem[] = [];
  _adjustedItems: { old: number; new: number; item: CartItem }[] = [];

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
   * Carga carrito con todas las VALIDACIONES:
   * - Producto inactivo → remover
   * - Stock 0 → remover
   * - Cantidad > stock → ajustar
   */
  getCart(): Observable<CartItem[]> {
    const cart = this.getLocalCart();
    if (!cart.length) return of([]);

    const ids = cart.map(i => i.product.id);

    return this.productService.getProductsByIds(ids).pipe(
      map((updatedProducts: Product[]) => {
        const removed: CartItem[] = [];
        const adjusted: { old: number; new: number; item: CartItem }[] = [];
        const updatedCart: CartItem[] = [];

        cart.forEach(item => {
          const updated = updatedProducts.find(p => p.id === item.product.id);

          // 🔥 Si no existe o está inactivo → se remueve
          if (!updated || updated.active === false) {
            removed.push(item);
            return;
          }

          // 🔥 Sin stock → se remueve también
          if (updated.stock <= 0) {
            removed.push(item);
            return;
          }

          // 🔥 Cantidad mayor al stock → ajustar
          if (item.quantity > updated.stock) {
            adjusted.push({
              old: item.quantity,
              new: updated.stock,
              item: { product: updated, quantity: updated.stock },
            });

            updatedCart.push({
              product: updated,
              quantity: updated.stock,
            });
          } else {
            updatedCart.push({ product: updated, quantity: item.quantity });
          }
        });

        // Guardar para mostrar en el componente
        this._removedItems = removed;
        this._adjustedItems = adjusted;

        // Actualizar storage si hubo cambios
        if (removed.length > 0 || adjusted.length > 0) {
          localStorage.setItem(this.getCartKey(), JSON.stringify(updatedCart));
          this.updateCartCount();
        }

        return updatedCart;
      })
    );
  }

  addProduct(product: Product): void {
    const cart = this.getLocalCart();

    // No agregar si está inactivo
    if (!product.active) return;

    // No agregar si no hay stock
    if (product.stock <= 0) return;

    const existing = cart.find(i => i.product.id === product.id);

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity++;
      }
      // Si ya está al máximo stock, no suma más
    } else {
      cart.push({ product, quantity: 1 });
    }

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
      return;
    }

    // Evitar cantidades mayores al stock actual
    if (quantity > item.product.stock) {
      item.quantity = item.product.stock;
    } else {
      item.quantity = quantity;
    }

    localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
    this.updateCartCount();
  }

  getTotal(): number {
    const cart = this.getLocalCart();
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getCartItem(productId: number): CartItem | undefined {
  const cart = this.getLocalCart();
  return cart.find(i => i.product.id === productId);
}
}
