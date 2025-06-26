import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';


export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
  
})
export class CartService {
  private cartKey = 'cart';
  
  constructor() {
    this.initCart();
  }

  private initCart() {
    const existing = localStorage.getItem(this.cartKey);
    if (!existing) {
      localStorage.setItem(this.cartKey, JSON.stringify([]));
      this.updateCartCount();
    }
  }

  private cartCountSubject = new BehaviorSubject<number>(0);
cartCount$ = this.cartCountSubject.asObservable(); // observable para suscribirse

private updateCartCount(): void {
  const cart = this.getCart();
  this.cartCountSubject.next(cart.reduce((sum, item) => sum + item.quantity, 0));
}

  getCart(): CartItem[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  addProduct(product: Product): void {
    const cart = this.getCart();
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ product, quantity: 1 });
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  removeProduct(productId: number): void {
    let cart = this.getCart();
    cart = cart.filter((item) => item.product.id !== productId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  clearCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify([]));
    this.updateCartCount();
  }

  getTotal(): number {
    const cart = this.getCart();
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeProduct(productId); // elimina si es 0 o menos
      } else {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this.updateCartCount();
      }
    }
  }
}
