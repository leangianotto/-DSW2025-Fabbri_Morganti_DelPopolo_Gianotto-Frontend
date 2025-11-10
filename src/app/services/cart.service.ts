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
  private getCartKey(): string {
  const user = localStorage.getItem('user');
  if (!user) return 'cart_guest';
  const parsed = JSON.parse(user);
  return `cart_${parsed.id}`;
}


  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.initCart();
  }

 private initCart() {
  const key = this.getCartKey();
  const existing = localStorage.getItem(key);

  if (!existing) {
    localStorage.setItem(key, JSON.stringify([]));
  }

  this.updateCartCount();
}


  private updateCartCount(): void {
    const cart = this.getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(total); //  actualiza navbar automáticamente
  }

  refreshCartCount(): void {
  this.updateCartCount();
}


 getCart(): CartItem[] {
  const data = localStorage.getItem(this.getCartKey());
  return data ? JSON.parse(data) : [];
}


  addProduct(product: Product): void {
  const cart = this.getCart();
  const existingItem = cart.find(i => i.product.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ product, quantity: 1 });
  }

  localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
  this.updateCartCount();
}


 removeProduct(productId: number): void {
  let cart = this.getCart();
  cart = cart.filter(item => item.product.id !== productId);
  localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
  this.updateCartCount();
}


 clearCart(): void {
  localStorage.setItem(this.getCartKey(), JSON.stringify([]));
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
        this.removeProduct(productId);
      } else {
        localStorage.setItem(this.getCartKey(), JSON.stringify(cart));
        this.updateCartCount();
      }
    }
  }
}
